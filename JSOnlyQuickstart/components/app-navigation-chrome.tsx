import { StackHeaderBack } from '@/components/stack-header-back'
import { Slot, useRouter, useSegments } from 'expo-router'
import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

/**
 * Top-level chrome so screens like (organization) and (auth) get a back control.
 * (account) keeps its own Stack header to avoid duplicate back rows.
 */
export function AppNavigationChrome() {
  const router = useRouter()
  const segments = useSegments()
  const insets = useSafeAreaInsets()

  const rootSegment = segments[0]
  const accountProvidesHeader = rootSegment === '(account)'
  const showBar = router.canGoBack() && !accountProvidesHeader

  return (
    <View style={styles.root}>
      {showBar ? (
        <View style={[styles.bar, { paddingTop: Math.max(insets.top, 8) }]}>
          <StackHeaderBack fallbackHref="/" />
        </View>
      ) : null}
      <View style={styles.flex}>
        <Slot />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(60, 60, 67, 0.29)',
    backgroundColor: '#fff',
  },
})
