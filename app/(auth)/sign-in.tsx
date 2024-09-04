import { useSignIn } from '@clerk/clerk-expo'
import { Stack, useRouter } from 'expo-router'
import { Text, TextInput, Button, View } from 'react-native'
import React from 'react'
import * as WebBrowser from 'expo-web-browser'

export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    // Warm up the android browser to improve UX
    // https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync()
    return () => {
      void WebBrowser.coolDownAsync()
    }
  }, [])
}

WebBrowser.maybeCompleteAuthSession()

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [emailError, setEmailError] = React.useState('')
  const [passwordError, setPasswordError] = React.useState('')

  const onSignInPress = React.useCallback(async () => {
    if (!isLoaded) {
      return
    }

    if (!emailAddress) {
      setEmailError('Email is required')
    }
    if (!password) {
      setPasswordError('Password is required')
    }

    if (!emailAddress || !password) {
      return
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
      } else {
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2))
    }
  }, [isLoaded, emailAddress, password])

  return (
    <View>
      <Stack.Screen
        options={{
          title: '',
          headerLeft: () => <Button title="Back" onPress={() => router.replace('/')} />,
        }}
      />

      <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          textAlign: 'center',
          marginVertical: 10,
        }}
      >
        Sign In
      </Text>
      <View>
        {emailError ? (
          <Text
            style={{
              color: 'red',
              marginBottom: 10,
              fontWeight: 'bold',
              fontSize: 16,
              textAlign: 'center',
            }}
          >
            {emailError}
          </Text>
        ) : null}
        {passwordError ? (
          <Text
            style={{
              color: 'red',
              marginBottom: 10,
              fontWeight: 'bold',
              fontSize: 16,
              textAlign: 'center',
            }}
          >
            {passwordError}
          </Text>
        ) : null}
      </View>
      <TextInput
        autoCapitalize="none"
        placeholderTextColor={'#000'}
        value={emailAddress}
        placeholder="Email..."
        autoComplete="email"
        inputMode="email"
        style={{
          marginBottom: 10,
          marginHorizontal: 10,
          borderColor: 'black',
          borderWidth: 1,
          padding: 10,
        }}
        onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
      />
      <TextInput
        value={password}
        placeholder="Password..."
        placeholderTextColor={'#000'}
        autoComplete="password"
        style={{
          marginBottom: 10,
          marginHorizontal: 10,
          borderColor: 'black',
          borderWidth: 1,
          padding: 10,
        }}
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
      />
      <Button title="Sign In" onPress={onSignInPress} />

      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 10,
        }}
      >
        <Text
          style={{
            marginTop: 10,
            marginBottom: 10,
            fontSize: 20,
          }}
        >
          Don't have an account?
        </Text>
        <Button onPress={() => router.replace('/sign-up')} title="Sign Up" />
      </View>
    </View>
  )
}
