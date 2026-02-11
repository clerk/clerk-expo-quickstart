import { useSignIn } from "@clerk/expo";
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

export default function SignInScreen() {
  const { signIn, errors, fetchStatus } = useSignIn();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  const isLoading = fetchStatus === "fetching";

  const handleSignIn = async () => {
    if (!signIn) return;

    try {
      const result = await signIn.password({
        identifier: emailAddress,
        password: password,
      });

      if (result.error) return;

      if (signIn.status === "complete") {
        // finalize sets the active session; the (auth) layout will
        // reactively redirect to /(home) once isSignedIn becomes true.
        await signIn.finalize();
      } else if (signIn.status === "needs_second_factor") {
        alert(
          "This account requires two-factor authentication. MFA flow not implemented in this demo."
        );
      }
    } catch (error) {
      console.error("[SignIn] error:", error);
    }
  };

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
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>
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
                errors.fields.identifier && styles.inputError,
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
            {errors.fields.identifier && (
              <Text style={styles.errorText}>
                {errors.fields.identifier.message}
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
              placeholder="Enter your password"
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

          {/* Global errors */}
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
            onPress={handleSignIn}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <Link href="/(auth)/sign-up" asChild>
            <TouchableOpacity>
              <Text style={styles.linkText}>Sign Up</Text>
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
