import { useEffect, useState } from 'react'
import DropDownPicker from 'react-native-dropdown-picker'

export default function SpeciesDropDown({
  open,
  setOpen,
  list,
  setList,
  setFieldValue,
  setFieldTouched,
}: {
  open: boolean
  setOpen: any
  list: any[]
  setList: any
  setFieldValue: any
  setFieldTouched: any
}) {
  const [value, setValue] = useState('' as string)

  useEffect(() => {
    setFieldValue('species', value)
    if (value.length > 0) setFieldTouched('species', true)
  }, [value])

  return (
    <DropDownPicker
      open={open}
      value={value}
      items={list}
      setOpen={setOpen}
      setValue={setValue}
      searchable={true}
      setItems={setList}
      multiple={false}
      placeholder='Select your species'
      searchPlaceholder='Search...'
      maxHeight={250}
      closeAfterSelecting={true}
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
