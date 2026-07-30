import { isClerkAPIResponseError, useAuth, useSignIn, useUser } from '@clerk/expo'
import { AuthView, UserButton, UserProfileView } from '@clerk/expo/native'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import {
  ActivityIndicator,
  Button,
  Image,
  Modal,
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.foreground }]}>Welcome</Text>
        {isSignedIn && <UserButton />}
      </View>

      {isSignedIn ? (
        <>
          <View style={[styles.profileCard, { backgroundColor: colors.card }]}>
            {user?.imageUrl && <Image source={{ uri: user.imageUrl }} style={styles.avatar} />}
            <View style={styles.profileText}>
              <Text style={[styles.fullName, { color: colors.foreground }]}>
                {user?.fullName ?? 'No full name'}
              </Text>
              <Text style={[styles.username, { color: colors.foreground }]}>
                Username: {user?.username || 'No username'}
              </Text>
              <Text style={[styles.email, { color: colors.mutedForeground }]}>
                {user?.primaryEmailAddress?.emailAddress ?? user?.id}
              </Text>
              <Button title="Sign out" onPress={() => void signOut()} />
            </View>
          </View>

          <View style={[styles.signInCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.fullName, { color: colors.foreground }]}>UserProfileView flavors</Text>
            <Button title="1. Classic (own modal, Clerk header)" onPress={() => setIsProfileOpen(true)} />
            <Button title="2. UserProfileScreen (router header)" onPress={() => router.push('/account')} />
            <Button title="3. hideHeader (custom app header)" onPress={() => router.push('/custom-profile')} />
          </View>
        </>
      ) : (
        <View style={[styles.signInCard, { backgroundColor: colors.card }]}>
          <Button title="Native AuthView sign in (modal)" onPress={() => setIsAuthOpen(true)} />
          <Button title="AuthScreen sign in (router header)" onPress={() => router.push('/sign-in')} />
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
          <Button title="JS email/password sign in" onPress={onJsSignIn} disabled={isSubmitting} />
        </View>
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
    </View>
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
    flex: 1,
    padding: 20,
    paddingTop: 60,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  signInCard: {
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
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  profileText: {
    flex: 1,
    gap: 8,
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
