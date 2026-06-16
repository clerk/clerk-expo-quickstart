import { ThemedText } from '@/components/themed-text'
import { GoogleSignInButton } from '@/components/GoogleSignInButton'
import { AppleSignInButton } from '@/app/components/AppleSignInButton'
import { useSignIn } from '@clerk/expo'
import React from 'react'
import { ActivityIndicator, Button, Pressable, ScrollView, StyleSheet, TextInput } from 'react-native'

type PageProps = {
  onPresentNativeAuth?: () => void
}

export default function Page({ onPresentNativeAuth }: PageProps) {
  const { signIn, errors, fetchStatus } = useSignIn()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [code, setCode] = React.useState('')
  const isSubmitting = fetchStatus === 'fetching'

  const finalizeSignIn = React.useCallback(async () => {
    return signIn.finalize({
      navigate: ({ session }) => {
        if (session?.currentTask) {
          // Handle pending session tasks
          // See https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks
          console.log(session?.currentTask)
          return
        }
      },
    })
  }, [signIn])

  const handleSubmit = async () => {
    const { error } = await signIn.password({
      emailAddress,
      password,
    })
    if (error) {
      console.error(JSON.stringify(error, null, 2))
      return
    }

    await finalizeSignIn()
  }

  const handleVerify = async () => {
    const { error } = await signIn.mfa.verifyEmailCode({ code })

    if (error) {
      console.error(JSON.stringify(error, null, 2))
      return
    }

    await finalizeSignIn()
  }

  if (signIn.status === 'needs_client_trust') {
    return (
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.container}>
        <ThemedText type="title" style={[styles.title, { fontSize: 24, fontWeight: 'bold' }]}>Verify your account</ThemedText>
        <TextInput
          style={styles.input}
          value={code}
          placeholder="Enter your verification code"
          placeholderTextColor="#666666"
          onChangeText={(code) => setCode(code)}
          keyboardType="numeric"
        />
        {errors.fields.code && <ThemedText style={styles.error}>{errors.fields.code.message}</ThemedText>}
        <Button title="Verify" onPress={handleVerify} disabled={fetchStatus === 'fetching'} />
        <Pressable
          style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
          onPress={() => signIn.mfa.sendEmailCode()}
        >
          <ThemedText style={styles.secondaryButtonText}>I need a new code</ThemedText>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
          onPress={() => signIn.reset()}
        >
          <ThemedText style={styles.secondaryButtonText}>Start over</ThemedText>
        </Pressable>
      </ScrollView>
    )
  }

  return (
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Sign in
      </ThemedText>

      <AppleSignInButton />
      <GoogleSignInButton />
      {onPresentNativeAuth && (
        <Pressable
          accessibilityLabel="Open native AuthView"
          accessibilityRole="button"
          style={({ pressed }) => [styles.nativeAuthButton, pressed && styles.buttonPressed]}
          onPress={onPresentNativeAuth}
        >
          <ThemedText style={styles.nativeAuthButtonText}>Open native AuthView</ThemedText>
        </Pressable>
      )}

      <ThemedText style={styles.label}>Email address</ThemedText>
      <TextInput
        style={styles.input}
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        placeholderTextColor="#666666"
        onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
        keyboardType="email-address"
      />
      {errors.fields.identifier && (
        <ThemedText style={styles.error}>{errors.fields.identifier.message}</ThemedText>
      )}
      <ThemedText style={styles.label}>Password</ThemedText>
      <TextInput
        style={styles.input}
        value={password}
        placeholder="Enter password"
        placeholderTextColor="#666666"
        autoComplete="off"
        textContentType="none"
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
      />
      {errors.fields.password && (
        <ThemedText style={styles.error}>{errors.fields.password.message}</ThemedText>
      )}
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: !emailAddress || !password || isSubmitting, busy: isSubmitting }}
        onPress={handleSubmit}
        disabled={!emailAddress || !password || isSubmitting}
        style={({ pressed }) => [
          styles.button,
          (!emailAddress || !password || isSubmitting) && styles.buttonDisabled,
          pressed && styles.buttonPressed,
        ]}
      >
        {isSubmitting && <ActivityIndicator color="#fff" size="small" />}
        <ThemedText style={styles.buttonText}>{isSubmitting ? 'Signing in...' : 'Continue'}</ThemedText>
      </Pressable>
      {/* For your debugging purposes. You can just console.log errors, but we put them in the UI for convenience */}
      {errors && <ThemedText style={styles.debug}>{JSON.stringify(errors, null, 2)}</ThemedText>}

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 48,
    gap: 12,
  },
  title: {
    marginBottom: 8,
  },
  label: {
    fontWeight: '600',
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  nativeAuthButton: {
    borderWidth: 1,
    borderColor: '#0a7ea4',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  nativeAuthButtonText: {
    color: '#0a7ea4',
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  secondaryButtonText: {
    color: '#0a7ea4',
    fontWeight: '600',
  },
  error: {
    color: '#d32f2f',
    fontSize: 12,
    marginTop: -8,
  },
  debug: {
    fontSize: 10,
    opacity: 0.5,
    marginTop: 8,
  },
})
