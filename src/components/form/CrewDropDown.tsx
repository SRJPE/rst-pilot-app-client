import { useState } from 'react'
import { View, Avatar, HStack } from 'native-base'
import DropDownPicker from 'react-native-dropdown-picker'
import CrewListItem from './CrewListItem'

const CrewAvatar = () => {
  return <Avatar bg='primary' mr='1' alignSelf='center' size='sm'></Avatar>
}

export default function CrewDropDown(setCrew: any) {
  const [open, setOpen] = useState(false as boolean)
  const [value, setValue] = useState([] as Array<any>)

  console.log('🚀 ~ CrewDropDown ~ value', value)

  const [items, setItems] = useState([
    {
      label: 'Ben Pintel',
      value: 'Ben Pintel',
      icon: CrewAvatar,
    },
    {
      label: 'Jordan Hoang',
      value: 'Jordan Hoang',
      icon: CrewAvatar,
    },
    {
      label: 'Willie Whitfield',
      value: 'Willie Whitfield',
      icon: CrewAvatar,
    },
    {
      label: 'Sadie Gill',
      value: 'Sadie Gill',
      icon: CrewAvatar,
    },
    {
      label: 'Jimi Hendrix',
      value: 'Jimi Hendrix',
      icon: CrewAvatar,
    },
    {
      label: 'Eddie VanHalen',
      value: 'Eddie VanHalen',
      icon: CrewAvatar,
    },
    {
      label: 'Jimmy Page',
      value: 'Jimmy Page',
      icon: CrewAvatar,
    },
    {
      label: 'David Gilmour',
      value: 'David Gilmour',
      icon: CrewAvatar,
    },
  ] as Array<any>)

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
        searchable={true}
        mode='BADGE'
        badgeDotColors={['#007C7C']}
        placeholder='Select your crew'
        searchPlaceholder='Search...'
        maxHeight={400}

        // renderListItem={props => <CrewListItem {...props} />}
      />
    </View>
  )
}
