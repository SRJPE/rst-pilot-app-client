import { useEffect, useState } from 'react'
import { View } from 'native-base'
import DropDownPicker from 'react-native-dropdown-picker'
import { set } from 'lodash'

export default function CrewDropDown({
  open,
  onOpen,
  setOpen,
  list,
  setList,
  setFieldValue,
  setFieldTouched,
  visitSetupState,
  stream,
  tabId,
  values,
}: {
  open: boolean
  onOpen: any
  setOpen: any
  list: any
  setList: any
  setFieldValue: any
  setFieldTouched: any
  visitSetupState: any
  stream: string
  tabId: any
  values: any
}) {
  const [value, setValue] = useState([] as Array<any>)
  const [selectedStream, setSelectedStream] = useState('' as string)

  useEffect(() => {
    if (visitSetupState[tabId]?.values?.crew) {
      setValue(visitSetupState[tabId]?.values?.crew)
    }
    if (visitSetupState[tabId]?.values?.stream) {
      setSelectedStream(visitSetupState[tabId]?.values?.stream)
    }
  }, [tabId])

  useEffect(() => {
    setFieldValue('crew', [...value])
    if (value.length) setFieldTouched('crew', true)
  }, [value])

  useEffect(() => {
    if (selectedStream && stream !== selectedStream) {
      clearSelectedValues()
      setSelectedStream(stream)
    }
  }, [stream])

  const clearSelectedValues = () => {
    setValue([])
    setFieldValue('crew', [])
    setFieldTouched('crew', false)
  }

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
      placeholder='Select your crew'
      searchPlaceholder='Search...'
      maxHeight={275}
      style={{
        marginTop: 4,
        borderColor: '#d4d4d4d4',
        borderRadius: 4,
        height: 50,
        backgroundColor: '#fff',
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
      // renderListItem={props => <CrewListItem {...props} />}
    />
  )
}
