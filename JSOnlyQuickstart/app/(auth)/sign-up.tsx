import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { useSignUp } from '@clerk/expo'
import { type Href, Link, useRouter } from 'expo-router'
import React from 'react'
import { Pressable, StyleSheet, TextInput, View } from 'react-native'

export default function Page() {
  const { signUp, errors, fetchStatus } = useSignUp()
  const router = useRouter()

  // For email OTP: collect the email address instead of the phone number
  const [phoneNumber, setPhoneNumber] = React.useState('')
  const [code, setCode] = React.useState('')

  const handleSubmit = async () => {
    // For email OTP: change create({ phoneNumber }) to create({ emailAddress })
    const { error } = await signUp.create({ phoneNumber })
    if (error) {
      console.error(JSON.stringify(error, null, 2))
      return
    }

    // For email OTP: change sendPhoneCode() to sendEmailCode()
    if (!error) await signUp.verifications.sendPhoneCode()
  }

  const handleVerify = async () => {
    // For email OTP: change verifyPhoneCode() to verifyEmailCode()
    await signUp.verifications.verifyPhoneCode({ code })

    if (signUp.status === 'complete') {
      await signUp.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            // Handle pending session tasks
            // See https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks
            console.log(session?.currentTask)
            return
          }

          const url = decorateUrl('/')
          if (url.startsWith('http')) {
            window.location.href = url
          } else {
            router.push(url as Href)
          }
        },
      })
    } else {
      // Check why the sign-up is not complete
      console.error('Sign-up attempt not complete:', signUp)
    }
  }

  if (signUp.status === 'complete') {
    return null
  }

  if (
    signUp.status === 'missing_requirements' &&
    // For email OTP: check for email_address instead of phone_number
    signUp.unverifiedFields.includes('phone_number') &&
    signUp.missingFields.length === 0
  ) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          Verify your account
        </ThemedText>
        <TextInput
          style={styles.input}
          value={code}
          placeholder="Enter verification code"
          placeholderTextColor="#666666"
          onChangeText={(code) => setCode(code)}
          keyboardType="numeric"
        />
        {errors.fields.code && <ThemedText style={styles.error}>{errors.fields.code.message}</ThemedText>}
        <Pressable
          style={({ pressed }) => [
            styles.button,
            fetchStatus === 'fetching' && styles.buttonDisabled,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleVerify}
          disabled={fetchStatus === 'fetching'}
        >
          <ThemedText style={styles.buttonText}>Verify</ThemedText>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
          // For email OTP: change sendPhoneCode() to sendEmailCode()
          onPress={() => signUp.verifications.sendPhoneCode()}
        >
          <ThemedText style={styles.secondaryButtonText}>I need a new code</ThemedText>
        </Pressable>
      </ThemedView>
    )
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Sign up
      </ThemedText>
      <ThemedText style={styles.label}>Phone number</ThemedText>
      {/* For email OTP: collect the emailAddress instead */}
      <TextInput
        style={styles.input}
        value={phoneNumber}
        placeholder="Enter phone number"
        placeholderTextColor="#666666"
        onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber)}
        keyboardType="phone-pad"
      />
      {errors.fields.phoneNumber && <ThemedText style={styles.error}>{errors.fields.phoneNumber.message}</ThemedText>}
      <Pressable
        style={({ pressed }) => [
          styles.button,
          (!phoneNumber || fetchStatus === 'fetching') && styles.buttonDisabled,
          pressed && styles.buttonPressed,
        ]}
        onPress={handleSubmit}
        disabled={!phoneNumber || fetchStatus === 'fetching'}
      >
        <ThemedText style={styles.buttonText}>Continue</ThemedText>
      </Pressable>
      {/* For your debugging purposes. You can just console.log errors, but we put them in the UI for convenience */}
      {errors && <ThemedText style={styles.debug}>{JSON.stringify(errors, null, 2)}</ThemedText>}

      <View style={styles.linkContainer}>
        <ThemedText>Already have an account? </ThemedText>
        <Link href="/sign-in">
          <ThemedText type="link">Sign in</ThemedText>
        </Link>
      </View>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
    gap: 4,
    marginTop: 12,
    alignItems: 'center',
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
