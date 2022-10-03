import { View, Text } from 'react-native'
import React from 'react'
import { Avatar, HStack } from 'native-base'
import { getInitials } from '../../utils'

export default function CrewListItem(props: any) {
  return (
    <View>
      <HStack justifyContent='space-between'>
        <Text>{props.label}</Text>
        {props && (
          <Avatar
            bg='green.500'
            mr='1'
            alignSelf='center'
            size='sm'
            source={{
              uri: 'https://bit.ly/broken-link',
            }}
          >
            {getInitials(props.title || 'test initials')}
          </Avatar>
        )}
      </HStack>
    </View>
  )
}
