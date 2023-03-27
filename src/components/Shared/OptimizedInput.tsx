import React, { useCallback, memo, useState, ChangeEvent } from 'react'
import { Input } from 'native-base'
import {
  KeyboardTypeOptions,
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from 'react-native'

interface OptimizedInputI {
  height?: string
  fontSize?: string
  placeholder?: string
  keyboardType?: KeyboardTypeOptions | undefined
  onChangeText: (e: string | ChangeEvent<any>) => void
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void
  value: any
}

const OptimizedInput: React.FC<OptimizedInputI> = (props) => {
  // const [value, setValue] = useState(props.value)
  // const [t, setT] = useState(undefined)
  // const debouncedOnChange = useCallback(
  //   (e: any) => {
  //     e.persist()
  //     setValue(e.nativeEvent.text)
  //     if (t) clearTimeout(t)
  //     setT(
  //       // @ts-ignore
  //       setTimeout(() => props.onChangeText(e.nativeEvent.text), 500)
  //     )
  //   },
  //   [props.value]
  // )

  return (
    <Input
      height={props.height}
      fontSize={props.fontSize}
      placeholder={props.placeholder}
      keyboardType={props.keyboardType}
      onChange={(e) => props.onChangeText(e.nativeEvent.text)}
      onBlur={props.onBlur}
      value={props.value}
    />
  )
}
export default memo(OptimizedInput)
