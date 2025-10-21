import { Text, Icon, HStack, FormControl } from 'native-base'
import { Ionicons } from '@expo/vector-icons'

const RenderErrorMessage = ({
  errors,
  inputName,
}: {
  errors: any
  inputName: string
}) => {
  return (
    <Text
      style={{
        fontSize: 14,
        color: '#b71c1c',
      }}
    >
      {errors[inputName] as string}
    </Text>
  )
}
export default RenderErrorMessage

// This is the functional component version of this component.
// refactor needed throughout the app to implement

// const RenderErrorMessage = ({
//   errors,
//   inputName,
// }: {
//   errors: any
//   inputName: string
// }) => {
//   return (
//     <HStack space={1}>
//       <Icon
//         marginTop={'.5'}
//         as={Ionicons}
//         name='alert-circle-outline'
//         color='error'
//       />
//       <Text style={{ fontSize: 16, color: '#b71c1c' }}>
//         {errors[inputName] as string}
//       </Text>
//     </HStack>
//   )
// }
