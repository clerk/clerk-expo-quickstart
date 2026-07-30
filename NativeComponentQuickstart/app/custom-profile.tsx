import { UserProfileView, type UserProfileViewRef } from '@clerk/expo/native'
import { Stack, useRouter } from 'expo-router'
import { useRef, useState } from 'react'
import { Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native'

// Flavor 3: raw embedded mode. The app owns the header entirely and drives
// Clerk's internal stack through the ref, using onNavigationChange to decide
// what the back button should do. The header also displays the live
// navigation state so the event stream is visible.
export default function CustomProfileRoute() {
  const router = useRouter()
  const profileRef = useRef<UserProfileViewRef>(null)
  const [nav, setNav] = useState({ depth: 0, canGoBack: false })
  const colorScheme = useColorScheme()
  const dark = colorScheme === 'dark'

  const onBackPress = () => {
    if (nav.canGoBack) {
      void profileRef.current?.goBack()
    } else {
      router.back()
    }
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.header, { backgroundColor: dark ? '#1E293B' : '#F1F5F9' }]}>
        <Pressable onPress={onBackPress} hitSlop={12}>
          <Text style={[styles.back, { color: dark ? '#F8FAFC' : '#0F172A' }]}>
            {nav.canGoBack ? '‹ Back' : '‹ Close'}
          </Text>
        </Pressable>
        <Text style={[styles.state, { color: dark ? '#CBD5E1' : '#64748B' }]}>
          depth {nav.depth} · canGoBack {String(nav.canGoBack)}
        </Text>
        <Pressable onPress={() => void profileRef.current?.popToRoot()} hitSlop={12} disabled={!nav.canGoBack}>
          <Text style={[styles.root, { opacity: nav.canGoBack ? 1 : 0.3, color: dark ? '#F8FAFC' : '#0F172A' }]}>
            Root
          </Text>
        </Pressable>
      </View>
      <UserProfileView
        ref={profileRef}
        hideHeader
        isDismissible={false}
        onNavigationChange={setNav}
        onDismiss={() => router.back()}
        style={styles.profile}
      />
    </>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 64,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  back: {
    fontSize: 17,
    fontWeight: '600',
  },
  state: {
    fontSize: 13,
    fontVariant: ['tabular-nums'],
  },
  root: {
    fontSize: 15,
    fontWeight: '600',
  },
  profile: {
    flex: 1,
  },
})
