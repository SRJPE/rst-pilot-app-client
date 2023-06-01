import React, { useCallback } from 'react'
import { Text, Heading, View, VStack, HStack, Button } from 'native-base'
import CreateNewProgramButton from '../../../components/createNewProgram/CreateNewProgramButton'
import CreateNewProgramNavButtons from '../../../components/createNewProgram/CreateNewProgramNavButtons'
import { connect } from 'react-redux'
import { RootState } from '../../../redux/store'
import { startCase } from 'lodash'
import { PermitInformationInitialStateI } from '../../../redux/reducers/createNewProgramSlices/permitInformationSlice'
import { TrappingProtocolsInitialStateI } from '../../../redux/reducers/createNewProgramSlices/trappingProtocolsSlice'
import { EfficiencyTrialProtocolsInitialStateI } from '../../../redux/reducers/createNewProgramSlices/efficiencyTrialProtocolsSlice'
import { CreateNewProgramInitialStateI } from '../../../redux/reducers/createNewProgramSlices/createNewProgramHomeSlice'
import { TrappingSitesStoreI } from '../../../redux/reducers/createNewProgramSlices/trappingSitesSlice'
import { CrewMembersStoreI } from '../../../redux/reducers/createNewProgramSlices/crewMembersSlice'
import { TrappingProtocolsStoreI } from '../../../redux/reducers/createNewProgramSlices/trappingProtocolsSlice'

interface ProgramMetaDataSubmissionI {
  programName: string
  streamName: string
  personnelLead: number
  fundingAgency: number
  efficiencyProtocolsDocumentLink: string
  trappingProtocolsDocumentLink: string
  createdAt: Date
  updatedAt: Date
}
interface TrappingSitesSubmissionI {}
interface CrewMembersSubmissionI {}
interface EfficiencyTrialProtocolsSubmissionI {}

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
  trappingSitesStore: TrappingSitesStoreI
  crewMembersStore: CrewMembersStoreI
  efficiencyTrialProtocolsStore: EfficiencyTrialProtocolsInitialStateI
  trappingProtocolsStore: TrappingProtocolsStoreI
  permitInformationStore: PermitInformationInitialStateI
  navigation: any
}) => {
  const { monitoringProgramName, streamName, fundingAgency } =
    createNewProgramHomeStore.values

  const handleSaveProgramMetaData = useCallback(() => {
    const { fundingAgency, monitoringProgramName, streamName } =
      createNewProgramHomeStore.values

    const programMetaDataSubmission: ProgramMetaDataSubmissionI = {
      programName: monitoringProgramName,
      streamName: streamName,
      personnelLead: 0, //to be completed
      fundingAgency: 0, //to be completed
      efficiencyProtocolsDocumentLink: 'VARCHAR(200)', //to be completed
      trappingProtocolsDocumentLink: 'VARCHAR(200)', //to be completed
      createdAt: new Date(), //to be completed
      updatedAt: new Date(), //to be completed
    }
    console.log(
      '🚀 ~ handleSaveProgramMetaData ~ programMetaDataSubmission:',
      programMetaDataSubmission
    )
  }, [createNewProgramHomeStore])

  const handleSaveTrappingSites = useCallback(() => {
    console.log('🚀 ~ trappingSitesStore:', trappingSitesStore)
    console.log(
      '🚀 ~  VALUES - trappingSitesStore:',
      Object.values(trappingSitesStore)
    )

    // ERIN: how do the release sites need to be incorporated to the trapping_sites?

    const trappingSitesSubmission = Object.values(trappingSitesStore).map(
      (trapSiteObj: any) => {
        console.log('🚀 ~ handleSaveTrappingSites ~ trapSiteObj:', trapSiteObj)
        const { trapName, coneSize, trapLatitude, trapLongitude } = trapSiteObj
        return {
          trapName: trapName,
          programId: 'INTEGER REFERENCES program', //to be completed
          dataRecorderId: 'INTEGER REFERENCES personnel', //to be completed
          dataRecorderAgencyId: 'INTEGER REFERENCES agency', //to be completed
          siteName: 'VARCHAR(50)', //to be completed
          coneSizeFt: coneSize,
          xCoord: trapLatitude,
          yCoord: trapLongitude,
          coordinateSystem: 'VARCHAR(100)', //to be completed
          projection: 'VARCHAR(100)', //to be completed
          datum: 'VARCHAR(100)', //to be completed
          gageNumber: 'NUMERIC', //to be completed
          gageAgency: 'INTEGER REFERENCES agency', //to be completed
          comments: 'VARCHAR(500)', //to be completed
          createdAt: new Date(), //to be completed
          updatedAt: new Date(), //to be completed
        }
      }
    )
    console.log(
      '🚀 ~ handleSaveTrappingSites ~ trappingSitesSubmission:',
      trappingSitesSubmission
    )
  }, [trappingSitesStore])

  const handleSaveCrewMembers = useCallback(() => {
    console.log(
      '🚀 ~ handleSaveCrewMembers ~ crewMembersStore:',
      crewMembersStore
    )
    console.log(
      '🚀 ~ VALUES - handleSaveCrewMembers:',
      Object.values(crewMembersStore)
    )

    // ERIN: how do the release sites need to be incorporated to the trapping_sites?

    const crewMembersSubmission = Object.values(crewMembersStore).map(
      (crewMemberObj: any) => {
        console.log(
          '🚀 ~ handleSaveCrewMembers ~ crewMemberObj:',
          crewMemberObj
        )

        const {
          firstName,
          lastName,
          phoneNumber,
          email,
          isLead,
          agency,
          orchidID,
        } = crewMemberObj //orchidID is a typo => CHANGE TO orcidID
        return {
          firstName,
          lastName,
          email,
          phone: phoneNumber,
          agencyId: 'INTEGER REFERENCES agency', //to be completed
          role: 'role_enum', //to be completed
          orcidId: orchidID, //fix typo in REDUX
          createdAt: 'TIMESTAMP DEFAULT NOW()', //to be completed
          updatedAt: 'TIMESTAMP DEFAULT NOW()', //to be completed
        }
      }
    )
    console.log(
      '🚀 ~ handleSaveCrewMembers ~ crewMembersSubmission:',
      crewMembersSubmission
    )
  }, [crewMembersStore])

  const handleSaveEfficiencyTrialProtocols = useCallback(() => {
    console.log(
      '🚀 ~ handleSaveEfficiencyTrialProtocols ~ efficiencyTrialProtocolsStore:',
      efficiencyTrialProtocolsStore
    )
    const {
      hatchery,
      frequencyOfReceivingFish,
      expectedNumberOfFishReceivedAtEachPickup,
    } = efficiencyTrialProtocolsStore.values

    const efficiencyTrialProtocolsSubmission = {
      hatcheryName: hatchery,
      streamName: 'VARCHAR(25)', //to be completed
      agreementId: 'VARCHAR(25)', //to be completed
      programId: 'INTEGER REFERENCES program', //to be completed
      aggrementStartDate: 'DATE', //fix typo in DB //to be completed
      aggrementEndDate: 'DATE', //fix typo in DB //to be completed
      renewalDate: 'DATE', //to be completed
      frequencyOfFishCollection: frequencyOfReceivingFish,
      quantityOfFish: expectedNumberOfFishReceivedAtEachPickup,
      hatcheryFileLink: 'VARCHAR(200)', //to be completed
    }
    console.log(
      '🚀 ~ handleSaveEfficiencyTrialProtocols ~ efficiencyTrialProtocolsSubmission:',
      efficiencyTrialProtocolsSubmission
    )
  }, [efficiencyTrialProtocolsStore])

  const handleSaveTrappingProtocols = useCallback(() => {
    console.log(
      '🚀 ~ handleSaveTrappingProtocols ~ trappingProtocolsStore:',
      trappingProtocolsStore
    )

    const saveTrappingProtocolsSubmission = Object.values(
      trappingProtocolsStore
    ).map((trappingProtocolObj: any) => {
      console.log('🚀 ~ ).map ~ trappingProtocolObj:', trappingProtocolObj)

      const { species, run, lifeStage, numberMeasured } = trappingProtocolObj
      return {
        programId: 'INTEGER REFERENCES program', //to be completed
        species: 'VARCHAR(10) REFERENCES taxon (code)', //to be completed
        lifeStage: 'INTEGER REFERENCES life_stage', //to be completed
        run: 'INTEGER REFERENCES run', //to be completed
        numberMeasured: Number(numberMeasured),
      }
    })
    console.log(
      '🚀 ~ handleSaveTrappingProtocols ~ saveTrappingProtocolsSubmission:',
      saveTrappingProtocolsSubmission
    )
  }, [trappingProtocolsStore])

  const handleSavePermittingInformation = useCallback(() => {
    console.log(
      '🚀 ~ handleSavePermittingInformation ~ permitInformationStore:',
      permitInformationStore
    )

    //permitting information does not currently account for multiple entries of take and mortality

    const {
      dateExpired,
      dateIssued,
      flowThreshold,
      trapCheckFrequency,
      waterTemperatureThreshold,
    } = permitInformationStore.values

    const permittingInformationSubmission = {
      permit_id: 'VARCHAR(25)', //to be completed
      program_id: 'INTEGER REFERENCES program', //to be completed
      stream_name: 'VARCHAR(25)', //to be completed
      permit_start_date: 'DATE', //to be completed
      permit_end_date: 'DATE', //to be completed
      flow_threshold: 'NUMERIC', //to be completed
      temperature_threshold: 'NUMERIC', //to be completed
      frequency_sampling_inclement_weather: 'NUMERIC', //to be completed
      species: 'VARCHAR(10) REFERENCES taxon (code)', //to be completed
      listing_unit: 'INTEGER REFERENCES listing_unit', //to be completed
      fish_life_stage: 'fish_life_stage_enum', //to be completed
      allowed_expected_take: 'NUMERIC', //to be completed
      allowed_mortality_count: 'NUMERIC', //to be completed
      permit_file_link: 'VARCHAR(200)', //to be completed
      expectedTakeAndMortality: Object.values(
        permitInformationStore.takeAndMortalityValues
      ).map((takeAndMortalityObj: any) => {
        console.log('🚀 ~ ).map ~ takeAndMortalityObj:', takeAndMortalityObj)

        const {
          expectedTake,
          indirectMortality,
          lifeStage,
          listingUnitOrStock,
          species,
        } = takeAndMortalityObj
        return {
          species: 'VARCHAR(10) REFERENCES taxon (code)', //to be completed
          listing_unit: 'INTEGER REFERENCES listing_unit', //to be completed
          fish_life_stage: 'fish_life_stage_enum', //to be completed
          allowed_expected_take: Number(expectedTake), //to be completed
          allowed_mortality_count: Number(indirectMortality), //to be completed
        }
      }),
    }
    console.log(
      '🚀 ~ handleSavePermittingInformation ~ permittingInformationSubmission:',
      permittingInformationSubmission
    )
  }, [permitInformationStore])

  return (
    <>
      <View flex={1} bg='#fff'>
        <VStack space={10} px='15%' py='5%'>
          <VStack space={4}>
            <HStack space={5}>
              <Heading mb='4'>Create New Program</Heading>
              <Button
                bg='primary'
                w='40'
                h='10'
                onPress={() => {
                  // handleSaveProgramMetaData()
                  // handleSaveTrappingSites()
                  // handleSaveCrewMembers()
                  // handleSaveEfficiencyTrialProtocols()
                  // handleSaveTrappingProtocols()
                  handleSavePermittingInformation()
                }}
              >
                TEST SAVE
              </Button>
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
    trappingSitesStore: state.trappingSites.trappingSitesStore,
    crewMembersStore: state.crewMembers.crewMembersStore,
    efficiencyTrialProtocolsStore: state.efficiencyTrialProtocols,
    trappingProtocolsStore: state.trappingProtocols.trappingProtocolsStore,
    permitInformationStore: state.permitInformation,
  }
}

export default connect(mapStateToProps)(CreateNewProgramHome)
