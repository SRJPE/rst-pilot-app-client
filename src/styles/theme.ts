import { extendTheme } from 'native-base'

const theme = extendTheme({
  colors: {
    primary: '#007C7C',
    secondary: '#D1E8F0',
    themeGrey: '#dadada42',
    error: 'red',
  },
  components: {
    defaultProps: {
      colorScheme: '#007C7C',
    },
  },
})

// Get the type of the CustomTheme
type themeType = typeof theme

// Extend the internal NativeBase Theme
declare module 'native-base' {
  interface ITheme extends themeType {}
}

export default theme
