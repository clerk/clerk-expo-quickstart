import CreateOrganization from '@/components/create-org'
import { ThemedView } from '@/components/themed-view'
import { StyleSheet } from 'react-native'

export default function CreateOrganizationScreen() {
  return (
    <ThemedView style={styles.container}>
      <CreateOrganization />
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 12,
  },
})
