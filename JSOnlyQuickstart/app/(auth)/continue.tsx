import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { useSignIn, useSignUp } from '@clerk/expo'
import { type Href, Link, useRouter } from 'expo-router'
import * as React from 'react'
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native'

export default function Page() {
  const router = useRouter()
  // Use `useSignUp()` hook to access the `SignUp` object
  // `missing_requirements` and `missingFields` are only available on the `SignUp` object
  const { signUp, errors: signUpErrors, fetchStatus: signUpFetchStatus } = useSignUp()
  const { signIn, errors: signInErrors, fetchStatus: signInFetchStatus } = useSignIn()
  const [firstName, setFirstName] = React.useState('')
  const [lastName, setLastName] = React.useState('')

  // If the sign-in or sign-up is complete, the user doesn't need to be on this page
  if (signIn.status === 'complete' || signUp.status === 'complete') {
    return router.push('/')
  }

  const handleSubmit = async () => {
    // Update the `SignUp` object with the missing fields
    // This example collects first and last name, but you can modify it for whatever settings you have enabled in the Clerk Dashboard
    await signUp.update({ firstName, lastName })

    if (signUp.status === 'complete') {
      await signUp.finalize({
        navigate: ({ session, decorateUrl }) => {
          // Handle session tasks
          // See https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks
          if (session?.currentTask) {
            console.log(session?.currentTask)
            return
          }

          // If no session tasks, navigate the signed-in user to the home page
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
      console.error('Sign-up attempt not complete:', signUp.status, signUp.missingFields)
    }
  }

  if (signUp.status !== 'missing_requirements') {
    // You can use this page to handle other statuses
    // This example only handles the missing_requirements status
    return null
  }

  const canSubmit = firstName.trim().length > 0 && lastName.trim().length > 0 && signUpFetchStatus !== 'fetching'

  return (
    <ThemedView style={styles.flex}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <ThemedText type="title" style={styles.title}>
          Continue sign-up
        </ThemedText>
        <ThemedText style={styles.hint}>Add your name to finish creating your account.</ThemedText>

        <View style={styles.fieldBlock}>
          <ThemedText style={styles.label}>First name</ThemedText>
          <TextInput
            style={styles.input}
            value={firstName}
            placeholder="First name"
            placeholderTextColor="#666666"
            onChangeText={setFirstName}
            autoCapitalize="words"
            autoCorrect
          />
          {signUpErrors.fields?.firstName ? (
            <ThemedText style={styles.error}>{signUpErrors.fields.firstName.message}</ThemedText>
          ) : null}
        </View>

        <View style={styles.fieldBlock}>
          <ThemedText style={styles.label}>Last name</ThemedText>
          <TextInput
            style={styles.input}
            value={lastName}
            placeholder="Last name"
            placeholderTextColor="#666666"
            onChangeText={setLastName}
            autoCapitalize="words"
            autoCorrect
          />
          {signUpErrors.fields?.lastName ? (
            <ThemedText style={styles.error}>{signUpErrors.fields.lastName.message}</ThemedText>
          ) : null}
        </View>

        <Pressable
          style={({ pressed }) => [styles.button, !canSubmit && styles.buttonDisabled, pressed && styles.buttonPressed]}
          onPress={handleSubmit}
          disabled={!canSubmit}
        >
          <ThemedText style={styles.buttonText}>
            {signUpFetchStatus === 'fetching' ? 'Submitting…' : 'Continue'}
          </ThemedText>
        </Pressable>
        {/* For your debugging purposes. You can just console.log errors, but we put them in the UI for convenience */}
        {signUpErrors && <ThemedText style={styles.error}>{JSON.stringify(signUpErrors, null, 2)}</ThemedText>}

        {/*
            Web Next.js flows use <div id="clerk-captcha" /> for bot protection.
            On native, Clerk handles risk checks without that DOM mount; use Clerk docs if you need a WebView CAPTCHA.
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
    marginBottom: 4,
  },
  hint: {
    fontSize: 14,
    marginBottom: 8,
    opacity: 0.85,
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
  linkContainer: {
    marginTop: 12,
    alignItems: 'flex-start',
  },
  error: {
    color: '#d32f2f',
    fontSize: 12,
    marginTop: 4,
  },
})
