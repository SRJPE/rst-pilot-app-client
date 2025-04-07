import React, { ChangeEvent, memo, useCallback } from 'react'
import { Box, FormControl, Input, Text } from 'native-base'
import RenderErrorMessage from '../Shared/RenderErrorMessage'
import {
  KeyboardTypeOptions,
  NativeSyntheticEvent,
  TextInputFocusEventData,
  Keyboard,
} from 'react-native'
import { FastField } from 'formik'
import { renderRequiredOrOptionalLabel } from '../../utils/utils'

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
  showWarning?: boolean
  warningMessage?: string
  validationSchema?: any
  inputRefs?: any
  isLast?: boolean
  formFields?: any
  orderIndex?: number
}

export const TextInputAdornment = ({ text }: { text: string }) => {
  return (
    <Text px={5} color='warmGray.400'>
      {text}
    </Text>
  )
}

const FastInput = ({
  field,
  form,
  value,
  keyboardType,
  placeholder,
  onChangeText,
  onBlur,
  RightElement = undefined,
  isDisabled = false,
  multiline = false,
  showWarning = false,
  inputRefs,
  isLast,
  formFields,
  orderIndex,
  camelName,
}: {
  field: any
  form: any
  value: any
  keyboardType: any
  placeholder: any
  onChangeText: any
  onBlur: any
  RightElement: any
  isDisabled: any
  multiline: any
  showWarning: any
  inputRefs: any
  isLast: any
  formFields?: any
  orderIndex?: number
  camelName?: string
}) => {
  const handleSubmitEditing = useCallback(() => {
    if (formFields && !isLast && orderIndex !== undefined) {
      const nextField = formFields.find(
        (field: any) =>
          field.orderIndex === orderIndex + 1 && field.fieldType === 'input'
      )?.fieldName

      if (nextField && inputRefs.current[nextField]) {
        inputRefs.current[nextField]?.focus()
      } else {
        Keyboard.dismiss()
      }
    } else if (
      camelName === 'flowMeasure' &&
      inputRefs.current.waterTemperature
    ) {
      inputRefs.current.waterTemperature?.focus()
    } else if (camelName?.includes('turbidity')) {
      // Focus on the next turbidity input
      const nextTurbidityIndex =
        parseInt(camelName.replace('turbidity', '')) + 1
      const nextTurbidityField = `turbidity${nextTurbidityIndex}`
      const nextTurbidityInput = inputRefs.current[nextTurbidityField]
      if (nextTurbidityInput) {
        nextTurbidityInput.focus()
      } else {
        Keyboard.dismiss()
      }
    } else {
      return
    }
  }, [formFields, isLast, orderIndex, inputRefs, camelName])

  return (
    <Input
      {...field} // Includes value and onChangeText automatically
      multiline={multiline}
      readOnly={isDisabled}
      height={multiline ? 100 : 50}
      fontSize='16'
      keyboardType={keyboardType ? keyboardType : 'default'}
      placeholder={placeholder || 'No placeholder entered'}
      onChangeText={onChangeText} // Update correctly
      onBlur={onBlur}
      value={field.value}
      _focus={{
        borderColor: showWarning ? 'amber.700' : 'muted.300',
        _invalid: { borderColor: 'red.700' },
      }}
      borderColor={showWarning ? 'amber.700' : 'muted.300'}
      _invalid={{ borderColor: 'red.700' }}
      rightElement={RightElement}
      ref={ref => {
        if (inputRefs && camelName) {
          inputRefs.current[camelName] = ref
        } else return
      }}
      returnKeyType={inputRefs ? 'next' : 'default'}
      submitBehavior={isLast ? 'blurAndSubmit' : 'submit'} // 👈 NEW PROP
      onSubmitEditing={handleSubmitEditing}
    />
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
  showWarning = false,
  warningMessage = 'Value is out of range',
  validationSchema,
  inputRefs,
  isLast,
  formFields,
  orderIndex,
}) => {
  const hasError = errors[camelName]
  const isTouched = touched[camelName]

  const showError = hasError && isTouched

  return (
    <Box minH={100} flex={1}>
      <FormControl flex={1} isInvalid={showError} isDisabled={isDisabled}>
        <FormControl.Label>
          <Text
            color={
              showWarning
                ? 'amber.700'
                : showError
                ? 'red.700'
                : isDisabled
                ? 'gray.400'
                : 'black'
            }
            fontSize='16'
          >
            {label}
            {validationSchema
              ? renderRequiredOrOptionalLabel({
                  fieldName: camelName,
                  validationSchema,
                })
              : ''}
          </Text>
        </FormControl.Label>
        <FastField
          name={camelName}
          component={FastInput}
          value={value}
          keyboardType={keyboardType}
          placeholder={placeholder}
          onChangeText={onChangeText}
          onBlur={onBlur}
          RightElement={RightElement}
          isDisabled={isDisabled}
          multiline={multiline}
          showWarning={showWarning}
          inputRefs={inputRefs}
          isLast={isLast}
          formFields={formFields}
          orderIndex={orderIndex}
          camelName={camelName}
        />
        <Box mt={2} h={25}>
          {showError && (
            <RenderErrorMessage errors={errors} inputName={camelName} />
          )}

          {showWarning && (
            <Text fontSize={14} color='amber.700'>
              {warningMessage}
            </Text>
          )}
        </Box>
      </FormControl>
    </Box>
  )
}
export default memo(FormInputComponent)
