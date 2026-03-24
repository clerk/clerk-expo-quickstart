import { useWaitlist } from '@clerk/expo'
import { useState } from 'react'
import { View, Text, TextInput, Button, StyleSheet } from 'react-native'

export default function WaitlistScreen() {
  const { waitlist, errors, fetchStatus } = useWaitlist()
  const [emailAddress, setEmailAddress] = useState('')

  const handleSubmit = async () => {
    const { error } = await waitlist.join({ emailAddress })
    if (error) {
      console.error('Failed to join waitlist:', error)
    }
  }

  if (waitlist.id) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Successfully joined the waitlist!</Text>
        <Text style={styles.message}>We'll notify you when you're approved.</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Join the Waitlist</Text>
      <TextInput
        style={styles.input}
        placeholder="Email address"
        value={emailAddress}
        onChangeText={setEmailAddress}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />
      {errors.fields.emailAddress && <Text style={styles.error}>{errors.fields.emailAddress.longMessage}</Text>}
      <Button
        title={fetchStatus === 'fetching' ? 'Submitting...' : 'Join Waitlist'}
        onPress={handleSubmit}
        disabled={fetchStatus === 'fetching'}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
})
