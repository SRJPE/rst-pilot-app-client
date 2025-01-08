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
  placeholder,
  onChangeText,
  onBlur,
}) => {
  const hasError = errors[camelName]
  const isTouched = touched[camelName]

  const showError = hasError && isTouched

  return (
    <Box minH={100} flex={1}>
      <FormControl flex={1} isInvalid={showError}>
        <FormControl.Label>
          <Text color={showError ? 'red.700' : 'black'} fontSize='16'>
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
          _invalid={{ borderColor: 'red.700' }}
        />
        <Box mt={2} h={25}>
          {showError && (
            <RenderErrorMessage errors={errors} inputName={camelName} />
          )}
        </Box>
      </FormControl>
    </Box>
  )
}
export default FormInputComponent
