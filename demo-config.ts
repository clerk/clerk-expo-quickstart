export type DemoMode = "js-only" | "js-oauth" | "native";

// Change this to switch the app's behavior:
// - "js-only":  Email/password forms only. Works in Expo Go.
// - "js-oauth": Email/password + Google/Apple OAuth buttons. Needs dev build for OAuth.
// - "native":   Native AuthView & UserProfileView. Full dev build required.

// export const DEMO_MODE: DemoMode = "js-only";
// export const DEMO_MODE: DemoMode = "js-oauth";
export const DEMO_MODE: DemoMode = "native";
