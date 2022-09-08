import DropDownPicker from 'react-native-dropdown-picker'
import { useState } from 'react'
import { View, Image } from 'react-native'
import { Avatar, HStack } from 'native-base'
import CrewListItem from './CrewListItem'

const CrewAvatar = () => {
  return (
    <Avatar
      bg='primary'
      mr='1'
      alignSelf='center'
      size='sm'
      source={{
        uri: 'https://bit.ly/broken-link/?',
      }}
    ></Avatar>
  )
}

export default function CrewDropDown() {
  const [open, setOpen] = useState(false)

  const [value, setValue] = useState([])
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
  ])

  return (
    <View
      style={{
        backgroundColor: '#171717',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // paddingHorizontal: 1,
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
