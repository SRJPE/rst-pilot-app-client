import { Text, Icon, HStack } from 'native-base'
import { Ionicons } from '@expo/vector-icons'

const RenderWarningMessage = () => {
  return (
    <HStack space={1} pt='1'>
      <Icon
        marginTop={'.5'}
        as={Ionicons}
        name='warning-outline'
        color='warning'
      />
      <Text style={{ fontSize: 16, color: '#eec227' }}>
        {'Value out of range' as string}
      </Text>
    </HStack>
  )
}
export default RenderWarningMessage
