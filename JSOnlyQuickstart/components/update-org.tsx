import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { useOrganization } from '@clerk/expo'
import * as React from 'react'
import { Pressable, StyleSheet, TextInput } from 'react-native'

export const UpdateOrganization = () => {
  const { organization, isLoaded } = useOrganization()

  const [name, setName] = React.useState('')
  const [success, setSuccess] = React.useState(false)

  if (!organization) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>No active organization</ThemedText>
        {/* You could redirect to the page where your organization switcher is so the user can select an active organization */}
      </ThemedView>
    )
  }

  React.useEffect(() => {
    if (!organization) {
      return
    }
    setName(organization.name)
  }, [organization])

  if (!isLoaded || !organization) {
    return null
  }

  const handleSubmit = async () => {
    try {
      setSuccess(false)
      await organization?.update({ name })
      setSuccess(true)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Update the current organization
      </ThemedText>
      <ThemedText style={styles.label}>Name</ThemedText>
      <TextInput
        style={styles.input}
        value={name}
        placeholder="Organization name"
        placeholderTextColor="#666666"
        onChangeText={(text) => setName(text)}
      />
      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={handleSubmit}
        disabled={!name.trim()}
      >
        <ThemedText style={styles.buttonText}>Update</ThemedText>
      </Pressable>
      {success && <ThemedText style={styles.success}>Organization updated successfully</ThemedText>}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
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
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  success: {
    color: '#28a745',
    fontSize: 14,
    marginTop: 12,
    fontWeight: '600',
  },
  link: {
    color: '#0a7ea4',
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
})
