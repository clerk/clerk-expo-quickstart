import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useOAuth } from '@clerk/clerk-expo';
import { OAuthStrategy } from '@clerk/types';

interface SSOButtonProps {
  icon: string;
  text: string;
  onPress: () => void;
}

const useWarmUpBrowser = () => {
  useEffect(() => {
    // Warm up the android browser to improve UX
    // https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

const SSOButton: React.FC<SSOButtonProps> = ({ icon, text, onPress }) => (
  <TouchableOpacity style={styles.ssoButton} onPress={onPress}>
    <FontAwesome
      name={icon as any}
      size={20}
      color="black"
      style={styles.icon}
    />
    <Text style={styles.ssoButtonText}>{text}</Text>
  </TouchableOpacity>
);

export default function OAuthButtons() {
  useWarmUpBrowser();

  const { startOAuthFlow: startGoogleOAuthFlow } = useOAuth({
    strategy: 'oauth_google',
  });
  const { startOAuthFlow: startGitHubOAuthFlow } = useOAuth({
    strategy: 'oauth_github',
  });
  const router = useRouter();

  async function handleSSO(strategy: OAuthStrategy) {
    let startOAuthFlow: typeof startGoogleOAuthFlow;

    if (strategy === 'oauth_google') {
      startOAuthFlow = startGoogleOAuthFlow;
    } else if (strategy === 'oauth_github') {
      startOAuthFlow = startGitHubOAuthFlow;
    } else {
      throw new Error(`Unsupported strategy: ${strategy}`);
    }

    try {
      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL('/profile', { scheme: 'myapp' }),
      });

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        router.push('/profile');
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  }

  return (
    <View>
      <SSOButton
        icon="github"
        text="GitHub"
        onPress={() => handleSSO('oauth_github')}
      />
      <SSOButton
        icon="google"
        text="Google"
        onPress={() => handleSSO('oauth_google')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  ssoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  ssoButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  icon: {
    marginRight: 10,
  },
});
