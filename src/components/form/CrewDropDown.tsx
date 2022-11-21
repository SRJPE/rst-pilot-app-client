import { useEffect, useState } from 'react'
import { View } from 'native-base'
import DropDownPicker from 'react-native-dropdown-picker'
import CrewListItem from './CrewListItem'

export default function CrewDropDown({
  crewList,
  setFieldValue,
  setFieldTouched,
}: {
  crewList: any
  setFieldValue: any
  setFieldTouched: any
}) {
  const [open, setOpen] = useState(false as boolean)
  const [value, setValue] = useState([] as Array<any>)

  useEffect(() => {
    setFieldValue('crew', [...value])
    setFieldTouched('crew', true)
  }, [value])

  const [items, setItems] = useState([...crewList])

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
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
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
