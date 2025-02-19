import { useCallback, useEffect, useState } from 'react'
import DropDownPicker from 'react-native-dropdown-picker'

export default function SpeciesDropDown({
  open,
  onOpen,
  setOpen,
  list,
  setList,
  setFieldValue,
  setFieldTouched,
  onChangeValue,
  editModeValue,
  speciesValue,
}: {
  open: boolean
  onOpen?: any
  setOpen: any
  list: any[]
  setList: any
  setFieldValue?: any
  setFieldTouched?: any
  onChangeValue?: any
  editModeValue?: string
  speciesValue?: string
}) {
  const [value, setValue] = useState(editModeValue || ('' as string))

  const handleOnChange = useCallback(
    (itemValue: any) => {
      if (onChangeValue) {
        onChangeValue(itemValue)
      }
    },
    [speciesValue, value]
  )

  useEffect(() => {
    //if using formik
    if (setFieldTouched && setFieldValue) {
      if (value !== '') {
        setFieldTouched('species', true)
      }
      setFieldValue('species', value)
    } else {
      if (value) {
        setFieldTouched()
      }
      if (onChangeValue) {
        onChangeValue(value)
      }
    }
  }, [value])

  return (
    <DropDownPicker
      open={open}
      onOpen={onOpen}
      value={value}
      items={list}
      setOpen={setOpen}
      onClose={() => (setFieldTouched ? setFieldTouched() : null)}
      onChangeValue={handleOnChange}
      setValue={setValue}
      searchable={true}
      setItems={setList}
      multiple={false}
      placeholder='Select your species'
      searchPlaceholder='Search...'
      listMode='SCROLLVIEW'
      maxHeight={180}
      scrollViewProps={{ keyboardShouldPersistTaps: 'always' }}
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
