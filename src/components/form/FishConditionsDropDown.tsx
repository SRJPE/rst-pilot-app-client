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
}: {
  open: boolean
  onOpen?: any
  setOpen: any
  list: any
  setList: any
  setFieldValue?: any
  setFieldTouched?: any
  onChangeValue?: any
}) {
  const [value, setValue] = useState([] as string[])

  useEffect(() => {
    if (setFieldTouched && setFieldValue) {
      if (value[0] !== '') {
        setFieldTouched('fishConditions', true)
      }
      setFieldValue('fishConditions', value)
    } else {
      onChangeValue(value)
    }
  }, [value])

  return (
    <DropDownPicker
      open={open}
      onOpen={onOpen}
      value={value}
      items={list}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setList}
      searchable={true}
      multiple={true}
      min={0}
      max={3}
      mode='BADGE'
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
