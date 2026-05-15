# AstroRoast

An astrology-inspired mobile application that provides personalized daily roasts and cosmic insights based on your astrological profile.

## Project Overview

AstroRoast is a React Native application built with Expo that combines astrology, humor, and modern mobile development. The project is organized into two main components:

- **AstroRoast**: A mobile app providing users with daily cosmic roasts and astrological information
- **AstroRoastScripts**: Backend scripts for generating cosmic events and daily roasts powered by AI

## Project Structure

```
AstroRoastProject/
├── AstroRoast/                 # React Native mobile application
│   ├── src/
│   │   ├── screens/            # App screens (Auth, Home, Burn, Profile, Account)
│   │   ├── contexts/           # React contexts (Authentication)
│   │   ├── lib/                # External services (Supabase integration)
│   │   ├── types/              # TypeScript definitions
│   │   └── constants/          # Theme and constants
│   ├── assets/                 # Images and media assets
│   ├── App.tsx                 # Main app component with navigation
│   └── package.json            # App dependencies
│
└── AstroRoastScripts/          # Backend automation scripts
    ├── cosmic_events/          # Cosmic event generation
    ├── roasts/                 # Daily roast generation
    ├── constants.ts            # Shared constants (zodiac signs, etc.)
    └── package.json            # Script dependencies
```

## Technology Stack

### Frontend (AstroRoast)

- **React Native** - Cross-platform mobile framework
- **Expo** - Development and deployment platform
- **React Navigation** - Stack and tab navigation
- **Supabase** - Backend services (authentication, database)
- **React Query** - Data fetching and caching
- **TypeScript** - Type-safe development
- **Lucide React Native** - Icon library

### Backend Scripts (AstroRoastScripts)

- **TypeScript/Node.js** - Script runtime
- **Swiss Ephemeris** - Astronomical calculations
- **Mistral AI** - AI-powered roast generation
- **Supabase** - Database operations

## Key Features

- **User Authentication**: Secure auth via Supabase
- **Cosmic Events Calculation**: Real-time planetary positions and aspects
- **AI-Generated Roasts**: Daily personalized roasts based on astrological data
- **User Profiles**: Account management and astrological information
- **Responsive Design**: Mobile-first UI with custom theming

## Getting Started

### AstroRoast Mobile App

See [AstroRoast/README.md](AstroRoast/README.md) for installation and running instructions.

### AstroRoastScripts

See [AstroRoastScripts/README.md](AstroRoastScripts/README.md) for script setup and usage.

## Development Workflow

1. Start the mobile app in development mode
2. Use the scripts to generate cosmic events and roasts
3. View data in Supabase dashboard
4. Build and deploy to production

## Environment Configuration

Both the app and scripts require a `.env` file with:

- `EXPO_PUBLIC_SUPABASE_URL`
- `SERVICE_ROLE_KEY` (scripts only)
- `MISTRAL_API_KEY` (scripts only)

