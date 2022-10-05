import React from 'react'
import { Button, Icon, IButtonProps } from 'native-base'
import Ionicons from '@expo/vector-icons/Ionicons'

interface Props extends IButtonProps {
  active: boolean
  isDisabled?: boolean
  icon: string
  title: string
}

export default function MenuButton({
  active,
  isDisabled,
  icon,
  title,
  ...props
}: Props) {
  return (
    <Button
      size='lg'
      _light={{
        colorScheme: 'primary',
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
      leftIcon={<Icon as={Ionicons} name={icon} size='sm' opacity={0.75} />}
      {...props}
      isDisabled={isDisabled}
    >
      {title}
    </Button>
  )
}
