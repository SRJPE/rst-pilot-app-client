import { useEffect, useState } from 'react'
import { View } from 'native-base'
import DropDownPicker from 'react-native-dropdown-picker'

export default function CrewDropDown({
  list,
  setList,
  setFieldValue,
  setFieldTouched,
  visitSetupState,
  tabId,
}: {
  list: any
  setList: any
  setFieldValue: any
  setFieldTouched: any
  visitSetupState: any
  tabId: any
}) {
  const [open, setOpen] = useState(false as boolean)
  const [value, setValue] = useState([] as Array<any>)

  useEffect(() => {
    if (visitSetupState[tabId]?.values?.crew) {
      setValue(visitSetupState[tabId]?.values?.crew)
    }
  }, [tabId])

  useEffect(() => {
    setFieldValue('crew', [...value])
    setFieldTouched('crew', true)
  }, [value])

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
