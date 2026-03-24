import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { useUser } from '@clerk/expo'
import { PhoneNumberResource } from '@clerk/types'
import { Href, useRouter } from 'expo-router'
import * as React from 'react'
import { Pressable, StyleSheet, TextInput, TouchableOpacity } from 'react-native'

export default function Page() {
  const { isLoaded, user } = useUser()
  const router = useRouter()

  const [phone, setPhone] = React.useState('')
  const [code, setCode] = React.useState('')
  const [isVerifying, setIsVerifying] = React.useState(false)
  const [successful, setSuccessful] = React.useState(false)
  const [phoneObj, setPhoneObj] = React.useState<PhoneNumberResource | undefined>()

  // Handle loading state
  if (!isLoaded) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    )
  }

  // Handle addition of the phone number
  const handleSubmit = async () => {
    try {
      // Add unverified phone number to user
      const res = await user?.createPhoneNumber({ phoneNumber: phone })
      // Reload user to get updated User object
      await user?.reload()

      // Create a reference to the new phone number to use related methods
      const phoneNumber = user?.phoneNumbers.find((a) => a.id === res?.id)
      setPhoneObj(phoneNumber)

      // Send the user an SMS with the verification code
      await phoneNumber?.prepareVerification()

      // Set to true to display second form
      // and capture the code
      setIsVerifying(true)
    } catch (err) {
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  // Handle the submission of the verification form
  const verifyCode = async () => {
    try {
      // Verify that the provided code matches the code sent to the user
      const phoneVerifyAttempt = await phoneObj?.attemptVerification({ code })

      if (phoneVerifyAttempt?.verification.status === 'verified') {
        setSuccessful(true)
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(phoneVerifyAttempt, null, 2))
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
    }
  }

  // Display a success message if the phone number was added successfully
  if (successful) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          Phone added
        </ThemedText>
        <TouchableOpacity
          style={[styles.button]}
          onPress={() => router.replace('/(account)/manage-mfa' as Href)}
          activeOpacity={0.85}
        >
          <ThemedText style={styles.buttonText}>Manage MFA</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    )
  }

  // Display the verification form to capture the code
  if (isVerifying) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          Verify phone
        </ThemedText>
        <ThemedText style={styles.label}>Enter code</ThemedText>
        <TextInput
          style={styles.input}
          value={code}
          placeholder="Enter code"
          placeholderTextColor="#666666"
          onChangeText={setCode}
          keyboardType="numeric"
        />
        <Pressable
          style={({ pressed }) => [styles.button, !code && styles.buttonDisabled, pressed && styles.buttonPressed]}
          onPress={verifyCode}
          disabled={!code}
        >
          <ThemedText style={styles.buttonText}>Verify</ThemedText>
        </Pressable>
      </ThemedView>
    )
  }

  // Display the initial form to capture the phone number
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Add phone
      </ThemedText>
      <ThemedText style={styles.label}>Enter phone number</ThemedText>
      <TextInput
        style={styles.input}
        value={phone}
        placeholder="e.g +1234567890"
        placeholderTextColor="#666666"
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <Pressable
        style={({ pressed }) => [styles.button, !phone && styles.buttonDisabled, pressed && styles.buttonPressed]}
        onPress={handleSubmit}
        disabled={!phone}
      >
        <ThemedText style={styles.buttonText}>Continue</ThemedText>
      </Pressable>
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
})
