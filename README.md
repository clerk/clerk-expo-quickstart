# Clerk + Expo Quickstarts

This repository contains three quickstart apps demonstrating different ways to integrate [Clerk](https://clerk.com) authentication with [Expo](https://expo.dev).

| Quickstart | Auth UI | OAuth | Expo Go | Dev Build |
|---|---|---|---|---|
| [**JS Only**](#js-only) | Custom (React Native) | No | Yes | Yes |
| [**JS + Native Sign-In**](#js--native-sign-in) | Custom (React Native) | Apple, Google | No | Yes |
| [**Native Components**](#native-components) | Native (Clerk SDK) | Apple, Google | No | Yes |

## Getting Started

Each quickstart is a standalone Expo project in its own directory. To run one:

```bash
cd JSOnlyQuickstart   # or JSWithNativeSignInQuickstart, NativeComponentQuickstart

cp .env.example .env
# Edit .env and add your Clerk publishable key

pnpm install
```

You can find your publishable key in the [Clerk Dashboard](https://dashboard.clerk.com).

## JS Only

**Directory:** `JSOnlyQuickstart/`

The simplest integration. Uses `@clerk/expo` hooks (`useSignIn`, `useSignUp`) with custom React Native sign-in and sign-up screens. Email/password authentication only.

**Works with Expo Go** -- no native build required.

```bash
cd JSOnlyQuickstart
npx expo start
```

## JS + Native Sign-In

**Directory:** `JSWithNativeSignInQuickstart/`

Extends the JS-only approach with native OAuth buttons for Apple Sign-In (iOS) and Google Sign-In (iOS + Android). Still uses custom React Native screens for the email/password flow.

**Requires a development build** (native OAuth modules don't work in Expo Go).

```bash
cd JSWithNativeSignInQuickstart
npx expo run:ios     # or run:android
```

Additional environment variables are needed for OAuth -- see `JSWithNativeSignInQuickstart/.env.example`.

## Native Components

**Directory:** `NativeComponentQuickstart/`

Uses Clerk's native UI components (`AuthView`, `UserProfile`, `UserButton`) from `@clerk/expo/native`. The sign-in/sign-up flow is rendered by the native Clerk SDKs (clerk-ios, clerk-android) and presented modally. The user profile is also a native component.

**Requires a development build.**

```bash
cd NativeComponentQuickstart
npx expo run:ios     # or run:android
```

Additional environment variables are needed -- see `NativeComponentQuickstart/.env.example`.

## Learn More

- [Clerk Expo Quickstart Guide](https://clerk.com/docs/quickstarts/expo)
- [Clerk Documentation](https://clerk.com/docs)
- [Expo Documentation](https://docs.expo.dev)

## Support

Create a support thread on our [Discord](https://clerk.com/discord) in the `#support` channel.
