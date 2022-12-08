import 'dotenv/config'

export default ({ config }) => {
  return {
    ...config,
    name: 'rst-pilot-app',
    slug: 'rst-pilot-app',
    runtimeVersion: {
      policy: 'sdkVersion',
    },
    ios: {
      bundleIdentifier: 'com.flowwest.rstapp',
      supportsTablet: true
    },
    extra: {
      REACT_APP_BASE_URL: process.env.REACT_APP_BASE_URL,
      eas: {
        projectId: 'a6f6224b-3c38-4476-ad72-6cbea4d1bdc6',
      },
    },
    updates: {
      url: 'https://u.expo.dev/a6f6224b-3c38-4476-ad72-6cbea4d1bdc6',
    },
  }
}
