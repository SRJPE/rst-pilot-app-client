import React from 'react'
import { Text, Heading, View, VStack, HStack, Button } from 'native-base'
import CreateNewProgramButton from '../../components/createNewProgram/CreateNewProgramButton'
import CreateNewProgramNavButtons from '../../components/createNewProgram/CreateNewProgramNavButtons'
import { connect } from 'react-redux'
import { RootState } from '../../redux/store'
import { startCase } from 'lodash'
import { PermitInformationInitialStateI } from '../../redux/reducers/createNewProgramSlices/permitInformationSlice'
import { TrappingProtocolsInitialStateI } from '../../redux/reducers/createNewProgramSlices/trappingProtocolsSlice'
import { EfficiencyTrialProtocolsInitialStateI } from '../../redux/reducers/createNewProgramSlices/efficiencyTrialProtocolsSlice'
import { CrewMembersInitialStateI } from '../../redux/reducers/createNewProgramSlices/crewMembersSlice'
import { TrappingSitesInitialStateI } from '../../redux/reducers/createNewProgramSlices/trappingSitesSlice'
import { CreateNewProgramInitialStateI } from '../../redux/reducers/createNewProgramSlices/createNewProgramHomeSlice'

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
        <VStack space={10} px='15%' py='10%'>
          <VStack space={2}>
            <HStack space={5}>
              <Heading mb='4'>Create New Program</Heading>
              <Button
                bg='primary'
                height='10'
                rounded='xs'
                borderRadius='5'
                shadow='5'
                onPress={() =>
                  console.log('🚀 ~ CRPStore:', {
                    trappingSitesStore,
                    crewMembersStore,
                    efficiencyTrialProtocolsStore,
                    trappingProtocolsStore,
                    permitInformationStore,
                  })
                }
              >
                <Text fontSize='md' color='white'>
                  DEV LOG
                </Text>
              </Button>
            </HStack>
            <VStack space={2} borderWidth={2} padding='2'>
              <Text fontSize='lg'>
                {`Program Name: ${monitoringProgramName}`}
              </Text>
              <Text fontSize='lg'>{`Stream Name: ${streamName}`}</Text>
              <Text fontSize='lg'>{`Funding Agency: ${fundingAgency}`}</Text>
            </VStack>
            <Text fontSize='lg' color='grey'>
              {
                'Please fill in some important program information \nbefore you can begin trapping.'
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
      <CreateNewProgramNavButtons />
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
