<p align="center">
  <a href="https://clerk.com?utm_source=github&utm_medium=clerk_docs" target="_blank" rel="noopener noreferrer">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="./assets/images/light-logo.png">
      <img alt="Clerk Logo for light background" src="./assets/images/dark-logo.png" height="64">
    </picture>
  </a>
  <br />
</p>
<div align="center">
  <h1>
    Clerk and Expo Quickstart
  </h1>
  <a href="https://www.npmjs.com/package/@clerk/clerk-js">
    <img alt="Downloads" src="https://img.shields.io/npm/dm/@clerk/clerk-js" />
  </a>
  <a href="https://discord.com/invite/b5rXHjAg7A">
    <img alt="Discord" src="https://img.shields.io/discord/856971667393609759?color=7389D8&label&logo=discord&logoColor=ffffff" />
  </a>
  <a href="https://twitter.com/clerkdev">
    <img alt="Twitter" src="https://img.shields.io/twitter/url.svg?label=%40clerkdev&style=social&url=https%3A%2F%2Ftwitter.com%2Fclerkdev" />
  </a>
  <br />
  <br />
  <img alt="Clerk Hero Image" src="./assets/images/hero.png">
</div>

## Introduction

Clerk is a developer-first authentication and user management solution. It provides pre-built React components and hooks for sign-in, sign-up, user profile, and organization management. Clerk is designed to be easy to use and customize, and can be dropped into any React or Next.js application.

This quickstart demonstrates how to integrate Clerk with Expo and works with **Expo Go** out of the box. Native Apple Sign-In is available as an optional feature that requires a native build.

After following the quickstart you'll have learned how to:

- Install `@clerk/clerk-expo`
- Setup your environment key
- Wrap your Expo app in `<ClerkProvider />` and supply your `tokenCache`
- Conditionally show content based on your auth state
- Build your sign-in and sign-up pages
- **(Optional)** Enable native Apple Sign-In on iOS

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/clerk/clerk-expo-quickstart
cd clerk-expo-quickstart
```

### 2. Set up Clerk

1. Sign up for a Clerk account at [https://clerk.com](https://dashboard.clerk.com/sign-up?utm_source=DevRel&utm_medium=docs&utm_campaign=templates&utm_content=10-24-2023&utm_term=clerk-expo-quickstart).

2. Go to the [Clerk dashboard](https://dashboard.clerk.com?utm_source=DevRel&utm_medium=docs&utm_campaign=templates&utm_content=10-24-2023&utm_term=clerk-expo-quickstart) and create an application.

3. Copy your publishable key from the Clerk Dashboard.

4. Create a `.env` file in the root directory:

   ```bash
   cp .env.example .env
   ```

5. Add your Clerk publishable key to `.env`:
   ```
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
   ```

### 3. Install dependencies

```bash
npm install
```

### 4. Run the app

#### Option A: Expo Go (Recommended for quick testing)

```bash
npm start
```

Scan the QR code with:

- **iOS**: Camera app
- **Android**: Expo Go app

The app will run with email/password authentication by default.

#### Option B: Development Build (For native features like Apple Sign-In)

```bash
# Using EAS Build (cloud-based)
npx eas-cli build --platform ios --profile development

# Or local build
npx expo prebuild
npx expo run:ios
```

## Features

### ✅ Works out of the box

- Email and password authentication
- Email verification
- Session management
- Protected routes
- Works with Expo Go

### 🍎 Optional: Native Apple Sign-In (iOS)

Native Apple Sign-In is **disabled by default** and requires additional setup:

**Requirements:**

- Apple Developer Account ($99/year)
- Native build (EAS Build or local prebuild)
- Configuration in Apple Developer Console and Clerk Dashboard

**To enable:**

1. Follow the complete setup guide: TODO: link docs here.

2. Uncomment the Apple Sign-In button in:

   - `app/(auth)/sign-in.tsx`
   - `app/(auth)/sign-up.tsx`

3. Build with EAS or local prebuild (Apple Sign-In doesn't work in Expo Go)

For detailed instructions, see [APPLE_SIGNIN_SETUP.md](./APPLE_SIGNIN_SETUP.md).

## Building for Production

### Using EAS Build (Recommended)

EAS Build is the easiest way to create production builds with automatic code signing.

**Setup:**

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure your project
eas build:configure
```

**Build for iOS:**

```bash
# Development build (for testing)
eas build --platform ios --profile development

# Production build (for App Store)
eas build --platform ios --profile production
```

**Build for Android:**

```bash
# Development build (for testing)
eas build --platform android --profile development

# Production build (for Play Store)
eas build --platform android --profile production
```

### Using Local Prebuild

If you prefer to build locally:

```bash
# Generate native projects
npx expo prebuild

# Build for iOS (requires macOS and Xcode)
npx expo run:ios --configuration Release

# Build for Android
npx expo run:android --variant release
```

## Project Structure

```
├── app/
│   ├── (auth)/
│   │   ├── sign-in.tsx          # Sign-in screen
│   │   └── sign-up.tsx          # Sign-up screen
│   ├── (home)/
│   │   └── index.tsx            # Home screen (protected)
│   ├── components/
│   │   └── AppleSignInButton.tsx # Optional Apple Sign-In component
│   └── _layout.tsx              # Root layout with ClerkProvider
├── .env.example                 # Environment variables template
├── eas.json                     # EAS Build configuration
└── APPLE_SIGNIN_SETUP.md       # Apple Sign-In setup guide
```

## Environment Variables

Create a `.env` file with:

```bash
# Required: Your Clerk publishable key
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx

# Optional: Only needed for EAS Build with Apple Sign-In
# APPLE_TEAM_ID=ABC123DEF4
```

See `.env.example` for more details.

## Learn more

To learn more about Clerk and Expo, check out the following resources:

- [Quickstart: Get started with Expo and Clerk](https://clerk.com/docs/quickstarts/expo?utm_source=DevRel&utm_medium=docs&utm_campaign=templates&utm_content=10-24-2023&utm_term=clerk-expo-quickstart)
- [Clerk Documentation](https://clerk.com/docs/references/expo/overview?utm_source=DevRel&utm_medium=docs&utm_campaign=templates&utm_content=10-24-2023&utm_term=clerk-expo-quickstart)
- [Expo Documentation](https://docs.expo.dev/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)

## Troubleshooting

### "No Clerk publishable key found"

- Make sure you've created a `.env` file with `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`
- Restart the development server after adding environment variables

### "Cannot use import statement outside a module"

- Clear Metro bundler cache: `npx expo start --clear`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

### Apple Sign-In not working

- Verify you've followed all steps in [APPLE_SIGNIN_SETUP.md](./APPLE_SIGNIN_SETUP.md)
- Apple Sign-In requires a native build (doesn't work in Expo Go)
- Check that the capability is enabled in your Apple Developer account

## Found an issue or want to leave feedback

Feel free to create a support thread on our [Discord](https://clerk.com/discord). Our support team will be happy to assist you in the `#support` channel.

## Connect with us

You can discuss ideas, ask questions, and meet others from the community in our [Discord](https://discord.com/invite/b5rXHjAg7A).

If you prefer, you can also find support through our [Twitter](https://twitter.com/ClerkDev), or you can [email](mailto:support@clerk.dev) us!
