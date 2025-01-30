import React, { ChangeEvent, memo } from 'react'
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
  RightElement?: JSX.Element
  isDisabled?: boolean
  multiline?: boolean
}

export const TextInputAdornment = ({ text }: { text: string }) => {
  return (
    <Text px={5} color='warmGray.400'>
      {text}
    </Text>
  )
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
  RightElement = undefined,
  isDisabled = false,
  multiline = false,
}) => {
  const hasError = errors[camelName]
  const isTouched = touched[camelName]

  const showError = hasError && isTouched

  return (
    <Box minH={100} flex={1}>
      <FormControl flex={1} isInvalid={showError} isDisabled={isDisabled}>
        <FormControl.Label>
          <Text
            color={showError ? 'red.700' : isDisabled ? 'gray.400' : 'black'}
            fontSize='16'
          >
            {label}
          </Text>
        </FormControl.Label>
        <Input
          multiline={multiline}
          readOnly={isDisabled}
          height={multiline ? 100 : 50}
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
          rightElement={RightElement}
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
export default memo(FormInputComponent)
