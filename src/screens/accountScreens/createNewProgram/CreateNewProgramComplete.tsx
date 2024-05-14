import React from 'react'
import { Box, Center, HStack, Heading, Text, VStack } from 'native-base'
import AppLogo from '../../../components/Shared/AppLogo'
import CreateNewProgramNavButtons from '../../../components/createNewProgram/CreateNewProgramNavButtons'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../../redux/store'
import { resetCreateNewProgramHomeSlice } from '../../../redux/reducers/createNewProgramSlices/createNewProgramHomeSlice'
import { resetEfficiencyTrialProtocolsSlice } from '../../../redux/reducers/createNewProgramSlices/efficiencyTrialProtocolsSlice'
import { resetTrappingProtocolsSlice } from '../../../redux/reducers/createNewProgramSlices/trappingProtocolsSlice'
import { resetPermitInformationSlice } from '../../../redux/reducers/createNewProgramSlices/permitInformationSlice'
import { resetCrewMembersSlice } from '../../../redux/reducers/createNewProgramSlices/crewMembersSlice'
import { resetTrappingSitesSlice } from '../../../redux/reducers/createNewProgramSlices/trappingSitesSlice'

const CreateNewProgramComplete = ({ navigation }: { navigation: any }) => {
  const dispatch = useDispatch<AppDispatch>()
  const createdProgramName = useSelector(
    (state: RootState) =>
      state.createNewProgramHome.values.monitoringProgramName
  )
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

          <VStack space={2} alignItems='center'>
            <Text fontSize='2xl' color='grey'>
              {`Welcome to ${createdProgramName}!`}
            </Text>
            <Text fontSize='2xl' color='grey'>
              {`You are now all set to start trapping.`}
            </Text>
          </VStack>
          {/* <Text fontSize='2xl' color='grey'>
            {`Welcome to ${createdProgramName}!`}
          </Text>
          <Text fontSize='2xl' color='grey'>
            {`You are now all set to start trapping.`}
          </Text> */}
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
