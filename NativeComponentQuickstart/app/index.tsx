import { isClerkAPIResponseError, useAuth, useSignIn, useUser } from '@clerk/expo'
import { AuthView, UserButton, UserProfileView } from '@clerk/expo/native'
import { Stack, useRouter } from 'expo-router'
import { useState } from 'react'
import {
  ActivityIndicator,
  Button,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native'

const palette = {
  light: {
    background: '#FFFFFF',
    card: '#F1F5F9',
    foreground: '#0F172A',
    mutedForeground: '#64748B',
  },
  dark: {
    background: '#0F172A',
    card: '#1E293B',
    foreground: '#F8FAFC',
    mutedForeground: '#CBD5E1',
  },
}

const password = 'ClerkPass1234'

const signedInHeaderOptions = { headerRight: () => <UserButton /> }
const signedOutHeaderOptions = { headerRight: undefined }

export default function MainScreen() {
  const { isSignedIn, isLoaded, signOut } = useAuth({ treatPendingAsSignedOut: false })
  const { signIn, fetchStatus } = useSignIn()
  const { user } = useUser()
  const router = useRouter()
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [emailAddress, setEmailAddress] = useState('mike+clerk_test@email.com')
  const [jsError, setJsError] = useState<string | null>(null)
  const colorScheme = useColorScheme()
  const colors = palette[colorScheme === 'dark' ? 'dark' : 'light']
  const isSubmitting = fetchStatus === 'fetching'

  const onJsSignIn = async () => {
    setJsError(null)

    const { error } = await signIn.password({
      emailAddress: emailAddress.trim(),
      password,
    })

    if (error) {
      setJsError(isClerkAPIResponseError(error) ? error.errors[0]?.longMessage || error.errors[0]?.message : 'Sign in failed')
      return
    }

    if (signIn.status === 'complete') {
      await signIn.finalize()
    } else {
      setJsError(`Unsupported sign-in status: ${signIn.status}`)
    }
  }

  if (!isLoaded) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.container}
    >
      <Stack.Screen options={isSignedIn ? signedInHeaderOptions : signedOutHeaderOptions} />

      {isSignedIn ? (
        <>
          <View style={[styles.profileCard, { backgroundColor: colors.card }]}>
            {user?.imageUrl && <Image source={{ uri: user.imageUrl }} style={styles.avatar} />}
            <View style={styles.profileText}>
              <View style={styles.profileHeading}>
                <Text style={[styles.fullName, { color: colors.foreground }]}>
                  {user?.fullName ?? 'No full name'}
                </Text>
                <Pressable accessibilityRole="button" hitSlop={8} onPress={() => void signOut()}>
                  <Text style={styles.signOut}>Sign out</Text>
                </Pressable>
              </View>
              <Text style={[styles.username, { color: colors.foreground }]}>
                Username: {user?.username || 'No username'}
              </Text>
              <Text
                ellipsizeMode="middle"
                numberOfLines={1}
                style={[styles.email, { color: colors.mutedForeground }]}
              >
                {user?.primaryEmailAddress?.emailAddress ?? user?.id}
              </Text>
            </View>
          </View>

          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={[styles.fullName, { color: colors.foreground }]}>UserProfileView flavors</Text>
            <View style={styles.flavorButton}>
              <Button title="1. Modal" onPress={() => setIsProfileOpen(true)} />
            </View>
            <View style={styles.flavorButton}>
              <Button title="2. Pushed route" onPress={() => router.push('/account')} />
            </View>
            <View style={styles.flavorButton}>
              <Button title="3. Settings sheet" onPress={() => router.push('/settings-sheet')} />
            </View>
          </View>
        </>
      ) : (
        <>
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={[styles.fullName, { color: colors.foreground }]}>AuthView flavors</Text>
            <View style={styles.flavorButton}>
              <Button title="1. Modal" onPress={() => setIsAuthOpen(true)} />
            </View>
            <View style={styles.flavorButton}>
              <Button title="2. Pushed route" onPress={() => router.push('/sign-in')} />
            </View>
            <View style={styles.flavorButton}>
              <Button title="3. Pushed 3 deep" onPress={() => router.push('/intermediate')} />
            </View>
            <View style={styles.flavorButton}>
              <Button title="4. Settings sheet" onPress={() => router.push('/settings-sheet')} />
            </View>
          </View>

          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={[styles.fullName, { color: colors.foreground }]}>JS sign-in</Text>
            <TextInput
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              onChangeText={setEmailAddress}
              placeholder="Email"
              placeholderTextColor={colors.mutedForeground}
              style={[styles.input, { borderColor: colors.mutedForeground, color: colors.foreground }]}
              value={emailAddress}
            />
            <TextInput
              autoCapitalize="none"
              autoComplete="password"
              editable={false}
              placeholder="Password"
              placeholderTextColor={colors.mutedForeground}
              secureTextEntry
              style={[styles.input, { borderColor: colors.mutedForeground, color: colors.foreground }]}
              value={password}
            />
            {jsError && <Text style={styles.error}>{jsError}</Text>}
            <View style={styles.flavorButton}>
              <Button title="Sign in" onPress={onJsSignIn} disabled={isSubmitting} />
            </View>
          </View>
        </>
      )}

      <Modal
        animationType="slide"
        visible={isAuthOpen}
        presentationStyle="pageSheet"
        onRequestClose={() => setIsAuthOpen(false)}
      >
        <AuthView onDismiss={() => setIsAuthOpen(false)} />
      </Modal>

      {/* Flavor 1: unchanged behavior — the app presents, Clerk draws its own header. */}
      <Modal
        animationType="slide"
        visible={isProfileOpen}
        presentationStyle="pageSheet"
        onRequestClose={() => setIsProfileOpen(false)}
      >
        <UserProfileView onDismiss={() => setIsProfileOpen(false)} />
      </Modal>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  container: {
    padding: 20,
    gap: 16,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  error: {
    color: '#DC2626',
    fontSize: 14,
  },
  flavorButton: {
    alignSelf: 'flex-start',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  profileText: {
    flex: 1,
    gap: 4,
  },
  profileHeading: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  signOut: {
    color: '#007AFF',
    fontSize: 15,
    fontWeight: '500',
  },
  email: {
    fontSize: 14,
  },
  fullName: {
    fontSize: 18,
    fontWeight: '600',
  },
  username: {
    fontSize: 14,
  },
})
