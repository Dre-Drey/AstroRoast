import { createClient } from "@supabase/supabase-js";
import { Mistral } from "@mistralai/mistralai";
import "dotenv/config";
import { ZODIAC_SIGNS } from "../constants";
import { SYSTEM_PROMPT, buildUserPrompt, getRandomStyleHint } from "./prompts";

const { EXPO_PUBLIC_SUPABASE_URL, SERVICE_ROLE_KEY, MISTRAL_API_KEY } =
  process.env;

if (!EXPO_PUBLIC_SUPABASE_URL || !SERVICE_ROLE_KEY || !MISTRAL_API_KEY) {
  throw new Error("Missing required environment variables");
}

const supabase = createClient(EXPO_PUBLIC_SUPABASE_URL, SERVICE_ROLE_KEY);
const mistral = new Mistral({ apiKey: MISTRAL_API_KEY, timeoutMs: 60000 });

interface CosmicEvent {
  id: string;
  date: string;
  evenement: string;
  type: string;
  description: string;
}

interface RoastEntry {
  sign: string;
  hook?: string;
  main_roast?: string;
  cosmic_advice?: string;
  content?: string;
  advice?: string;
  mainRoast?: string;
  cosmicAdvice?: string;
}

interface NormalizedRoast {
  hook: string;
  content: string;
  advice: string;
}

function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

function trimRoastContent(
  content: string,
  maxLength = 400,
  minSentenceEnd = 300,
): string {
  const trimmed = content.replace(/\s*—\s*/g, ", ").trim();

  if (trimmed.length <= maxLength) {
    return trimmed;
  }
  // Search for a period, exclamation mark, or question mark after the minSentenceEnd position to avoid cutting off mid-sentence
  const searchWindow = trimmed.slice(minSentenceEnd, maxLength);
  const sentenceEndMatch = searchWindow.match(/[.!?](?=[^.!?]*$)/);

  if (sentenceEndMatch?.index !== undefined) {
    return trimmed.slice(0, minSentenceEnd + sentenceEndMatch.index + 1).trim();
  }

  return trimmed.slice(0, maxLength).trim();
}

function normalizeRoast(entry: RoastEntry): NormalizedRoast | null {
  const hook = entry.hook?.trim();
  const content = trimRoastContent(
    entry.main_roast ?? entry.content ?? entry.mainRoast ?? "",
  );
  const advice = (
    entry.cosmic_advice ??
    entry.advice ??
    entry.cosmicAdvice ??
    ""
  ).trim();

  if (!hook || !content || !advice) return null;

  return { hook, content, advice };
}

function generateFallbackRoast(
  sign: string,
  eventDescription: string,
): NormalizedRoast {
  const hook = `${sign} in the spotlight`;
  const content = `${sign}: cosmic vibes collide with ${eventDescription}. A cheeky roast for the sign — witty, sharp, harmless.`;
  const advice = "Take a breath, not the spotlight.";
  return { hook, content, advice };
}

async function generateRoastsForEvent(
  event: CosmicEvent,
  styleHint: string,
  seed: number,
): Promise<Map<string, NormalizedRoast>> {
  const results = new Map<string, NormalizedRoast>();
  const userPrompt = buildUserPrompt({
    date: event.date,
    eventDescription: event.description,
    styleHint,
    seed,
  });
  const MAX_RETRIES = 3;
  const RETRYABLE_ERRORS = ["TimeoutError", "429", "500", "503"];

  console.log(
    `Generating roasts for ${event.description} - ${event.date} in style: ${styleHint} (seed: ${seed})`,
  );

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await mistral.chat.complete({
        model: "mistral-large-latest",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        responseFormat: { type: "json_object" },
        maxTokens: 4096,
      });

      console.log(
        `Model response received for ${event.date} on attempt ${attempt}`,
      );
      const raw = response.choices?.[0]?.message?.content ?? "";
      const text = Array.isArray(raw)
        ? raw.map((b: any) => b.text ?? "").join("")
        : raw;

      try {
        const parsed = JSON.parse(text);
        if (
          !parsed.roasts ||
          !Array.isArray(parsed.roasts) ||
          parsed.roasts.length === 0
        ) {
          throw new Error("Parsed JSON does not contain a 'roasts' array");
        }

        for (const entry of parsed.roasts as RoastEntry[]) {
          const canonicalSign = ZODIAC_SIGNS.find(
            (s) => s.toLowerCase() === entry.sign?.toLowerCase(),
          );
          if (!canonicalSign) {
            console.warn(`Unknown sign in response: ${entry.sign} — skipped`);
            continue;
          }
          const normalized = normalizeRoast(entry);
          if (normalized) {
            results.set(canonicalSign, normalized);
          } else {
            console.warn(
              `Incomplete roast for ${entry.sign} — will use fallback`,
            );
          }
        }
      } catch (parseError: any) {
        throw new Error(
          `Failed to parse model response as JSON: ${parseError?.message}`,
        );
      }
      // Vérifier que les 12 signes sont couverts
      const missingSigns = ZODIAC_SIGNS.filter((s) => !results.has(s));
      if (missingSigns.length > 0) {
        throw new Error(
          `Missing signs in response: ${missingSigns.join(", ")}`,
        );
      }

      return results;
    } catch (err: any) {
      console.warn(
        `Attempt ${attempt}/${MAX_RETRIES} failed for ${event.date}: ${err.message}`,
      );
      if (
        attempt < MAX_RETRIES &&
        RETRYABLE_ERRORS.some((e) => err.message.includes(e))
      ) {
        const delay = 300 * Math.pow(2, attempt - 1);
        console.log(`Retrying after ${delay}ms...`);
        await sleep(delay); // exponentional backoff : 300ms, 600ms
        continue;
      } else {
        throw err; // non-retryable error or max attempts reached
      }
    }
  }
  // Fallback for missing signs after retries exhausted
  console.error(
    `Model failed after ${MAX_RETRIES} attempts for ${event.date}. Fallback applied to missing signs.`,
  );
  for (const sign of ZODIAC_SIGNS) {
    if (!results.has(sign)) {
      results.set(sign, generateFallbackRoast(sign, event.description));
    }
  }

  return results;
}

async function upsertRoasts(
  event: CosmicEvent,
  roasts: Map<string, NormalizedRoast>,
): Promise<void> {
  const rows = Array.from(roasts.entries()).map(([sign, roast]) => ({
    sign,
    date: event.date,
    hook: roast.hook,
    content: roast.content,
    advice: roast.advice,
    event_id: event.id,
  }));

  const { error } = await supabase.from("daily_roasts").upsert(rows, {
    onConflict: "date,sign",
  });

  if (error) {
    console.error(
      `Failed to upsert roasts for ${event.date}: ${error.message}`,
    );
  } else {
    console.log(`Successfully upserted roasts for ${event.date}`);
  }
}

// MAIN FUNCTION
async function generateWeeklyRoasts(): Promise<void> {
  const NUMBER_OF_DAYS = 2; // adjust as needed
  const startDate = new Date('2026-06-23').toISOString().split("T")[0];

  const { data: events, error } = await supabase
    .from("cosmic_events")
    .select("*")
    .gte("date", startDate)
    .order("date", { ascending: true })
    .limit(NUMBER_OF_DAYS); // default is one week, to adjust

  if (error) {
    console.error("Error fetching events:", error);
    return;
  }

  if (!events || events.length === 0) {
    console.log("No upcoming events found — nothing to generate.");
    return;
  }

  console.log(
    `Generating roasts for ${NUMBER_OF_DAYS} day(s) from ${startDate}`,
  );

  // Generate and upsert roasts for each cosmic event
  for (const event of events as CosmicEvent[]) {
    // For each event, we generate a unique style hint and seed to ensure variety even if the same event appears in multiple batches.
    const seed = Math.floor(Math.random() * 99999);
    const styleHint = getRandomStyleHint();

    console.log(`\n--- ${event.date} : ${event.description} ---`);
    const roasts = await generateRoastsForEvent(event, styleHint, seed);
    console.log(
      `\n--- ${event.date} : Roasts generated, now upserting to database... ---`,
    );
    await upsertRoasts(event, roasts);

    // small delay to avoid rate limits
    await sleep(2000);
  }

  console.log("\nGeneration completed.");
}

generateWeeklyRoasts();
