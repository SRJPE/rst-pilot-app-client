import {
  Text,
  HStack,
  Switch,
  useColorMode,
  useColorModeValue,
} from 'native-base'

export default function ThemeToggle() {
  const { colorMode, toggleColorMode } = useColorMode()
  return (
    <HStack space={2} alignItems='center'>
      <Text color={useColorModeValue('primary', '#FFFFFF')}>Dark</Text>
      <Switch
        isChecked={colorMode === 'light'}
        onToggle={toggleColorMode}
        offThumbColor='primary'
        onTrackColor='primary'
        offTrackColor='#FFFFFF'
      ></Switch>
      <Text color={useColorModeValue('primary', '#FFFFFF')}>Light</Text>
    </HStack>
  )
}
