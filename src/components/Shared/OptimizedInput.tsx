import React, { useCallback, memo, useState, ChangeEvent } from 'react'
import { Input } from 'native-base'
import {
  KeyboardTypeOptions,
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from 'react-native'

interface OptimizedInputI {
  isDisabled?: boolean
  height?: string
  fontSize?: string
  placeholder?: string
  keyboardType?: KeyboardTypeOptions | undefined
  onChangeText: (e: string | ChangeEvent<any>) => void
  onBlur: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void
  value: any
  setFieldValue?: (field: string, value: any, shouldValidate?: boolean) => void
  fieldName?: string
  fieldTouched?: any
  setFieldTouched?: (
    field: string,
    isTouched?: boolean,
    shouldValidate?: boolean
  ) => void
}

const OptimizedInput: React.FC<OptimizedInputI> = (props) => {
  // const [value, setValue] = useState(props.value)

  // const onChangeHandler = (e: any) => {
  //   if (!props.fieldTouched) {
  //     props.setFieldTouched(props.fieldName, true)
  //   }
  //   setValue(e.nativeEvent.text)
  // }

  // const onBlurHandler = (e: any) => {
  //   props.setFieldValue(props.fieldName, value)
  //   props.onBlur(e)
  // }

  // const onTouchedHandler = () => {
  //   if (!props.fieldTouched) {
  //     props.setFieldTouched(props.fieldName, true, false)
  //   }
  // }

  return (
    <Input
      isDisabled={props.isDisabled}
      height={props.height}
      fontSize={props.fontSize}
      placeholder={props.placeholder}
      keyboardType={props.keyboardType}
      // onChange={onChangeHandler}
      // onBlur={onBlurHandler}
      // value={value}
      // onFocus={onTouchedHandler}
      onChange={(e) => props.onChangeText(e.nativeEvent.text)}
      onBlur={props.onBlur}
      value={props.value}
    />
  )
}
export default memo(OptimizedInput)
