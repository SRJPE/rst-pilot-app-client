import React from 'react'
import { Box, Center, Heading, Text, VStack } from 'native-base'
import AppLogo from '../../../components/Shared/AppLogo'
import CreateNewProgramNavButtons from '../../../components/createNewProgram/CreateNewProgramNavButtons'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../../redux/store'
import { resetCreateNewProgramHomeSlice } from '../../../redux/reducers/createNewProgramSlices/createNewProgramHomeSlice'
import { resetEfficiencyTrialProtocolsSlice } from '../../../redux/reducers/createNewProgramSlices/efficiencyTrialProtocolsSlice'
import { resetTrappingProtocolsSlice } from '../../../redux/reducers/createNewProgramSlices/trappingProtocolsSlice'
import { resetPermitInformationSlice } from '../../../redux/reducers/createNewProgramSlices/permitInformationSlice'
import { resetCrewMembersSlice } from '../../../redux/reducers/createNewProgramSlices/crewMembersSlice'
import { resetTrappingSitesSlice } from '../../../redux/reducers/createNewProgramSlices/trappingSitesSlice'

const CreateNewProgramComplete = ({ navigation }: { navigation: any }) => {
  const dispatch = useDispatch<AppDispatch>()

  const clearFormValues = () => {
    dispatch(resetCreateNewProgramHomeSlice())
    dispatch(resetTrappingSitesSlice())
    dispatch(resetCrewMembersSlice())
    dispatch(resetEfficiencyTrialProtocolsSlice())
    dispatch(resetTrappingProtocolsSlice())
    dispatch(resetPermitInformationSlice())
  }

  return (
    <>
      <Box overflow='hidden' flex={1} bg='#fff'>
        <Center bg='primary' py='5%'>
          <AppLogo imageSize={200} />
        </Center>
        <VStack py='5%' px='15%' space={10}>
          <Heading alignSelf='center'>Program Created!</Heading>
          <Text fontSize='2xl' color='grey'>
            {`Welcome to ${'{Program Name}'}! You are now all set to \nstart trapping.`}
          </Text>
        </VStack>
      </Box>
      <CreateNewProgramNavButtons
        navigation={navigation}
        clearFormValues={clearFormValues}
      />
    </>
  )
}

export default CreateNewProgramComplete
