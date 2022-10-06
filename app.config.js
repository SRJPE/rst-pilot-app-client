import 'dotenv/config'

export default ({ config }) => {
  return {
    ...config,
    name: 'rst-pilot-app',
    slug: 'rst-pilot-app',
    extra: {
      REACT_APP_BASE_URL: process.env.REACT_APP_BASE_URL,
      test_var: 'bruh',
    },
  }
}
