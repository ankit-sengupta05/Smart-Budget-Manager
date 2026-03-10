import 'dotenv/config';

export default {
  expo: {
    name: "SmartBudgetManager",
    slug: "SmartBudgetManager",
    version: "1.0.0",
    newArchEnabled: true,
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "dark",
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#0a0a0f",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.cyborg.smartbudgetmanager",
    },
    android: {
      package: "com.cyborg.smartbudgetmanager",
      adaptiveIcon: {
        foregroundImage: "./assets/icon.png",
        backgroundColor: "#0a0a0f",
      },
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    plugins: ["expo-secure-store", "expo-asset", "expo-font"],
    extra: {
      eas: {
        projectId: "6bddee6c-db14-467c-9097-6206f9efddcf"
      },
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID,
    },
  },
};
