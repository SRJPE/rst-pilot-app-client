import { FontAwesome } from '@expo/vector-icons'
import { on } from 'events'
import { Icon, IconButton } from 'native-base'
import React from 'react'

type Props = {
  isLocked: boolean
  onPress: () => void
}

const ToggleLockButton = ({ isLocked, onPress }: Props) => {
  return (
    <IconButton
      onPress={onPress}
      icon={<Icon as={FontAwesome} name={isLocked ? 'lock' : 'unlock'} />}
      borderRadius='full'
      _icon={{
        size: 5,
      }}
      _pressed={{
        bg: '#FFF',
      }}
    />
  )
}

export default ToggleLockButton
