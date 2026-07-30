import { Stack } from 'expo-router'
import { Platform } from 'react-native'

// iOS 26 draws navigation bars as liquid glass over the content behind them.
const liquidGlass = Platform.OS === 'ios' && parseInt(String(Platform.Version), 10) >= 26

export default function SettingsContentLayout() {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerTransparent: liquidGlass,
        scrollEdgeEffects: liquidGlass
          ? { top: 'soft', bottom: 'hidden', left: 'hidden', right: 'hidden' }
          : undefined,
      }}
    />
  )
}
