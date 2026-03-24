import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { useOrganizationList } from '@clerk/expo'
import { Href, useRouter } from 'expo-router'
import * as React from 'react'
import { Platform, Pressable, StyleSheet, TextInput } from 'react-native'

export default function CreateOrganization() {
  const { createOrganization, setActive } = useOrganizationList()
  const router = useRouter()

  const [organizationName, setOrganizationName] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [completed, setCompleted] = React.useState(false)

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      const newOrganization = await createOrganization?.({ name: organizationName })
      // Set the created Organization as the Active Organization
      if (newOrganization) {
        await setActive?.({
          organization: newOrganization.id,
          navigate: ({ decorateUrl }) => {
            // On native, `decorateUrl` can yield a path that resolves to a nested PUSH to
            // `index` from inside the org stack and hits the wrong navigator. Use an absolute
            // replace to `/organization` instead of push.
            if (Platform.OS === 'web') {
              const url = decorateUrl('/organization')
              if (url.startsWith('http')) {
                window.location.href = url
                return
              }
            }
            router.replace('/organization' as Href)
          },
        })
        setIsSubmitting(false)
        setCompleted(true)
      }
    } catch (err) {
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  if (completed) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.label}>Organization created</ThemedText>
      </ThemedView>
    )
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
          !organizationName && styles.buttonDisabled,
          pressed && styles.buttonPressed,
        ]}
        onPress={handleSubmit}
        disabled={!organizationName}
      >
        <ThemedText style={styles.buttonText} disabled={isSubmitting}>
          Create organization
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
  warning: {
    color: '#f57c00',
    fontSize: 14,
    marginTop: -4,
  },
})
