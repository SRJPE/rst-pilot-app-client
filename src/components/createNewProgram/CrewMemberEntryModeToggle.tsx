import { Button, HStack, Text } from 'native-base'
import React from 'react'
import { CrewMemberEntryMode } from './AddCrewMemberModalContent'
import { FormikState } from 'formik'
import { IndividualCrewMemberValuesI } from '../../redux/reducers/createNewProgramSlices/crewMembersSlice'

type Props = {
  crewMemberEntryMode: CrewMemberEntryMode
  changeCrewMemberEntryMode: (mode: CrewMemberEntryMode) => void
  resetSearch: () => void
  resetForm: (
    nextState?: Partial<FormikState<IndividualCrewMemberValuesI>> | undefined
  ) => void
}

const CrewMemberEntryModeToggle = ({
  changeCrewMemberEntryMode,
  crewMemberEntryMode,
  resetForm,
  resetSearch,
}: Props) => {
  return (
    <HStack justifyContent={'center'}>
      <Button
        borderWidth={1}
        borderColor={'primary'}
        borderRightRadius={'none'}
        px='10'
        bg={crewMemberEntryMode === 'search' ? 'primary' : 'transparent'}
        onPress={() => {
          changeCrewMemberEntryMode('search')
          resetForm()
        }}
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
        onPress={() => {
          changeCrewMemberEntryMode('manual')
          resetSearch()
        }}
      >
        <Text color={crewMemberEntryMode === 'manual' ? 'white' : 'primary'}>
          Manual
        </Text>
      </Button>
    </HStack>
  )
}

export default CrewMemberEntryModeToggle
