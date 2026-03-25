import { ThemedView } from '@/components/themed-view'
import { UpdateOrganization } from '@/components/update-org'
import { StyleSheet } from 'react-native'

export default function CreateOrganizationScreen() {
  return (
    <ThemedView style={styles.container}>
      <UpdateOrganization />
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
