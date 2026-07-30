import { useAuth } from '@clerk/expo'
import { AuthView, UserProfileView } from '@clerk/expo/native'
import { useRouter } from 'expo-router'
import { useEffect, useRef } from 'react'
import { Platform, StatusBar, StyleSheet, View } from 'react-native'

// Clerk owns the visible navigation chrome on this route.
export default function SettingsAuthRoute() {
  const { isLoaded, isSignedIn } = useAuth({ treatPendingAsSignedOut: false })
  const router = useRouter()
  const wasSignedIn = useRef(false)
  const didSignOutOnAndroid =
    Platform.OS === 'android' && isLoaded && wasSignedIn.current && !isSignedIn

  useEffect(() => {
    if (!isLoaded) {
      return
    }

    wasSignedIn.current = Boolean(isSignedIn)
    if (didSignOutOnAndroid) {
      router.back()
    }
  }, [didSignOutOnAndroid, isLoaded, isSignedIn, router])

  if (!isLoaded || didSignOutOnAndroid) {
    return null
  }

  const content = isSignedIn ? (
    <UserProfileView
      isDismissible={false}
      onHostBack={() => router.back()}
      style={{ flex: 1 }}
    />
  ) : (
    <AuthView isDismissible={false} onHostBack={() => router.back()} />
  )

  // Clerk's Android header includes the activity status-bar inset. The sheet is
  // already below it, so clip that duplicate inset only for this embedded route.
  return Platform.OS === 'android' ? <View style={styles.androidEmbedded}>{content}</View> : content
}

const styles = StyleSheet.create({
  androidEmbedded: {
    flex: 1,
    marginTop: -(StatusBar.currentHeight ?? 0),
  },
})
