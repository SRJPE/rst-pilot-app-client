import { useEffect, useState } from 'react'
import { View } from 'native-base'
import DropDownPicker from 'react-native-dropdown-picker'
import { set } from 'lodash'

export default function CrewDropDown({
  open,
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
    <View
      style={{
        backgroundColor: '#171717',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
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
        placeholder='Select your crew'
        searchPlaceholder='Search...'
        maxHeight={275}
        // renderListItem={props => <CrewListItem {...props} />}
      />
    </View>
  )
}
