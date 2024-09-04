import * as React from 'react'
import { TextInput, Button, View, Text } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { Stack, useRouter } from 'expo-router'

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState('')
  const [emailError, setEmailError] = React.useState('')
  const [passwordError, setPasswordError] = React.useState('')
  const [otpError, setOtpError] = React.useState('')

  const onSignUpPress = async () => {
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
      await signUp.create({
        emailAddress,
        password,
      })

      await signUp.prepareEmailAddressVerification({
        strategy: 'email_code',
      })

      setPendingVerification(true)
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  const onPressVerify = async () => {
    if (!isLoaded) {
      return
    }

    if (!code) {
      setOtpError('OTP is required')
      return
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      })

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId })
        router.replace('/')
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2))
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  return (
    <View>
      <Stack.Screen
        options={{
          title: '',
          headerLeft: () => <Button title="Back" onPress={() => router.replace('/')} />,
        }}
      />
      {!pendingVerification && (
        <>
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              textAlign: 'center',
              marginVertical: 10,
            }}
          >
            Sign Up
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
            style={{
              marginBottom: 10,
              marginHorizontal: 10,
              borderColor: 'black',
              borderWidth: 1,
              padding: 10,
            }}
            inputMode="email"
            placeholderTextColor={'#000'}
            autoComplete="email"
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Email..."
            onChangeText={(email) => setEmailAddress(email)}
          />
          <TextInput
            value={password}
            style={{
              marginBottom: 10,
              marginHorizontal: 10,
              borderColor: 'black',
              borderWidth: 1,
              padding: 10,
            }}
            placeholder="Password..."
            autoComplete="password-new"
            placeholderTextColor={'#000'}
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
          />
          <Button title="Sign Up" onPress={onSignUpPress} />
        </>
      )}
      {pendingVerification && (
        <>
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              textAlign: 'center',
              marginVertical: 10,
            }}
          >
            We have sent you an email with a verification code. Please enter the code below.
          </Text>
          {otpError ? (
            <Text
              style={{
                color: 'red',
                marginBottom: 10,
                fontWeight: 'bold',
                fontSize: 16,
                textAlign: 'center',
              }}
            >
              {otpError}
            </Text>
          ) : null}
          <TextInput
            style={{
              marginBottom: 10,
              marginHorizontal: 10,
              borderColor: 'black',
              borderWidth: 1,
              padding: 10,
            }}
            autoComplete="one-time-code"
            value={code}
            placeholder="Code..."
            onChangeText={(code) => setCode(code)}
          />
          <Button title="Verify Email" onPress={onPressVerify} />
        </>
      )}
    </View>
  )
}
