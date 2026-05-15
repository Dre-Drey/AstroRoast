# AstroRoast Mobile App

A React Native mobile application providing personalized daily roasts and cosmic insights based on astrological data and daily cosmic events.

## Project Overview

AstroRoast is a cross-platform mobile app built with **Expo** and **React Native** that combines astrology with AI-generated humor. Users can explore their astrological profile, view cosmic events, and receive daily personalized roasts.

## Technical Architecture

### Technology Stack

- **React Native**: Cross-platform mobile framework
- **Expo**: Development platform and managed services
- **React Navigation**: Tab and stack-based navigation
- **TypeScript**: Type-safe development
- **Supabase**: Authentication and database backend
- **React Query (@tanstack/react-query)**: Data fetching, caching, and synchronization
- **Expo UI Libraries**: Blur effects, fonts, linear gradients, safe areas
- **Lucide React Native**: SVG-based icon library

## Project Structure

```
src/
├── screens/
│   ├── AuthScreen.tsx           # User authentication flow
│   ├── HomeScreen.tsx           # Main app home/dashboard
│   ├── BurnScreen.tsx           # Daily roast display
│   ├── ProfileScreen.tsx        # User profile and settings
│   └── AccountScreen.tsx        # Account management
│
├── contexts/
│   └── AuthContext.tsx          # Global authentication state
│
├── lib/
│   └── supabase.ts              # Supabase client configuration
│
├── types/
│   ├── navigation.ts            # Navigation type definitions
│   └── database.ts              # Database schema types
│
├── constants/
│   └── theme.ts                 # Colors, spacing, typography
│
├── actions.ts                   # Data fetching
├── App.tsx                      # Root app component with navigation
└── index.ts                     # Entry point
```

## Architecture Details

### Navigation Structure

The app uses a **Tab Navigator** (bottom tabs) with **Stack Navigators** for each section:

- **Burn Tab**: View daily roasts and cosmic events
- **Profile Tab**: User profile and astrological information

### State Management

- **React Query**: Handles server state, caching, and background synchronization
- **Context API**: AuthContext manages authentication state globally
- **Async Storage**: Persists user session and preferences locally

### Authentication

- Uses Supabase Auth for secure user registration and login
- Session tokens stored locally via async-storage
- Protected routes based on authentication state

### Theming

Custom theme defined in `constants/theme.ts`:

- **Color scheme**: Warm, earthy palette with primary accent
- **Background**: Light cream (#f6efe8)
- **Primary**: Warm brown (#8c4f2b)
- **Text**: Dark brown (#25170f)
- Applied globally via React Navigation theme configuration

## Installation

### Prerequisites

- **Node.js** 18+ and npm/yarn
- **Expo CLI**: `npm install -g expo-cli`
- iOS: Xcode (macOS) or Android Studio (all platforms)

### Setup Steps

1. **Clone and navigate**:

   ```bash
   cd AstroRoast
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create an `.env` file in the project root:

   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Verify TypeScript configuration**:
   The project includes `tsconfig.json` with React Native and Expo settings pre-configured.

## Running Locally

### Development Mode

Start the Expo development server:

```bash
npm start
```

This opens the Expo menu in your terminal with options:

- **Press `i`** to open iOS simulator (macOS only)
- **Press `a`** to open Android emulator
- **Press `w`** to open web preview
- **Press `s`** to send link via QR code for mobile testing

### iOS (macOS)

```bash
npm run ios
```

Requires Xcode and iOS simulator setup.

### Android

```bash
npm run android
```

Requires Android Studio and emulator/device setup.

### Web (Browser)

```bash
npm run web
```

Runs a web preview (useful for quick UI testing).

### Using Device

1. Install **Expo Go** app on your phone (iOS App Store or Google Play)
2. Run `npm start`
3. Scan the QR code with your phone's camera
4. App launches in Expo Go

## Development Workflow

### Hot Reload

- **Fast Refresh**: Code changes automatically reload in the running app
- **Preserve State**: App state is maintained between reloads
- **Works for**: JavaScript/TypeScript and styling changes

### Debugging

- **Expo DevTools**: Access via menu (press `d` in terminal)
- **React DevTools**: Available through Expo DevTools menu
- **Console**: View logs directly in terminal or Expo dashboard

### Building for Deployment

#### iOS Build:

```bash
expo build:ios
```

#### Android Build:

```bash
expo build:android
```

#### Production Build (Managed):

```bash
eas build --platform ios
eas build --platform android
```

See [Expo Docs](https://docs.expo.dev/) for detailed build instructions.

## API Integration

### Supabase

The app connects to Supabase for:

- User authentication
- Profile data storage
- Cosmic events and roasts retrieval
- Real-time updates (via subscriptions)

Configuration in `src/lib/supabase.ts`:

## Key Features

- **User Authentication**: Secure login/signup with Supabase
- **Astrological Profiles**: Store and display user zodiac information
- **Daily Roasts**: AI-generated personalized roasts fetched from backend
- **Cosmic Events**: Display planetary positions and astrological aspects
- **Offline Support**: React Query enables offline caching
- **Real-time Sync**: Supabase subscriptions for live data updates
- **Responsive Design**: Mobile-first UI that adapts to different screen sizes

## Troubleshooting

### Dependencies Installation Issues

```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules
npm install
```

### Expo Issues

```bash
# Update Expo CLI
npm install -g expo-cli@latest

# Clear Expo cache
expo start -c
```

### Build Failures

- Ensure all environment variables are set
- Check `tsconfig.json` is properly configured
- Verify iOS/Android SDK versions match requirements
- Clear build cache: `expo prebuild --clean`

### Hot Reload Not Working

- Restart the development server
- Clear device cache: `npm start -- --clear`
- Reinstall app from Expo Go

## Performance Tips

- Use React Query for efficient data fetching
- Leverage memoization for heavy component rendering
- Optimize images and assets in `assets/` folder
- Use Expo's built-in optimization tools

## Contributing

- Follow TypeScript strict mode guidelines
- Maintain component organization in `screens/`
- Use theme constants for all styling
- Test on both iOS and Android before committing

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Supabase Docs](https://supabase.com/docs)
- [Astrology API Reference](../AstroRoastScripts/README.md)