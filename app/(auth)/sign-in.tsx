import { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useSignIn, isClerkAPIResponseError } from '@clerk/clerk-expo';
import {
  ClerkAPIError,
  EmailCodeFactor,
  SignInFirstFactor,
} from '@clerk/types';
import { Link, useRouter } from 'expo-router';
import OAuthButtons from '@/components/OAuthButtons';
import { OtpInput } from 'react-native-otp-entry';

export default function Page() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [showOTPForm, setShowOTPForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ClerkAPIError[]>([]);
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  async function handleEmailSignIn() {
    if (!isLoaded) return;

    setLoading(true);
    setErrors([]);

    try {
      // Start the sign-in process using the email method
      const { supportedFirstFactors } = await signIn.create({
        identifier: email,
      });

      // Filter the returned array to find the 'email' entry
      const isEmailCodeFactor = (
        factor: SignInFirstFactor,
      ): factor is EmailCodeFactor => {
        return factor.strategy === 'email_code';
      };
      const emailCodeFactor = supportedFirstFactors?.find(isEmailCodeFactor);

      if (emailCodeFactor) {
        // Grab the emailAddressId
        const { emailAddressId } = emailCodeFactor;

        // Send the OTP code to the user
        await signIn.prepareFirstFactor({
          strategy: 'email_code',
          emailAddressId,
        });

        // Set showOTPForm to true to display second form and capture the OTP code
        setShowOTPForm(true);
      }
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        setErrors(err.errors);
      }
      console.error(JSON.stringify(err, null, 2));
    }

    setLoading(false);
  }

  async function handleVerification() {
    if (!isLoaded) return;

    setLoading(true);
    setErrors([]);

    try {
      // Use the code provided by the user and attempt verification
      const completeSignIn = await signIn.attemptFirstFactor({
        strategy: 'email_code',
        code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (completeSignIn.status === 'complete') {
        await setActive({ session: completeSignIn.createdSessionId });
        router.replace('/profile');
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(completeSignIn, null, 2));
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
          style={styles.continueButton}
          onPress={handleVerification}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.continueButtonText}>Continue ▸</Text>
          )}
        </TouchableOpacity>

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
      <Text style={styles.title}>Sign in to Your App</Text>
      <Text style={styles.subtitle}>
        Welcome back! Please sign in to continue
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
        style={styles.continueButton}
        onPress={handleEmailSignIn}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.continueButtonText}>Continue ▸</Text>
        )}
      </TouchableOpacity>

      <View style={styles.footerTextContainer}>
        <Text style={styles.footerText}>
          Don't' have an account?{' '}
          <Link style={styles.footerTextLink} href="/sign-up">
            Sign up
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
