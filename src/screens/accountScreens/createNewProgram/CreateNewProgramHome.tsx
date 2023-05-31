import React from 'react'
import { Text, Heading, View, VStack, HStack, Button } from 'native-base'
import CreateNewProgramButton from '../../../components/createNewProgram/CreateNewProgramButton'
import CreateNewProgramNavButtons from '../../../components/createNewProgram/CreateNewProgramNavButtons'
import { connect } from 'react-redux'
import { RootState } from '../../../redux/store'
import { startCase } from 'lodash'
import { PermitInformationInitialStateI } from '../../../redux/reducers/createNewProgramSlices/permitInformationSlice'
import { TrappingProtocolsInitialStateI } from '../../../redux/reducers/createNewProgramSlices/trappingProtocolsSlice'
import { EfficiencyTrialProtocolsInitialStateI } from '../../../redux/reducers/createNewProgramSlices/efficiencyTrialProtocolsSlice'
import { CrewMembersInitialStateI } from '../../../redux/reducers/createNewProgramSlices/crewMembersSlice'
import { TrappingSitesInitialStateI } from '../../../redux/reducers/createNewProgramSlices/trappingSitesSlice'
import { CreateNewProgramInitialStateI } from '../../../redux/reducers/createNewProgramSlices/createNewProgramHomeSlice'

const CreateNewProgramHome = ({
  createNewProgramHomeStore,
  trappingSitesStore,
  crewMembersStore,
  efficiencyTrialProtocolsStore,
  trappingProtocolsStore,
  permitInformationStore,
  navigation,
}: {
  createNewProgramHomeStore: CreateNewProgramInitialStateI
  trappingSitesStore: TrappingSitesInitialStateI
  crewMembersStore: CrewMembersInitialStateI
  efficiencyTrialProtocolsStore: EfficiencyTrialProtocolsInitialStateI
  trappingProtocolsStore: TrappingProtocolsInitialStateI
  permitInformationStore: PermitInformationInitialStateI
  navigation: any
}) => {
  const { monitoringProgramName, streamName, fundingAgency } =
    createNewProgramHomeStore.values

  return (
    <>
      <View flex={1} bg='#fff'>
        <VStack space={10} px='15%' py='5%'>
          <VStack space={4}>
            <HStack space={5}>
              <Heading mb='4'>Create New Program</Heading>
            </HStack>
            <VStack
              space={2}
              w='80%'
              padding='2'
              bg='secondary'
              borderWidth={2}
              borderRadius='5'
              borderColor='primary'
            >
              <Text fontSize='lg' fontWeight='500'>
                {`Program Name: ${monitoringProgramName}`}
              </Text>
              <Text
                fontSize='lg'
                fontWeight='500'
              >{`Stream Name: ${streamName}`}</Text>
              <Text
                fontSize='lg'
                fontWeight='500'
              >{`Funding Agency: ${fundingAgency}`}</Text>
            </VStack>
            <Text fontSize='lg' color='grey' mb='-4'>
              {
                'Please fill in some important program information before you can \nbegin trapping.'
              }
            </Text>
          </VStack>

          {createNewProgramHomeStore.steps.map((step: any, idx: number) => {
            return (
              <CreateNewProgramButton
                name={startCase(step.name)}
                completed={step.completed}
                navigation={navigation}
                key={idx}
                step={idx + 1}
              />
            )
          })}
        </VStack>
      </View>
      <CreateNewProgramNavButtons navigation={navigation} />
    </>
  )
}

const mapStateToProps = (state: RootState) => {
  return {
    createNewProgramHomeStore: state.createNewProgramHome,
    trappingSitesStore: state.trappingSites,
    crewMembersStore: state.crewMembers,
    efficiencyTrialProtocolsStore: state.efficiencyTrialProtocols,
    trappingProtocolsStore: state.trappingProtocols,
    permitInformationStore: state.permitInformation,
  }
}

export default connect(mapStateToProps)(CreateNewProgramHome)
