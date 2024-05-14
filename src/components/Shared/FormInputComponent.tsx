import React, { ChangeEvent } from 'react'
import { FormControl, HStack, Input, Text, VStack } from 'native-base'

import RenderErrorMessage from '../Shared/RenderErrorMessage'
import {
  KeyboardTypeOptions,
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from 'react-native'

interface FormInputComponentI {
  label: string
  touched: any
  errors: any
  value: string
  camelName: string
  keyboardType?: KeyboardTypeOptions | undefined
  width?: string
  stackDirection?: string
  onChangeText: (e: string | ChangeEvent<any>) => void
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void
}

const FormInputComponent: React.FC<FormInputComponentI> = ({
  label,
  touched,
  errors,
  value,
  camelName,
  keyboardType,
  width,
  stackDirection,
  onChangeText,
  onBlur,
}) => {
  return (
    <FormControl width={width ? width : '100%'}>
      <HStack space={4} alignItems='center'>
        <FormControl.Label>
          <Text color='black' fontSize='xl'>
            {label}
          </Text>
        </FormControl.Label>

        {stackDirection !== 'column' &&
          touched[camelName] &&
          errors[camelName] &&
          RenderErrorMessage(errors, camelName)}
      </HStack>
      <VStack space={2}>
        <Input
          height='50px'
          fontSize='16'
          keyboardType={keyboardType ? keyboardType : 'default'}
          placeholder={label}
          onChangeText={onChangeText}
          onBlur={onBlur}
          value={value}
        />
        {stackDirection == 'column' &&
          touched[camelName] &&
          errors[camelName] &&
          RenderErrorMessage(errors, camelName)}
      </VStack>
    </FormControl>
  )
}
export default FormInputComponent
// {
//   stackDirection === 'column' ? (
//     <VStack space={4} alignItems='center'>
//       <FormControl.Label>
//         <Text color='black' fontSize='xl'>
//           {label}
//         </Text>
//       </FormControl.Label>

//       {touched[camelName] &&
//         errors[camelName] &&
//         RenderErrorMessage(errors, camelName)}
//       {/* <RenderErrorMessage errors={errors} inputName={camelName} /> */}
//     </VStack>
//   ) : (
//     <HStack space={4} alignItems='center'>
//       <FormControl.Label>
//         <Text color='black' fontSize='xl'>
//           {label}
//         </Text>
//       </FormControl.Label>

//       {touched[camelName] &&
//         errors[camelName] &&
//         RenderErrorMessage(errors, camelName)}
//       {/* <RenderErrorMessage errors={errors} inputName={camelName} /> */}
//     </HStack>
//   )
// }
