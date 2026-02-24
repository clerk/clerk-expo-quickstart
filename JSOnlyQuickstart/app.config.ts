import { ExpoConfig, ConfigContext } from "expo/config";
import "dotenv/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: process.env.APP_NAME || "clerk-js-only-quickstart",
  slug: process.env.APP_SLUG || "clerk-js-only-quickstart",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: process.env.APP_SCHEME || "myapp",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/images/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier:
      process.env.IOS_BUNDLE_IDENTIFIER || "com.yourcompany.yourapp",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: process.env.ANDROID_PACKAGE || "com.yourcompany.yourapp",
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: ["expo-router", "expo-secure-store", "expo-font"],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    router: {},
    eas: {
      projectId: process.env.EAS_PROJECT_ID || "Your Project ID",
    },
  },
});
