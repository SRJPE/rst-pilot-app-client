import { extendTheme, NativeBaseProvider } from 'native-base'
// 2. Extend the theme to include custom colors, fonts, etc
const newColorTheme = {
  brand: {
    900: '#8287af',
    800: '#7c83db',
    700: '#b3bef6',
  },
}
const theme = extendTheme({
  colors: {
    primary: '#007C7C',
    secondary: '#D1E8F0',
    themeGrey: 'rgba(218, 218, 218, 0.26)',
  },
})

// 2. Get the type of the CustomTheme
type themeType = typeof theme

// 3. Extend the internal NativeBase Theme
declare module 'native-base' {
  interface ITheme extends themeType {}
}

export default theme
