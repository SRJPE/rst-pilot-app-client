import React from 'react'
import { Button, Icon, IButtonProps, Text } from 'native-base'
import Ionicons from '@expo/vector-icons/Ionicons'

interface Props extends IButtonProps {
  active: boolean
  isDisabled?: boolean
  icon: string
  title: string
  completed?: boolean
  listItem?: boolean
}

export default function MenuButton({
  active,
  isDisabled,
  icon,
  title,
  completed,
  listItem,
  ...props
}: Props) {
  return (
    <Button
      size='lg'
      _light={{
        bg: active ? 'primary' : 'white',
        _pressed: {
          bg: 'primary',
        },
        _text: {
          color: active ? 'white' : 'primary',
        },
      }}
      bg={active ? undefined : 'transparent'}
      variant='solid'
      justifyContent='flex-start'
      leftIcon={
        <Icon
          as={Ionicons}
          name={icon}
          size={listItem ? 'sm' : 'lg'}
          opacity={0.75}
          color={active ? 'white' : 'primary'}
          mr='1'
        />
      }
      rightIcon={
        completed ? (
          <Icon
            as={Ionicons}
            name={title === 'Trap Visit Form' ? 'caret-down' : 'checkmark'}
            size='lg'
            opacity={0.75}
            color={active ? 'white' : 'primary'}
            ml={title === 'Trap Visit Form' ? '12' : '0'}
          />
        ) : (
          <></>
        )
      }
      {...props}
      isDisabled={
        title === 'Visit Setup' || title === 'Incomplete Sections'
          ? false
          : isDisabled
      }
    >
      <Text fontSize='18' fontWeight='500' color={active ? 'white' : 'primary'}>
        {title}
      </Text>
    </Button>
  )
}
