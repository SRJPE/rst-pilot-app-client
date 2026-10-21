import 'dotenv/config'

const IOS_BUNDLE_IDS_BY_VARIANT = {
  testing: 'com.flowwest.datatackle.testing',
  yolo: 'com.flowwest.datatackle.yolo',
}
const iosBundleIdentifier =
  IOS_BUNDLE_IDS_BY_VARIANT[process.env.APP_VARIANT] || 'com.flowwest.datatackle'

export default ({ config }) => {
  return {
    ...config,
    name: 'DataTackle',
    slug: 'rst-pilot-app',
    owner: 'flowwest',
    runtimeVersion: {
      policy: 'sdkVersion',
    },
    ios: {
      bundleIdentifier: iosBundleIdentifier,
      supportsTablet: true,
      entitlements: {
        'com.apple.developer.networking.wifi-info': true,
      },
      config: {
        usesNonExemptEncryption: false,
      },
      infoPlist: {
        UIBackgroundModes: ['location', 'fetch', 'remote-notification'],
        NSLocationWhenInUseUsageDescription:
          'This app requires access to your location while using the app.',
        NSLocationAlwaysUsageDescription:
          'This app requires access to your location even when the app is in the background.',
        NSLocationAlwaysAndWhenInUseUsageDescription:
          'This app needs access to your location both when using the app and in the background to provide a better experience.',
        deploymentTarget: '14',
      },
    },
    android: {
      package: 'com.flowwest.datatackle',
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#FFFFFF',
      },
    },
    extra: {
      EXPO_PUBLIC_BASE_URL: process.env.EXPO_PUBLIC_BASE_URL,
      EXPO_PUBLIC_CLIENT_ID: process.env.EXPO_PUBLIC_CLIENT_ID,
      EXPO_PUBLIC_CLIENT_SECRET_VALUE:
        process.env.EXPO_PUBLIC_CLIENT_SECRET_VALUE,
      EXPO_PUBLIC_CLIENT_SECRET_ID: process.env.EXPO_PUBLIC_CLIENT_SECRET_ID,
      eas: {
        projectId: 'a6f6224b-3c38-4476-ad72-6cbea4d1bdc6',
      },
    },
    updates: {
      url: 'https://u.expo.dev/a6f6224b-3c38-4476-ad72-6cbea4d1bdc6',
    },
    scheme: 'com.onmicrosoft.rstb2c.rsttabletapp',
    plugins: [
      'expo-secure-store',
      'expo-web-browser',
      '@react-native-community/datetimepicker',
      'expo-font',
      'expo-sharing',
      'expo-status-bar',
      'expo-system-ui',
      [
        'expo-location',
        {
          locationAlwaysAndWhenInUsePermission:
            'Allow DataTackle to use your location.',
        },
      ],
      [
        'expo-image-picker',
        {
          photosPermission:
            'The app accesses your photos to let you share them with your friends.',
        },
      ],
      [
        'expo-document-picker',
        {
          iCloudContainerEnvironment: 'Production',
        },
      ],
      [
        'expo-splash-screen',
        {
          image: './assets/fish_splash_screen_icon.png',
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
        },
      ],
    ],
  }
}
