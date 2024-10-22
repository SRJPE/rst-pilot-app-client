import 'dotenv/config'

export default ({ config }) => {
  return {
    ...config,
    name: 'rst-pilot-app',
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
      REACT_APP_BASE_URL: process.env.REACT_APP_BASE_URL,
      REACT_APP_CLIENT_ID: process.env.REACT_APP_CLIENT_ID,
      REACT_APP_CLIENT_SECRET_VALUE: process.env.REACT_APP_CLIENT_SECRET_VALUE,
      REACT_APP_CLIENT_SECRET_ID: process.env.REACT_APP_CLIENT_SECRET_ID,
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
