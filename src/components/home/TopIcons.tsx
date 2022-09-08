import { Flex, HStack, IconButton } from 'native-base'
import Ionicons from '@expo/vector-icons/Ionicons'

export default function TopIcons() {
  return (
    <Flex>
      <HStack space={700}>
        <IconButton
          onPress={() => console.log('pressed home')}
          _icon={{
            as: Ionicons,
            name: 'home',
            size: 8,
            color: 'primary',
          }}
        />
        <IconButton
          onPress={() => console.log('pressed Profile')}
          _icon={{
            as: Ionicons,
            name: 'person-circle',
            size: 8,
            color: 'primary',
          }}
        />
      </HStack>
    </Flex>
  )
}
