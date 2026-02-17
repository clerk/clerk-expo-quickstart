import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { useOrganizationCreationDefaults, useOrganizationList } from '@clerk/expo'
import { useEffect, useState } from 'react'
import { Pressable, StyleSheet, TextInput } from 'react-native'

export default function CreateOrganizationWithWarning() {
  const { isLoaded, createOrganization, setActive } = useOrganizationList()
  const { data: defaults, isLoading } = useOrganizationCreationDefaults()
  const [organizationName, setOrganizationName] = useState('')

  useEffect(() => {
    if (defaults?.form.name) {
      setOrganizationName(defaults.form.name)
    }
  }, [defaults?.form.name])

  if (!isLoaded || isLoading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    )
  }

  // Check if an organization with this name/domain already exists
  const advisory = defaults?.advisory
  const showWarning = advisory?.code === 'organization_already_exists'
  const existingOrgName = advisory?.meta?.organization_name
  const existingOrgDomain = advisory?.meta?.organization_domain

  const handleSubmit = async () => {
    try {
      const newOrganization = await createOrganization?.({ name: organizationName })
      // Set the created Organization as the Active Organization
      if (newOrganization) setActive({ organization: newOrganization.id })
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
      {showWarning && (
        <ThemedText style={styles.warning}>
          An organization "{existingOrgName}" already exists for the domain "{existingOrgDomain}".
        </ThemedText>
      )}
      <Pressable
        style={({ pressed }) => [styles.button, !organizationName && styles.buttonDisabled, pressed && styles.buttonPressed]}
        onPress={handleSubmit}
        disabled={!organizationName}
      >
        <ThemedText style={styles.buttonText}>Create organization</ThemedText>
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
