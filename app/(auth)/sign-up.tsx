import { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useSignUp, isClerkAPIResponseError } from '@clerk/clerk-expo';
import { ClerkAPIError } from '@clerk/types';
import { Link, useRouter } from 'expo-router';
import { OtpInput } from 'react-native-otp-entry';
import OAuthButtons from '@/components/OAuthButtons';

export default function Page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showOTPForm, setShowOTPForm] = useState(false);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ClerkAPIError[]>([]);
  const { signUp, setActive, isLoaded } = useSignUp();
  const router = useRouter();

  async function handleSignUp() {
    if (!isLoaded) return;

    setLoading(true);
    setErrors([]);

    try {
      // Start the sign-up process using the email and password method
      await signUp.create({
        emailAddress: email,
        password,
      });

      // Start the verification - a OTP code will be sent to the email
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      // Set showOTPForm to true to display second form and capture the OTP code
      setShowOTPForm(true);
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }

    setLoading(false);
  }

  async function handleVerification() {
    if (!isLoaded) return;

    setLoading(true);

    try {
      // Use the code provided by the user and attempt verification
      const signInAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace('/profile');
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      if (isClerkAPIResponseError(err)) {
        setErrors(err.errors);
      }
      console.error(JSON.stringify(err, null, 2));
    }

    setLoading(false);
  }

  if (showOTPForm) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Check your email</Text>
        <Text style={styles.subtitle}>to continue to your app</Text>

        <OtpInput
          focusColor="#a0a0a0"
          theme={{
            containerStyle: { marginBottom: 15 },
          }}
          numberOfDigits={6}
          onTextChange={setCode}
        />

        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleVerification}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.continueButtonText}>Continue ▸</Text>
          )}
        </TouchableOpacity>

        {errors.length > 0 && (
          <View style={styles.errorContainer}>
            {errors.map((error, index) => (
              <Text key={index} style={styles.errorMessage}>
                • {error.longMessage}
              </Text>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setShowOTPForm(false)}
        >
          <Text style={styles.footerTextLink}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create your account</Text>
      <Text style={styles.subtitle}>
        Welcome! Please fill in the details to get started.
      </Text>

      <OAuthButtons />

      <Text style={styles.orSeparator}>or</Text>

      <Text style={styles.label}>Email address</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        secureTextEntry={true}
      />

      {errors.length > 0 && (
        <View style={styles.errorContainer}>
          {errors.map((error, index) => (
            <Text key={index} style={styles.errorMessage}>
              • {error.longMessage}
            </Text>
          ))}
        </View>
      )}

      <TouchableOpacity style={styles.continueButton} onPress={handleSignUp}>
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.continueButtonText}>Continue ▸</Text>
        )}
      </TouchableOpacity>

      <View style={styles.footerTextContainer}>
        <Text style={styles.footerText}>
          Already have an account?{' '}
          <Link style={styles.footerTextLink} href="/sign-in">
            Sign in
          </Link>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 20,
  },
  orSeparator: {
    textAlign: 'center',
    marginVertical: 15,
    color: 'gray',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  errorContainer: {
    marginBottom: 15,
  },
  errorMessage: {
    color: 'red',
    fontSize: 14,
    marginBottom: 5,
  },
  continueButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    alignItems: 'center',
    marginTop: 15,
  },
  footerTextContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: 'gray',
  },
  footerTextLink: {
    color: 'black',
    fontWeight: 'bold',
  },
});
