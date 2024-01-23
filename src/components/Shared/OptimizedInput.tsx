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
  setFieldValue: (field: string, value: any) => void
  fieldName: string
}

const OptimizedInput: React.FC<OptimizedInputI> = (props) => {
  const [value, setValue] = useState(props.value)

  const onChangeTest = (e: any) => {
    setValue(e.nativeEvent.text)
  }

  const testBlur = (e: any) => {
    props.setFieldValue(props.fieldName, value)
    props.onBlur(e)
  }

  return (
    <Input
      isDisabled={props.isDisabled}
      height={props.height}
      fontSize={props.fontSize}
      placeholder={props.placeholder}
      keyboardType={props.keyboardType}
      onChange={onChangeTest}
      onBlur={testBlur}
      value={value}
    />
  )
}
export default memo(OptimizedInput)
