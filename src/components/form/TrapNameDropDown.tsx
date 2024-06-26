import { useEffect, useState } from 'react'
import { View } from 'native-base'
import DropDownPicker from 'react-native-dropdown-picker'
import { TabStateI } from '../../redux/reducers/formSlices/tabSlice'

export default function TrapNameDropDown({
  list,
  setList,
  setFieldValue,
  setFieldTouched,
  visitSetupState,
  tabSlice,
}: {
  list: any
  setList: any
  setFieldValue: any
  setFieldTouched: any
  visitSetupState: any
  tabSlice: TabStateI
}) {
  const [open, setOpen] = useState(false as boolean)
  const [value, setValue] = useState([] as Array<any>)

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

  return (
    <View
      style={{
        backgroundColor: '#171717',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: open ? generateMarginBottom() : 0,
      }}
    >
      <DropDownPicker
        open={open}
        value={value}
        items={list}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setList}
        multiple={true}
        mode='BADGE'
        badgeDotColors={['#007C7C']}
        placeholder='Select trap names'
        searchPlaceholder='Search...'
        maxHeight={275}
      />
    </View>
  )
}
