# AstroRoastScripts

Utility scripts to generate cosmic events and AI-powered roasts for the AstroRoast application.

## Overview

This package contains backend automation scripts that:

1. Calculate cosmic events based on planetary positions and aspects
2. Generate personalized, AI-powered daily roasts for each zodiac sign
3. Store data in Supabase for consumption by the mobile app

## Scripts

### 1. Cosmic Events Generator

**File**: `cosmic_events/generate_cosmic_events.ts`

Calculates planetary positions using Swiss Ephemeris and generates daily cosmic events over a specified date range.

#### Detected Events

- **Retrograde**: When a planet's apparent motion reverses
- **Ingress**: When a planet changes zodiacal sign
- **Opposition**: Two planets separated by approximately 180°
- **Square**: Two planets separated by approximately 90°
- **Moon Position**: Fallback if no major events detected

#### Selection Priority

The script selects one event per day in the following order:

1. Retrograde
2. Opposition
3. Square
4. Ingress
5. Moon position fallback

#### Configuration

- **Orb margin**: 6° for oppositions and squares
- **Date range**: Edit `startDate` and `endDate` in the script (currently configured for May 1-31, 2026)
- **Planets**: Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto

### 2. Daily Roasts Generator

**File**: `roasts/generate_daily_roasts.ts`

Generates AI-powered daily roasts for each zodiac sign using the Mistral AI API.

#### Features

- Creates unique roasts based on astrological context
- Generates roasts for all 12 zodiac signs
- Stores roasts with metadata and timestamps
- Integrates with cosmic events for enhanced personalization

#### Output

Roasts are stored in the Supabase database with:

- Zodiac sign
- Roast content
- Generated date
- Associated cosmic event (if applicable)

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the project root with:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
SERVICE_ROLE_KEY=your_service_role_key
MISTRAL_API_KEY=your_mistral_api_key
```

**Required variables**:

- `EXPO_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `SERVICE_ROLE_KEY`: Supabase service role key for admin access
- `MISTRAL_API_KEY`: API key for Mistral AI (roasts generation only)

The scripts will exit immediately if any required environment variable is missing.

## Usage

### Generate Cosmic Events

```bash
npx tsx cosmic_events/generate_cosmic_events.ts
```

### Generate Daily Roasts

```bash
npm run generate-roasts
```

Or directly:

```bash
npx tsx roasts/generate_daily_roasts.ts
```

## Dependencies

- **@supabase/supabase-js**: Database and authentication
- **@mistralai/mistralai**: AI-powered text generation
- **swisseph**: Astronomical calculations and ephemeris data
- **tsx**: TypeScript execution
- **dotenv**: Environment variable loading

## Notes

- Swiss Ephemeris provides accurate astronomical data for precise planetary calculations
- Mistral AI generates natural, contextual roasts for each zodiac sign
- All data is persisted in Supabase for real-time access by the mobile app
- Scripts are designed to be run periodically (daily, weekly, etc.) to refresh data

## Troubleshooting

**Missing environment variables**: Ensure all required `.env` variables are set before running scripts

**Astronomical accuracy**: Calculations are precise to within minutes for planetary positions

**Rate limiting**: Be aware of Mistral API rate limits when generating large volumes of roasts
