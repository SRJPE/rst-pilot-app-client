import { useEffect, useState } from 'react'
import { View } from 'native-base'
import DropDownPicker from 'react-native-dropdown-picker'
import { TabStateI } from '../../redux/reducers/formSlices/tabSlice'

export default function TrapNameDropDown({
  open,
  onOpen,
  setOpen,
  list,
  setList,
  setFieldValue,
  setFieldTouched,
  visitSetupState,
  tabSlice,
}: {
  open: boolean
  onOpen: any
  setOpen: any
  list: any
  setList: any
  setFieldValue: any
  setFieldTouched: any
  visitSetupState: any
  tabSlice: TabStateI
}) {
  const [value, setValue] = useState([] as Array<any>)
  const [marginBottom, setMarginBottom] = useState(0 as number)

  useEffect(() => {
    if (
      tabSlice?.activeTabId &&
      visitSetupState[tabSlice.activeTabId]?.values?.trapName
    ) {
      const trapNameOrNames =
        visitSetupState[tabSlice.activeTabId]?.values?.trapName
      if (Array.isArray(trapNameOrNames)) {
        setValue([...trapNameOrNames])
      } else {
        setValue([trapNameOrNames])
      }
    }
  }, [tabSlice.activeTabId])

  useEffect(() => {
    setFieldValue('trapName', [...value])
    setFieldTouched('trapName', true)
  }, [value])

  const generateMarginBottom = () => {
    if (list.length === 2) {
      return 70
    } else if (list.length === 3) {
      return 100
    } else if (list.length === 4) {
      return 150
    } else if (list.length > 4) {
      return 200
    } else {
      return 50
    }
  }
  useEffect(() => {
    setMarginBottom(generateMarginBottom())
  }, [list])

  return (
    <DropDownPicker
      open={open}
      onOpen={onOpen}
      value={value}
      items={list}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setList}
      multiple={true}
      mode='BADGE'
      listMode='SCROLLVIEW'
      badgeDotColors={['#007C7C']}
      placeholder='Select trap names'
      searchPlaceholder='Search...'
      maxHeight={275}
      zIndex={2000}
      style={{
        marginTop: 4,
        borderColor: '#d4d4d4d4',
        borderRadius: 4,
        height: 50,
        backgroundColor: '#fff',
        marginBottom: open ? marginBottom : 0,
      }}
      arrowIconStyle={{
        width: 30,
        height: 30,
      }}
      dropDownContainerStyle={{
        backgroundColor: '#fff',
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
