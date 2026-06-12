import swisseph from "swisseph";
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { ZODIAC_SIGNS } from "../constants";

const { EXPO_PUBLIC_SUPABASE_URL, SERVICE_ROLE_KEY } = process.env;

if (!EXPO_PUBLIC_SUPABASE_URL || !SERVICE_ROLE_KEY) {
  throw new Error(
    "Missing EXPO_PUBLIC_SUPABASE_URL or SERVICE_ROLE_KEY in environment",
  );
}

// Configuration Supabase
const supabase = createClient(EXPO_PUBLIC_SUPABASE_URL, SERVICE_ROLE_KEY);

const PLANETS = [
  { name: "Sun", id: swisseph.SE_SUN },
  { name: "Moon", id: swisseph.SE_MOON },
  { name: "Mercury", id: swisseph.SE_MERCURY },
  { name: "Venus", id: swisseph.SE_VENUS },
  { name: "Mars", id: swisseph.SE_MARS },
  { name: "Jupiter", id: swisseph.SE_JUPITER },
  { name: "Saturn", id: swisseph.SE_SATURN },
  { name: "Uranus", id: swisseph.SE_URANUS },
  { name: "Neptune", id: swisseph.SE_NEPTUNE },
  { name: "Pluto", id: swisseph.SE_PLUTO },
];

const OPPOSITION_ORB = 6;
const SQUARE_ORB = 6;
const EVENT_PRIORITY = {
  retrograde: 4,
  opposition: 3,
  square: 2,
  ingres: 1,
} as const;

type MajorEvent = {
  type: keyof typeof EVENT_PRIORITY;
  evenement: string;
  description: string;
  priority: number;
};

function normalizeAngle(angle: number) {
  return ((angle % 360) + 360) % 360;
}

async function getDailyEvent(julianDay: number) {
  let majorEvent: MajorEvent | null = null;
  const planetPositions = [];

  for (const planet of PLANETS) {
    const currentPlanetPosition = swisseph.swe_calc_ut(
      julianDay,
      planet.id,
      swisseph.SEFLG_SPEED,
    );

    // 1. Ingrès (moving into a new sign): compare current longitude with previous day
    const prevPlanetPosition = swisseph.swe_calc_ut(
      julianDay - 1,
      planet.id,
      swisseph.SEFLG_SPEED,
    );

    if (
      "longitude" in currentPlanetPosition &&
      "longitude" in prevPlanetPosition
    ) {
      if (
        currentPlanetPosition.longitude === undefined ||
        prevPlanetPosition.longitude === undefined ||
        currentPlanetPosition.longitude > 360 ||
        prevPlanetPosition.longitude > 360 ||
        currentPlanetPosition.longitude < 0 ||
        prevPlanetPosition.longitude < 0
      ) {
        console.warn(
          `Longitude data missing for ${planet.name} on julian day ${julianDay}`,
        );
        return null;
      }
      const currentSign = Math.floor(currentPlanetPosition.longitude / 30);
      const prevSign = Math.floor(prevPlanetPosition.longitude / 30);

      planetPositions.push({
        name: planet.name,
        longitude: currentPlanetPosition.longitude,
        longitudeSpeed: currentPlanetPosition.longitudeSpeed,
      });

      if (currentSign !== prevSign) {
        const candidateEvent: MajorEvent = {
          type: "ingres",
          evenement: `${planet.name} in ${ZODIAC_SIGNS[currentSign]}`,
          description: `The ${planet.name} enters the sign ${ZODIAC_SIGNS[currentSign]}.`,
          priority: EVENT_PRIORITY.ingres,
        };

        if (!majorEvent || candidateEvent.priority > majorEvent.priority) {
          majorEvent = candidateEvent;
        }
      }

      // 2. Retrogradation: check if the speed changes from positive to negative
      if (
        currentPlanetPosition.longitudeSpeed < 0 &&
        prevPlanetPosition.longitudeSpeed >= 0
      ) {
        const candidateEvent: MajorEvent = {
          type: "retrograde",
          evenement: `${planet.name} retrograde`,
          description: `The ${planet.name} appears to be moving backwards, prepare for misunderstandings.`,
          priority: EVENT_PRIORITY.retrograde,
        };

        if (!majorEvent || candidateEvent.priority > majorEvent.priority) {
          majorEvent = candidateEvent;
        }
      }
    } else {
      console.warn(
        `Position not available for ${planet.name} on julian day ${julianDay}`,
      );
      return null;
    }
  }

  for (let i = 0; i < planetPositions.length; i += 1) {
    for (let j = i + 1; j < planetPositions.length; j += 1) {
      const firstPlanet = planetPositions[i];
      const secondPlanet = planetPositions[j];
      const separation = normalizeAngle(
        Math.abs(firstPlanet.longitude - secondPlanet.longitude),
      );

      if (Math.abs(separation - 180) <= OPPOSITION_ORB) {
        const candidateEvent: MajorEvent = {
          type: "opposition",
          evenement: `${firstPlanet.name} opposite ${secondPlanet.name}`,
          description: `${firstPlanet.name} and ${secondPlanet.name} are in opposition, creating tension and reflection.`,
          priority: EVENT_PRIORITY.opposition,
        };

        if (!majorEvent || candidateEvent.priority > majorEvent.priority) {
          majorEvent = candidateEvent;
        }
      }

      if (
        Math.abs(separation - 90) <= SQUARE_ORB ||
        Math.abs(separation - 270) <= SQUARE_ORB
      ) {
        const candidateEvent: MajorEvent = {
          type: "square",
          evenement: `${firstPlanet.name} square ${secondPlanet.name}`,
          description: `${firstPlanet.name} and ${secondPlanet.name} are in square, creating friction and action.`,
          priority: EVENT_PRIORITY.square,
        };

        if (!majorEvent || candidateEvent.priority > majorEvent.priority) {
          majorEvent = candidateEvent;
        }
      }
    }
  }

  if (majorEvent) {
    const { priority, ...event } = majorEvent;
    return event;
  }

  // If no major event, we can still store the Moon position as a fallback.
  const moonPositionData = swisseph.swe_calc_ut(
    julianDay,
    swisseph.SE_MOON,
    swisseph.SEFLG_SPEED,
  );

  if (!("longitude" in moonPositionData)) {
    return null;
  }

  const moonPosition = Math.floor(moonPositionData.longitude / 30);

  return {
    type: "moon",
    evenement: `Moon in ${ZODIAC_SIGNS[moonPosition]}`,
    description: `The Moon is in the sign ${ZODIAC_SIGNS[moonPosition]}.`,
  };
}

async function run() {
  const startDate = new Date("2026-05-01");
  const endDate = new Date("2026-12-31");

  for (let day = startDate; day <= endDate; day.setDate(day.getDate() + 1)) {
    const jd = swisseph.swe_julday(
      day.getFullYear(),
      day.getMonth() + 1,
      day.getDate(),
      12,
      swisseph.SE_GREG_CAL,
    );
    const event = await getDailyEvent(jd);

    if (event) {
      await supabase.from("cosmic_events").insert({
        date: day.toISOString().split("T")[0],
        ...event,
      });
    }

    if (!event) {
      console.log(
        `No significant event for ${day.toISOString().split("T")[0]}`,
      );
    }
  }
}

run()
  .then(() => {
    console.log("Cosmic events generation completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error generating cosmic events:", error);
    process.exit(1);
  });
