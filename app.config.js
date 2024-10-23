import 'dotenv/config'

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
      bundleIdentifier: 'com.flowwest.datatackle',
      supportsTablet: true,
    },
    android: {
      package: 'com.flowwest.datatackle',
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
    plugins: ['expo-secure-store'],
  }
}
