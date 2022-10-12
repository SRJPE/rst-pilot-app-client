import { Text, Icon, HStack } from 'native-base'
import { Ionicons } from '@expo/vector-icons'

const renderErrorMessage = (errors: any, inputName: string) => {
  return (
    <HStack space={1}>
      <Icon
        marginTop={'.5'}
        as={Ionicons}
        name='alert-circle-outline'
        color='error'
      />
      <Text style={{ fontSize: 14, color: 'red' }}>
        {errors[inputName] as string}
      </Text>
    </HStack>
  )
}
export default renderErrorMessage
