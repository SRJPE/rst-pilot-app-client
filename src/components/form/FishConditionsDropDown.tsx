import { useEffect, useState } from 'react'
import DropDownPicker from 'react-native-dropdown-picker'

export default function FishConditionsDropDown({
  open,
  onOpen,
  setOpen,
  list,
  setList,
  setFieldValue,
  setFieldTouched,
  onChangeValue,
  editModeValue,
  fishConditionsValues,
}: {
  open: boolean
  onOpen?: any
  setOpen: any
  list: any
  setList: any
  setFieldValue?: any
  setFieldTouched?: any
  onChangeValue?: any
  editModeValue?: string[]
  fishConditionsValues?: string[]
}) {
  const [values, setValues] = useState((editModeValue || []) as string[])

  useEffect(() => {
    //if using formik
    if (setFieldTouched && setFieldValue) {
      if (values.length > 0) {
        setFieldTouched('fishConditions', true)
      }
      setFieldValue('fishConditions', values)
    } else {
      if (values.length > 0) {
        setFieldTouched()
      }
      onChangeValue(values)
    }
  }, [values])

  useEffect(() => {
    //if fishConditionsValue from parent is empty (form was reset)
    if (fishConditionsValues && !fishConditionsValues[0]) {
      //if local state value is not empty,reset values
      if (values.length > 0) {
        setValues([])
      }
    }
  }, [fishConditionsValues])

  return (
    <DropDownPicker
      open={open}
      onOpen={onOpen}
      value={values}
      items={list}
      setOpen={setOpen}
      setValue={setValues}
      setItems={setList}
      searchable={true}
      multiple={true}
      min={0}
      max={3}
      mode='BADGE'
      listMode='SCROLLVIEW'
      badgeDotColors={['#007C7C']}
      placeholder='Select up to three fish conditions'
      searchPlaceholder='Search...'
      maxHeight={175}
      style={{
        marginTop: 4,
        borderColor: '#d4d4d4d4',
        borderRadius: 4,
        height: 50,
        backgroundColor: '#fafafa',
      }}
      arrowIconStyle={{
        width: 30,
        height: 30,
      }}
      dropDownContainerStyle={{
        backgroundColor: '#fafafa',
        borderColor: '#d4d4d4d4',
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
      }}
      textStyle={{
        fontSize: 16,
      }}
    />
  )
}
