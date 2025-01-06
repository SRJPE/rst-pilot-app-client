import React, { ChangeEvent } from 'react'
import { Box, FormControl, HStack, Input, Text } from 'native-base'

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
  onChangeText: (e: string | ChangeEvent<any>) => void
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void
  placeholder?: string
}

const FormInputComponent: React.FC<FormInputComponentI> = ({
  label,
  touched,
  errors,
  value,
  camelName,
  keyboardType,
  width,
  placeholder,
  onChangeText,
  onBlur,
}) => {
  const hasError = errors[camelName]

  const isTouched = touched[camelName]
  if (camelName === 'trapName') {
    console.log('🚀 ~ file: FormInputComponent.tsx:37 ~ hasError:', hasError)
    console.log('🚀 ~ file: FormInputComponent.tsx:40 ~ isTouched:', isTouched)
  }

  return (
    <FormControl width={width ? width : 'auto'} flex={1} isInvalid={hasError}>
      <FormControl.Label mb={1}>
        <Text color={errors[camelName] ? 'red.700' : 'black'} fontSize='16'>
          {label}
        </Text>
      </FormControl.Label>

      <Input
        height='50px'
        fontSize='16'
        keyboardType={keyboardType ? keyboardType : 'default'}
        placeholder={placeholder || 'No placeholder entered'}
        onChangeText={onChangeText}
        onBlur={onBlur}
        value={value}
        _focus={{
          borderColor: 'muted.300',
          _invalid: { borderColor: 'red.700' },
        }}
      />
      <Box mt={2} h={25}>
        {isTouched && hasError && (
          <RenderErrorMessage errors={errors} inputName={camelName} />
        )}
      </Box>
    </FormControl>
  )
}
export default FormInputComponent
