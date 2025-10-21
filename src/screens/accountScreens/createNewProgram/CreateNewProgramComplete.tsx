import React from 'react'
import { Box, Center, HStack, Heading, Text, VStack } from 'native-base'
import AppLogo from '../../../components/Shared/AppLogo'
import CreateNewProgramNavButtons from '../../../components/createNewProgram/CreateNewProgramNavButtons'
import { useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '../../../redux/store'
import { resetCreateNewProgramHomeSlice } from '../../../redux/reducers/createNewProgramSlices/createNewProgramHomeSlice'
import { resetEfficiencyTrialProtocolsSlice } from '../../../redux/reducers/createNewProgramSlices/efficiencyTrialProtocolsSlice'
import { resetTrappingProtocolsSlice } from '../../../redux/reducers/createNewProgramSlices/trappingProtocolsSlice'
import { resetPermitInformationSlice } from '../../../redux/reducers/createNewProgramSlices/permitInformationSlice'
import { resetCrewMembersSlice } from '../../../redux/reducers/createNewProgramSlices/crewMembersSlice'
import { resetTrappingSitesSlice } from '../../../redux/reducers/createNewProgramSlices/trappingSitesSlice'
import { connect } from 'react-redux'
import { CreateNewProgramInitialStateI } from '../../../redux/reducers/createNewProgramSlices/createNewProgramHomeSlice'

const CreateNewProgramComplete = ({
  navigation,
  createNewProgramHomeStore,
}: {
  navigation: any
  createNewProgramHomeStore: CreateNewProgramInitialStateI
}) => {
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
        <VStack py='5%' px='10%' space={10}>
          <Heading alignSelf='center'>Program Created!</Heading>
          <Text fontSize='2xl' color='grey' textAlign={'center'}>
            {`Welcome to ${createNewProgramHomeStore.values.monitoringProgramName}! You are now all set to start trapping.`}
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

const mapStateToProps = (state: RootState) => {
  return {
    createNewProgramHomeStore: state.createNewProgramHome,
  }
}

export default connect(mapStateToProps)(CreateNewProgramComplete)
