import React from 'react'
import { Button, Icon, IButtonProps } from 'native-base'
import Ionicons from '@expo/vector-icons/Ionicons'

interface Props extends IButtonProps {
  active: boolean
  icon: string
  children: React.ReactNode
}

export default function MenuButton({
  active,
  icon,
  children,
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
      _dark={{
        colorScheme: 'primary',
        _pressed: {
          bg: '#FFFFFF',
        },
        _text: {
          color: active ? 'primary' : undefined,
        },
      }}
      bg={active ? undefined : 'transparent'}
      variant='solid'
      justifyContent='flex-start'
      leftIcon={<Icon as={Ionicons} name={icon} size='sm' opacity={0.75} />}
      {...props}
    >
      {children}
    </Button>
  )
}
