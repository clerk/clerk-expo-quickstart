import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { useOrganization } from '@clerk/expo'
import { OrganizationCustomRoleKey } from '@clerk/types'
import * as React from 'react'
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native'

export const OrgMembersParams = {
  memberships: {
    pageSize: 5,
    keepPreviousData: true,
  },
}

export const OrgInvitationsParams = {
  invitations: {
    pageSize: 5,
    keepPreviousData: true,
  },
}

// Form to invite a new member to the organization.
export const InviteMember = () => {
  const { isLoaded, organization, invitations } = useOrganization(OrgInvitationsParams)

  const [emailAddress, setEmailAddress] = React.useState('')
  const [selectedRole, setSelectedRole] = React.useState<OrganizationCustomRoleKey | undefined>()
  const [disabled, setDisabled] = React.useState(false)
  const [success, setSuccess] = React.useState(false)

  if (!isLoaded || !organization) {
    return (
      <ThemedView style={styles.center}>
        <ActivityIndicator size="large" />
        <ThemedText>Loading</ThemedText>
      </ThemedView>
    )
  }

  const onSubmit = async () => {
    if (!emailAddress || !selectedRole) {
      return
    }

    setDisabled(true)
    try {
      setSuccess(false)
      await organization.inviteMember({
        emailAddress: emailAddress,
        role: selectedRole,
      })
      await invitations?.revalidate?.()
      setEmailAddress('')
      setSelectedRole(undefined)
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
      }, 3000)
    } catch (error) {
      // Handle error - you may want to show an error message to the user
      console.error('Failed to invite member:', error)
    } finally {
      setDisabled(false)
    }
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.label}>Email address</ThemedText>
      <TextInput
        style={styles.input}
        placeholder="Email address"
        placeholderTextColor="#666666"
        value={emailAddress}
        onChangeText={(text) => setEmailAddress(text)}
      />
      <ThemedText style={styles.label}>Role</ThemedText>
      <SelectRole selectedRole={selectedRole} onRoleSelect={setSelectedRole} isDisabled={disabled} />
      <Pressable
        style={({ pressed }) => [
          styles.button,
          (!emailAddress || !selectedRole || disabled) && styles.buttonDisabled,
          pressed && styles.buttonPressed,
        ]}
        onPress={onSubmit}
        disabled={!emailAddress || !selectedRole || disabled}
      >
        <ThemedText style={styles.buttonText}>Invite</ThemedText>
      </Pressable>
      {success && <ThemedText style={styles.success}>Invitation sent successfully</ThemedText>}
    </ThemedView>
  )
}

type SelectRoleProps = {
  selectedRole?: OrganizationCustomRoleKey
  onRoleSelect: (role: OrganizationCustomRoleKey) => void
  isDisabled?: boolean
}

const SelectRole = (props: SelectRoleProps) => {
  const { selectedRole, onRoleSelect, isDisabled = false } = props
  const { organization } = useOrganization()
  const [fetchedRoles, setRoles] = React.useState<OrganizationCustomRoleKey[]>([])
  const [showModal, setShowModal] = React.useState(false)
  const isPopulated = React.useRef(false)

  React.useEffect(() => {
    if (isPopulated.current) return
    organization
      ?.getRoles({
        pageSize: 20,
        initialPage: 1,
      })
      .then((res) => {
        isPopulated.current = true
        setRoles(res.data.map((roles) => roles.key as OrganizationCustomRoleKey))
      })
  }, [organization?.id])

  if (fetchedRoles.length === 0) return null

  return (
    <View>
      <Pressable
        style={({ pressed }) => [
          styles.selectButton,
          isDisabled && styles.buttonDisabled,
          pressed && styles.buttonPressed,
        ]}
        onPress={() => !isDisabled && setShowModal(true)}
        disabled={isDisabled}
      >
        <ThemedText style={styles.selectButtonText}>{selectedRole || 'Select role'}</ThemedText>
      </Pressable>
      <Modal visible={showModal} transparent animationType="slide">
        <ThemedView style={styles.modalOverlay}>
          <ThemedView style={styles.modalContent}>
            <ThemedText type="title" style={styles.modalTitle}>
              Select Role
            </ThemedText>
            <ScrollView>
              {fetchedRoles?.map((roleKey) => (
                <Pressable
                  key={roleKey}
                  style={({ pressed }) => [
                    styles.roleOption,
                    selectedRole === roleKey && styles.roleOptionSelected,
                    pressed && styles.buttonPressed,
                  ]}
                  onPress={() => {
                    onRoleSelect(roleKey)
                    setShowModal(false)
                  }}
                >
                  <ThemedText
                    style={[styles.roleOptionText, selectedRole === roleKey && styles.roleOptionTextSelected]}
                  >
                    {roleKey}
                  </ThemedText>
                </Pressable>
              ))}
            </ScrollView>
            <Pressable
              style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
              onPress={() => setShowModal(false)}
            >
              <ThemedText style={styles.buttonText}>Cancel</ThemedText>
            </Pressable>
          </ThemedView>
        </ThemedView>
      </Modal>
    </View>
  )
}

// List of pending invitations to an organization.
export default function OrganizationInvitationList() {
  const { isLoaded, invitations, memberships } = useOrganization({
    ...OrgInvitationsParams,
    ...OrgMembersParams,
  })

  if (!isLoaded) {
    return (
      <ThemedView style={styles.center}>
        <ActivityIndicator size="large" />
        <ThemedText>Loading</ThemedText>
      </ThemedView>
    )
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Pending Invitations
      </ThemedText>
      {invitations?.data && invitations.data.length > 0 ? (
        <>
          <ScrollView style={styles.scrollView}>
            {invitations?.data?.map((inv) => (
              <View key={inv.id} style={styles.card}>
                <ThemedText style={styles.label}>User:</ThemedText>
                <ThemedText style={styles.value}>{inv.emailAddress}</ThemedText>

                <ThemedText style={styles.label}>Invited:</ThemedText>
                <ThemedText style={styles.value}>{inv.createdAt.toLocaleDateString()}</ThemedText>

                <ThemedText style={styles.label}>Role:</ThemedText>
                <ThemedText style={styles.value}>{inv.role}</ThemedText>

                <Pressable
                  style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
                  onPress={async () => {
                    await inv.revoke()
                    await Promise.all([memberships?.revalidate?.(), invitations?.revalidate?.()])
                  }}
                >
                  <ThemedText style={styles.buttonText}>Revoke</ThemedText>
                </Pressable>
              </View>
            ))}
          </ScrollView>

          <View style={styles.pagination}>
            <Pressable
              style={({ pressed }) => [
                styles.paginationButton,
                (!invitations?.hasPreviousPage || invitations?.isFetching) && styles.buttonDisabled,
                pressed && styles.buttonPressed,
              ]}
              disabled={!invitations?.hasPreviousPage || invitations?.isFetching}
              onPress={() => invitations?.fetchPrevious?.()}
            >
              <ThemedText style={styles.buttonText}>Previous</ThemedText>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.paginationButton,
                (!invitations?.hasNextPage || invitations?.isFetching) && styles.buttonDisabled,
                pressed && styles.buttonPressed,
              ]}
              disabled={!invitations?.hasNextPage || invitations?.isFetching}
              onPress={() => invitations?.fetchNext?.()}
            >
              <ThemedText style={styles.buttonText}>Next</ThemedText>
            </Pressable>
          </View>
        </>
      ) : (
        <ThemedText>No pending invitations</ThemedText>
      )}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 12,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  title: {
    marginBottom: 20,
  },
  label: {
    fontWeight: '600',
    fontSize: 14,
  },
  value: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  selectButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  selectButtonText: {
    fontSize: 16,
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
  scrollView: {
    flex: 1,
  },
  card: {
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    gap: 8,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  paginationButton: {
    flex: 1,
    backgroundColor: '#0a7ea4',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    width: '80%',
    maxHeight: '70%',
    gap: 16,
  },
  modalTitle: {
    marginBottom: 16,
  },
  roleOption: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f0f0f0',
  },
  roleOptionSelected: {
    backgroundColor: '#0a7ea4',
  },
  roleOptionText: {
    fontSize: 16,
  },
  roleOptionTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  success: {
    color: '#28a745',
    fontSize: 14,
    marginTop: 12,
    fontWeight: '600',
  },
})
