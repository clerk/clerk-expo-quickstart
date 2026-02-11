import { useSignUp } from "@clerk/expo";
import { Link } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import GoogleSignInButton from "@/app/components/GoogleSignInButton";
import AppleSignInButton from "@/app/components/AppleSignInButton";

/**
 * Core-3 Sign Up Screen
 *
 * This screen uses the Core-3 Signal API pattern:
 * - useSignUp returns { signUp, errors, fetchStatus }
 * - signUp.password({ emailAddress, password }) for password signup
 * - signUp.verifications.sendEmailCode() to send verification
 * - signUp.verifications.verifyEmailCode({ code }) to verify
 * - signUp.finalize() to complete sign-up and set active session
 */
export default function SignUpScreen() {
  const { signUp, errors, fetchStatus } = useSignUp();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);

  const isLoading = fetchStatus === "fetching";

  const handleSignUp = async () => {
    if (!signUp) return;

    const result = await signUp.password({
      emailAddress,
      password,
    });

    if (result.error) return;

    if (signUp.unverifiedFields.includes("email_address")) {
      const sendResult = await signUp.verifications.sendEmailCode();
      if (sendResult.error) return;
      setPendingVerification(true);
    } else if (signUp.status === "complete") {
      // finalize sets the active session; the (auth) layout will
      // reactively redirect to /(home) once isSignedIn becomes true.
      await signUp.finalize();
    }
  };

  const handleVerifyEmail = async () => {
    if (!signUp) return;

    const result = await signUp.verifications.verifyEmailCode({ code });

    if (result.error) return;

    if (signUp.status === "complete") {
      await signUp.finalize();
    }
  };

  // Email verification screen
  if (pendingVerification) {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>Verify Email</Text>
            <Text style={styles.subtitle}>
              We've sent a verification code to {emailAddress}
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Verification Code</Text>
              <TextInput
                style={[styles.input, errors.fields.code && styles.inputError]}
                placeholder="Enter verification code"
                placeholderTextColor="#999"
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                editable={!isLoading}
              />
              {errors.fields.code && (
                <Text style={styles.errorText}>{errors.fields.code.message}</Text>
              )}
            </View>

            {errors.global && errors.global.length > 0 && (
              <View style={styles.globalError}>
                {errors.global.map((err, idx) => (
                  <Text key={idx} style={styles.errorText}>
                    {err.message}
                  </Text>
                ))}
              </View>
            )}

            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleVerifyEmail}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Verify Email</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  // Sign up form
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>
        </View>

        {/* Native OAuth Buttons */}
        <View style={styles.oauthSection}>
          <AppleSignInButton showDivider={false} />
          <GoogleSignInButton showDivider={false} />
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with email</Text>
            <View style={styles.dividerLine} />
          </View>
        </View>

        {/* Email/Password Form */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[
                styles.input,
                errors.fields.emailAddress && styles.inputError,
              ]}
              placeholder="Enter your email"
              placeholderTextColor="#999"
              value={emailAddress}
              onChangeText={setEmailAddress}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              editable={!isLoading}
            />
            {errors.fields.emailAddress && (
              <Text style={styles.errorText}>
                {errors.fields.emailAddress.message}
              </Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={[
                styles.input,
                errors.fields.password && styles.inputError,
              ]}
              placeholder="Create a password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!isLoading}
            />
            {errors.fields.password && (
              <Text style={styles.errorText}>
                {errors.fields.password.message}
              </Text>
            )}
          </View>

          {errors.global && errors.global.length > 0 && (
            <View style={styles.globalError}>
              {errors.global.map((err, idx) => (
                <Text key={idx} style={styles.errorText}>
                  {err.message}
                </Text>
              ))}
            </View>
          )}

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleSignUp}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Create Account</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Link href="/(auth)/sign-in" asChild>
            <TouchableOpacity>
              <Text style={styles.linkText}>Sign In</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 60,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  oauthSection: {
    marginBottom: 24,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e0e0e0",
  },
  dividerText: {
    marginHorizontal: 16,
    color: "#666",
    fontSize: 14,
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: "#f8f9fa",
  },
  inputError: {
    borderColor: "#dc3545",
    backgroundColor: "#fff5f5",
  },
  errorText: {
    color: "#dc3545",
    fontSize: 13,
  },
  globalError: {
    padding: 12,
    backgroundColor: "#fff5f5",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dc3545",
  },
  button: {
    backgroundColor: "#FF0000",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: "#ffaaaa",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 32,
  },
  footerText: {
    color: "#666",
    fontSize: 14,
  },
  linkText: {
    color: "#FF0000",
    fontSize: 14,
    fontWeight: "600",
  },
});
