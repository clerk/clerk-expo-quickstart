import { Stack } from 'expo-router'

// The outer stack never owns visible chrome. Settings renders inside a nested
// stack with its own native header, while Clerk owns all chrome on auth.
export default function SettingsSheetLayout() {
  return <Stack screenOptions={{ headerShown: false }} />
}
