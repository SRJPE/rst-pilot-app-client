import { extendTheme } from 'native-base'

const theme = extendTheme({
  colors: {
    primary: '#007C7C',
    secondary: '#D1E8F0',
    // primary: '#4c642f',
    // secondary: '#842f3f',
    themeGrey: '#DADADA42',

    error: '#b71c1c',
    warning: '#eec227',
    info: '#6c9a93',
    success: '#7e9752',
  },
  components: {
    // defaultProps: {
    //   colorScheme: '#007C7C',
    // },
  },
})

// Get the type of the CustomTheme
type themeType = typeof theme

// Extend the internal NativeBase Theme
declare module 'native-base' {
  interface ITheme extends themeType {}
}

export default theme
