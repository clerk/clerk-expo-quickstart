import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { useOrganizationList } from '@clerk/expo'
import * as React from 'react'
import { Pressable, StyleSheet, TextInput } from 'react-native'

export default function CreateOrganization() {
  const { createOrganization, setActive } = useOrganizationList()

  const [organizationName, setOrganizationName] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [completed, setCompleted] = React.useState(false)

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      const newOrganization = await createOrganization?.({ name: organizationName })
      // Set the created Organization as the Active Organization
      if (newOrganization) {
        await setActive?.({ organization: newOrganization.id })
        setIsSubmitting(false)
        setCompleted(true)
        setOrganizationName('')
        setTimeout(() => {
          setCompleted(false)
        }, 3000)
      }
    } catch (err) {
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.label}>Organization name</ThemedText>
      <TextInput
        style={styles.input}
        value={organizationName}
        onChangeText={setOrganizationName}
        placeholder="Organization name"
        placeholderTextColor="#666666"
      />
      <Pressable
        style={({ pressed }) => [
          styles.button,
          completed && styles.buttonSuccess,
          !organizationName && !completed && styles.buttonDisabled,
          pressed && !completed && styles.buttonPressed,
        ]}
        onPress={handleSubmit}
        disabled={!organizationName || isSubmitting}
      >
        <ThemedText style={styles.buttonText} disabled={isSubmitting}>
          {completed ? 'Organization created' : 'Create organization'}
        </ThemedText>
      </Pressable>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
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
  buttonSuccess: {
    backgroundColor: '#2e7d32',
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
