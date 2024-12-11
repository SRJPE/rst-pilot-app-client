import { Button, HStack, Text } from 'native-base'
import React from 'react'
import { CrewMemberEntryMode } from './AddCrewMemberModalContent'

type Props = {
  crewMemberEntryMode: CrewMemberEntryMode
  changeCrewMemberEntryMode: (mode: CrewMemberEntryMode) => void
}

const CrewMemberEntryModeToggle = ({
  changeCrewMemberEntryMode,
  crewMemberEntryMode,
}: Props) => {
  return (
    <HStack justifyContent={'center'}>
      <Button
        borderWidth={1}
        borderColor={'primary'}
        borderRightRadius={'none'}
        px='10'
        bg={crewMemberEntryMode === 'search' ? 'primary' : 'transparent'}
        onPress={() => changeCrewMemberEntryMode('search')}
      >
        <Text color={crewMemberEntryMode === 'search' ? 'white' : 'primary'}>
          Search
        </Text>
      </Button>
      <Button
        borderWidth={1}
        borderColor={'primary'}
        borderLeftRadius={'none'}
        px='10'
        bg={crewMemberEntryMode === 'manual' ? 'primary' : 'transparent'}
        onPress={() => changeCrewMemberEntryMode('manual')}
      >
        <Text color={crewMemberEntryMode === 'manual' ? 'white' : 'primary'}>
          Manual
        </Text>
      </Button>
    </HStack>
  )
}

export default CrewMemberEntryModeToggle
