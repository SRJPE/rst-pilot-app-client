import { extendTheme } from 'native-base'

const theme = extendTheme({
  colors: {
    primary: '#007C7C',
    secondary: '#D1E8F0',
    themeGrey: 'rgba(218, 218, 218, 0.26)',
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
