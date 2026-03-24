import * as React from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { useUser, useReverification, useClerk } from '@clerk/expo'
import { BackupCodeResource, PhoneNumberResource } from '@clerk/types'
import { Href, useRouter } from 'expo-router'

// Display phone numbers reserved for MFA
const ManageMfaPhoneNumbers = () => {
  const { user } = useUser()

  // Check if any phone numbers are reserved for MFA
  const mfaPhones = user?.phoneNumbers
    .filter((ph) => ph.verification.status === 'verified')
    .filter((ph) => ph.reservedForSecondFactor)
    .sort((ph: PhoneNumberResource) => (ph.defaultSecondFactor ? -1 : 1))

  if (!mfaPhones || mfaPhones.length === 0) {
    return <Text style={styles.infoText}>There are currently no phone numbers reserved for MFA.</Text>
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Phone numbers reserved for MFA</Text>
      {mfaPhones.map((phone) => {
        return (
          <View key={phone.id} style={styles.phoneItem}>
            <View style={styles.phoneInfo}>
              <Text style={styles.phoneNumber}>
                {phone.phoneNumber} {phone.defaultSecondFactor && <Text style={styles.badge}>(Default)</Text>}
              </Text>
            </View>

            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={() => phone.setReservedForSecondFactor({ reserved: false })}
              >
                <Text style={styles.secondaryButtonText}>Disable for MFA</Text>
              </TouchableOpacity>

              {!phone.defaultSecondFactor && (
                <TouchableOpacity
                  style={[styles.button, styles.primaryButton]}
                  onPress={() => phone.makeDefaultSecondFactor()}
                >
                  <Text style={styles.primaryButtonText}>Make default</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity style={[styles.button, styles.dangerButton]} onPress={() => phone.destroy()}>
                <Text style={styles.dangerButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        )
      })}
    </View>
  )
}

// Display phone numbers that are not reserved for MFA
const ManageAvailablePhoneNumbers = () => {
  const { user } = useUser()
  const clerk = useClerk()

  const setReservedForSecondFactor = useReverification((phone: PhoneNumberResource) =>
    phone.setReservedForSecondFactor({ reserved: true })
  )
  const destroyPhone = useReverification((phone: PhoneNumberResource) => phone.destroy())

  // Complete the session task when phone number is picked for MFA
  const completeTask = async () => {
    try {
      await clerk.setActive({ session: clerk.session?.id })
    } catch (err) {
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  // Get verified phone numbers that aren't reserved for MFA
  const availableForMfaPhones = user?.phoneNumbers
    .filter((ph) => ph.verification.status === 'verified')
    .filter((ph) => !ph.reservedForSecondFactor)

  // Enable a phone number for MFA
  const reservePhoneForMfa = async (phone: PhoneNumberResource) => {
    try {
      // Set the phone number as reserved for MFA
      await setReservedForSecondFactor(phone)
      if (clerk.session?.currentTask?.key === 'setup-mfa') completeTask()

      // Refresh the user information to reflect changes
      await user?.reload()
    } catch (err) {
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  if (!availableForMfaPhones || availableForMfaPhones.length === 0) {
    return (
      <Text style={styles.infoText}>
        There are currently no verified phone numbers available to be reserved for MFA.
      </Text>
    )
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Phone numbers not reserved for MFA</Text>

      {availableForMfaPhones.map((phone) => {
        return (
          <View key={phone.id} style={styles.phoneItem}>
            <View style={styles.phoneInfo}>
              <Text style={styles.phoneNumber}>{phone.phoneNumber}</Text>
            </View>

            <View style={styles.buttonGroup}>
              <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={() => reservePhoneForMfa(phone)}>
                <Text style={styles.primaryButtonText}>Use for MFA</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.button, styles.dangerButton]} onPress={() => destroyPhone(phone)}>
                <Text style={styles.dangerButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        )
      })}
    </View>
  )
}

// Generate and display backup codes
function GenerateBackupCodes() {
  const { user } = useUser()
  const [backupCodes, setBackupCodes] = React.useState<BackupCodeResource | undefined>(undefined)
  const createBackupCode = useReverification(() => user?.createBackupCode())

  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if (backupCodes) return

    setLoading(true)
    void createBackupCode()
      .then((backupCode: BackupCodeResource | undefined) => {
        if (backupCode) setBackupCodes(backupCode)
        setLoading(false)
      })
      .catch((err) => {
        // See https://clerk.com/docs/guides/development/custom-flows/error-handling
        // for more info on error handling
        console.error(JSON.stringify(err, null, 2))
        setLoading(false)
      })
  }, [backupCodes, createBackupCode])

  if (loading)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Generating backup codes...</Text>
      </View>
    )

  if (!backupCodes) return <Text style={styles.warningText}>There was a problem generating backup codes</Text>

  return (
    <View style={styles.backupCodesContainer}>
      <Text style={styles.backupCodesTitle}>Save these backup codes:</Text>
      {backupCodes.codes.map((code, index) => (
        <View key={index} style={styles.backupCodeItem}>
          <Text style={styles.backupCodeNumber}>{index + 1}.</Text>
          <Text style={styles.backupCode}>{code}</Text>
        </View>
      ))}
    </View>
  )
}

export default function ManageMFA() {
  const [showBackupCodes, setShowBackupCodes] = React.useState(false)

  const { isLoaded, user } = useUser()
  const router = useRouter()

  // Handle loading state
  if (!isLoaded)
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    )

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>User MFA Settings</Text>

      {/* Manage SMS MFA */}
      <ManageMfaPhoneNumbers />
      <ManageAvailablePhoneNumbers />

      <TouchableOpacity
        style={[styles.button, styles.primaryButton, styles.linkButton]}
        onPress={() => router.push('/(account)/add-phone' as Href)}
        activeOpacity={0.85}
      >
        <Text style={styles.primaryButtonText}>Add a new phone number</Text>
      </TouchableOpacity>

      {/* Manage backup codes */}
      {user?.twoFactorEnabled && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Backup Codes</Text>
          {!showBackupCodes ? (
            <View style={styles.backupPrompt}>
              <Text style={styles.infoText}>Generate new backup codes for account recovery</Text>
              <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={() => setShowBackupCodes(true)}>
                <Text style={styles.primaryButtonText}>Generate Backup Codes</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <GenerateBackupCodes />
              <TouchableOpacity
                style={[styles.button, styles.successButton, styles.doneButton]}
                onPress={() => setShowBackupCodes(false)}
              >
                <Text style={styles.successButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  phoneItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  phoneInfo: {
    marginBottom: 12,
  },
  phoneNumber: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  badge: {
    color: '#6366f1',
    fontWeight: '600',
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#6366f1',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  secondaryButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '600',
  },
  dangerButton: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  dangerButtonText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '600',
  },
  successButton: {
    backgroundColor: '#10b981',
  },
  successButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  linkButton: {
    marginTop: 8,
    alignSelf: 'stretch',
  },
  infoText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  warningText: {
    fontSize: 14,
    color: '#dc2626',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 12,
  },
  backupCodesContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  backupCodesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  backupCodeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 6,
    marginBottom: 6,
  },
  backupCodeNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    width: 24,
  },
  backupCode: {
    fontSize: 16,
    fontFamily: 'monospace',
    color: '#111827',
    fontWeight: '500',
  },
  backupPrompt: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
  },
  doneButton: {
    marginTop: 16,
  },
})
