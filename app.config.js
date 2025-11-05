import 'dotenv/config';

export default {
  expo: {
    name: 'Runify',
    slug: 'Runify',
    version: '1.0.0',
    owner: 'runify',

    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'runify',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,

    ios: {
      supportsTablet: true,
    },

    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
      package: 'com.runify.Runify',
    },

    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },

    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
        },
      ],
    ],

    experiments: {
      typedRoutes: true,
    },

    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL,
      router: {},
      eas: {
        projectId: 'e91a019d-c96d-482e-816c-767d286ee9c9',
      },
    },
  },
};
