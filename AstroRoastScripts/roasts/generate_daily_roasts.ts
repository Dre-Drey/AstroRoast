import { createClient } from "@supabase/supabase-js";
import { Mistral } from "@mistralai/mistralai";
import "dotenv/config";
import { ZODIAC_SIGNS } from "../constants";

const { EXPO_PUBLIC_SUPABASE_URL, SERVICE_ROLE_KEY, MISTRAL_API_KEY } =
  process.env;

if (!EXPO_PUBLIC_SUPABASE_URL || !SERVICE_ROLE_KEY || !MISTRAL_API_KEY) {
  throw new Error("Missing required environment variables");
}

const supabase = createClient(EXPO_PUBLIC_SUPABASE_URL, SERVICE_ROLE_KEY);
const mistral = new Mistral({ apiKey: MISTRAL_API_KEY });

function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

function safeParseJSON(input: string) {
  try {
    return JSON.parse(input);
  } catch (e) {
    return null;
  }
}

function normalizeRoastData(parsed: any, sign: string) {
  if (!parsed || typeof parsed !== "object") return null;
  // Accept several possible key names coming from model output
  const hook =
    (parsed.roast_hook ?? parsed.hook ?? parsed.roastHook ?? parsed.roast) ||
    parsed.roast_hook;
  const content =
    (parsed.main_roast ?? parsed.mainRoast ?? parsed.content ?? parsed.main) ||
    parsed.main_roast;
  const advice =
    parsed.cosmic_advice ??
    parsed.cosmicAdvice ??
    parsed.advice ??
    parsed.advice_text;

  if (!hook || !content || !advice) return null;

  // enforce max lengths
  const MAX_CONTENT = 250;
  const cleanContent =
    typeof content === "string"
      ? content.trim().slice(0, MAX_CONTENT)
      : String(content).slice(0, MAX_CONTENT);
  return {
    hook: String(hook).trim(),
    content: cleanContent,
    advice: String(advice).trim(),
  };
}

function generateFallbackRoast(sign: string, eventDescription: string) {
  const hook = `${sign} in the spotlight`;
  const content =
    `${sign}: cosmic vibes collide with ${eventDescription}. A cheeky roast for the sign — witty, sharp, harmless.`.slice(
      0,
      400,
    );
  const advice = "Take a breath, not the spotlight.";
  return { hook, content, advice };
}

async function generateWeeklyRoasts() {
  const startDate = new Date().toISOString().split("T")[0]; // default is today

  // 1. Get the cosmic event for a week from Supabase
  const { data: events, error } = await supabase
    .from("cosmic_events")
    .select("*")
    .gte("date", startDate)
    .order("date", { ascending: true })
    .limit(2);

  if (error) {
    console.error("Error fetching events from Supabase:", error);
    return;
  }

  if (!events || events.length === 0) {
    console.log(`No event found, skipping...`);
    return;
  }

  console.log(
    `Generating roasts for ${events.length} events starting from ${startDate}`,
  );

  for (const event of events) {
    console.log(`--- Day : ${event.date} (${event.description}) ---`);
    for (const sign of ZODIAC_SIGNS) {
      try {
        // Retry logic for external model call
        const maxRetries = 3;
        let attempt = 0;
        let lastError: any = null;
        let parsedNormalized: any = null;

        while (attempt < maxRetries && !parsedNormalized) {
          attempt += 1;
          try {
            const response = await mistral.chat.complete({
              model: "mistral-small-latest",
              messages: [
                {
                  role: "system",
                  content:
                    "You are AstroRoast, the satirical AI of the 'Cosmic Tabloid application'. Your tone is cynical, but sophisticated and never mean or cruel. You say nothing racist, sexist, or anything that could offend people's political, religious, or sexual beliefs. You make no assumptions about your reader's gender or sexual orientation (use neutral terms if necessary). You can embellish your response with cultural or pop culture references if needed. You take into account the stereotypes about the signs and common misconceptions about the current cosmic event to create a witty and entertaining roast.",
                },
                {
                  role: "user",
                  content: `Today's cosmic event is: ${event.description}. The sign is ${sign}. Generate a roast for this sign based on the cosmic event. The roast should be witty, aggressive but never mean or cruel, and should not exceed 400 characters. Also provide a passive-aggressive cosmic advice in 10 words max. Output format (JSON only, strictly this format): { "astro_sign": "${sign}", "roast_hook": "<hook>", "main_roast": "<main>", "cosmic_advice": "<advice>" }`,
                },
              ],
              responseFormat: { type: "json_object" },
            });

            // Basic validation of response
            if (
              !response ||
              !response.choices ||
              response.choices.length === 0
            ) {
              lastError = new Error("Empty response from model");
              throw lastError;
            }

            const raw = response.choices[0].message?.content ?? "";
            const parsed =
              safeParseJSON(raw) ||
              safeParseJSON(Array.isArray(raw) ? raw[0] : raw);
            parsedNormalized = normalizeRoastData(parsed, sign);
            if (!parsedNormalized) {
              lastError = new Error("Model returned unexpected JSON structure");
              throw lastError;
            }
          } catch (e) {
            lastError = e;
            const backoff = 200 * Math.pow(2, attempt - 1);
            console.warn(
              `Attempt ${attempt} failed for ${sign} on ${event.date}:`,
              e?.message || e,
            );
            if (attempt < maxRetries) await sleep(backoff);
          }
        }

        if (!parsedNormalized) {
          console.error(
            `Model failed after ${maxRetries} attempts for ${sign} on ${event.date}. Using fallback.`,
          );
          parsedNormalized = generateFallbackRoast(
            sign,
            event.description || "the sky",
          );
        }

        // 2. Insert into Supabase
        const { error: insertError } = await supabase
          .from("daily_roasts")
          .upsert(
            {
              sign,
              date: event.date,
              hook: parsedNormalized.hook,
              content: parsedNormalized.content,
              advice: parsedNormalized.advice,
              event_id: event.id,
            },
            { onConflict: "date,sign" },
          );

        if (insertError) {
          console.error(
            `Supabase insert error for ${sign} on ${event.date}:`,
            insertError,
          );
        } else {
          console.log(`${sign} done.`);
        }
        console.log(parsedNormalized);

        // small delay to avoid rate limits
        await sleep(150);
      } catch (err) {
        console.error(`Unhandled error for ${sign} on ${event.date}:`, err);
      }
    }
  }
  console.log("Roasts generation completed!");
}

generateWeeklyRoasts();
