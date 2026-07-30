import { Platform } from 'react-native'

// iOS 26 draws navigation bars as liquid glass over the content behind them.
export const liquidGlass = Platform.OS === 'ios' && parseInt(String(Platform.Version), 10) >= 26

// Shared header options for screens whose content scrolls under the bar. Pair with a
// ScrollView using contentInsetAdjustmentBehavior="automatic" so content starts below it.
export const glassHeaderOptions = {
  headerShadowVisible: false,
  headerTransparent: liquidGlass,
  headerStyle: liquidGlass ? { backgroundColor: 'transparent' } : undefined,
  scrollEdgeEffects: liquidGlass
    ? ({ top: 'automatic', bottom: 'hidden', left: 'hidden', right: 'hidden' } as const)
    : undefined,
}
