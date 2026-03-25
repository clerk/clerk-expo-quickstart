import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { useSignIn, useSignUp } from '@clerk/expo'
import { type Href, Link, useRouter } from 'expo-router'
import * as React from 'react'
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native'

export default function Page() {
  const router = useRouter()
  const { signIn, errors: signInErrors, fetchStatus: signInFetchStatus } = useSignIn()
  const { signUp, errors: signUpErrors, fetchStatus: signUpFetchStatus } = useSignUp()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [code, setCode] = React.useState('')
  const [showEmailCode, setShowEmailCode] = React.useState(false)

  const isFetching = signInFetchStatus === 'fetching' || signUpFetchStatus === 'fetching'

  const navigateAfterAuth = ({
    session,
    decorateUrl,
  }: {
    session: { currentTask?: unknown } | null | undefined
    decorateUrl: (url: string) => string
  }) => {
    if (session?.currentTask) {
      // Handle pending session tasks
      // See https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks
      console.log(session.currentTask)
      return
    }

    const url = decorateUrl('/')
    if (url.startsWith('http')) {
      window.location.href = url
    } else {
      router.push(url as Href)
    }
  }

  const handleSubmit = async () => {
    const { error } = await signIn.password({
      emailAddress,
      password,
    })
    if (error) {
      // If the identifier is not found, the user is not signed up yet — swap to the sign-up flow
      if (error.errors[0].code === 'form_identifier_not_found') {
        try {
          const { error: signUpError } = await signUp.password({
            emailAddress,
            password,
          })
          if (signUpError) {
            console.error('Sign-up after identifier-not-found:', JSON.stringify(signUpError, null, 2))
            return
          }

          // Send the user a verification code to verify their email address
          await signUp.verifications.sendEmailCode()

          const needsEmailCode =
            Array.isArray(signUp.unverifiedFields) && signUp.unverifiedFields.includes('email_address')

          // Display second form to collect the verification code
          if (needsEmailCode) {
            setShowEmailCode(true)
            return
          }

          // If the user is missing required fields, handle accordingly
          // This example redirects to the continue page; see https://clerk.com/docs/guides/development/custom-flows/authentication/oauth-connections#handle-missing-requirements
          if (signUp.status === 'missing_requirements' && (signUp.missingFields?.length ?? 0) > 0) {
            router.push('/continue' as Href)
            return
          }

          console.error('Unexpected sign-up state after password:', {
            status: signUp.status,
            unverifiedFields: signUp.unverifiedFields,
            missingFields: signUp.missingFields,
          })
          return
        } catch (err: unknown) {
          console.error(JSON.stringify(err, null, 2))
          return
        }
      }
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(error, null, 2))
      return
    }

    // If the identifier is found, no need to swap to sign-up. Continue with sign-in flow.
    if (signIn.status === 'complete') {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          navigateAfterAuth({ session, decorateUrl })
        },
      })
    } else if (signIn.status === 'needs_second_factor') {
      // See https://clerk.com/docs/guides/development/custom-flows/authentication/multi-factor-authentication
    } else if (signIn.status === 'needs_client_trust') {
      // For other second factor strategies,
      // see https://clerk.com/docs/guides/development/custom-flows/authentication/client-trust
      const emailCodeFactor = signIn.supportedSecondFactors?.find((factor) => factor.strategy === 'email_code')

      if (emailCodeFactor) {
        await signIn.mfa.sendEmailCode()
      }
    } else {
      // Check why the sign-in is not complete
      console.error('Sign-in attempt not complete:', signIn)
    }
  }

  // Handles both the sign-up and sign-in email code verification
  const handleVerify = async () => {
    // Handle sign-up with email code verification
    if (showEmailCode) {
      const { error } = await signUp.verifications.verifyEmailCode({
        code,
      })
      if (error) {
        console.error(JSON.stringify(error, null, 2))
        return
      }

      if (signUp.status === 'complete') {
        await signUp.finalize({
          navigate: ({ session, decorateUrl }) => {
            navigateAfterAuth({ session, decorateUrl })
          },
        })
        return
      }

      // Check why the status is not complete
      console.error('Sign-up attempt not complete. Status:', signUp.status)
      return
    }

    // Handle sign-in with email code verification
    const { error } = await signIn.mfa.verifyEmailCode({
      code,
    })
    if (error) {
      console.error(JSON.stringify(error, null, 2))
      return
    }

    if (signIn.status === 'complete') {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          navigateAfterAuth({ session, decorateUrl })
        },
      })
    } else {
      // Check why the sign-in is not complete
      console.error('Sign-in attempt not complete. Status:', signIn.status)
    }
  }

  const handleStartOver = () => {
    signIn.reset()
    setShowEmailCode(false)
    setCode('')
  }

  if (showEmailCode || signIn.status === 'needs_client_trust') {
    const codeError = signUpErrors.fields?.code ?? signInErrors.fields?.code

    return (
      <ThemedView style={styles.flex}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <ThemedText type="title" style={styles.title}>
            Verify your account
          </ThemedText>

          <View style={styles.fieldBlock}>
            <ThemedText style={styles.label}>Code</ThemedText>
            <TextInput
              style={styles.input}
              value={code}
              placeholder="Enter verification code"
              placeholderTextColor="#666666"
              onChangeText={setCode}
              keyboardType="number-pad"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {codeError ? <ThemedText style={styles.error}>{codeError.message}</ThemedText> : null}
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              (!code || isFetching) && styles.buttonDisabled,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleVerify}
            disabled={!code || isFetching}
          >
            <ThemedText style={styles.buttonText}>Verify</ThemedText>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
            onPress={() => signIn.mfa.sendEmailCode()}
          >
            <ThemedText style={styles.secondaryButtonText}>I need a new code</ThemedText>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
            onPress={handleStartOver}
          >
            <ThemedText style={styles.secondaryButtonText}>Start over</ThemedText>
          </Pressable>
        </ScrollView>
      </ThemedView>
    )
  }

  const canContinue = emailAddress.length > 0 && password.length > 0 && !isFetching

  return (
    <ThemedView style={styles.flex}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <ThemedText type="title" style={styles.title}>
          Sign up / sign in
        </ThemedText>

        <View style={styles.fieldBlock}>
          <ThemedText style={styles.label}>Email address</ThemedText>
          <TextInput
            style={styles.input}
            value={emailAddress}
            placeholder="Enter email address"
            placeholderTextColor="#666666"
            onChangeText={setEmailAddress}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {signInErrors.fields?.identifier ? (
            <ThemedText style={styles.error}>{signInErrors.fields.identifier.message}</ThemedText>
          ) : null}
        </View>

        <View style={styles.fieldBlock}>
          <ThemedText style={styles.label}>Password</ThemedText>
          <TextInput
            style={styles.input}
            value={password}
            placeholder="Enter password"
            placeholderTextColor="#666666"
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
          {signInErrors.fields?.password ? (
            <ThemedText style={styles.error}>{signInErrors.fields.password.message}</ThemedText>
          ) : null}
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            !canContinue && styles.buttonDisabled,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleSubmit}
          disabled={!canContinue}
        >
          <ThemedText style={styles.buttonText}>Continue</ThemedText>
        </Pressable>

        {(signInErrors || signUpErrors) && (
          <ThemedText style={styles.debug}>{JSON.stringify({ signInErrors, signUpErrors }, null, 2)}</ThemedText>
        )}

        {/* For your debugging purposes. You can just console.log errors, but
      we put them in the UI for convenience */}
        {signInErrors && <ThemedText style={styles.debug}>{JSON.stringify(signInErrors, null, 2)}</ThemedText>}
        {signUpErrors && <ThemedText style={styles.debug}>{JSON.stringify(signUpErrors, null, 2)}</ThemedText>}

        {/*
          Web Next.js flows use <div id="clerk-captcha" /> for bot protection.
          On native, Clerk handles risk checks without that DOM mount; see Clerk docs if you need a WebView CAPTCHA.
        */}
      </ScrollView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    gap: 12,
  },
  title: {
    marginBottom: 8,
  },
  fieldBlock: {
    gap: 6,
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
  linkContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 12,
    alignItems: 'center',
  },
  error: {
    color: '#d32f2f',
    fontSize: 12,
    marginTop: 4,
  },
  debug: {
    fontSize: 10,
    opacity: 0.5,
    marginTop: 8,
  },
})
