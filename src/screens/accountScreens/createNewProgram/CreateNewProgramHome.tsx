import React, { useCallback, useEffect, useState } from 'react'
import { Text, Heading, View, VStack, HStack, Button } from 'native-base'
import CreateNewProgramButton from '../../../components/createNewProgram/CreateNewProgramButton'
import CreateNewProgramNavButtons from '../../../components/createNewProgram/CreateNewProgramNavButtons'
import { connect, useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '../../../redux/store'
import { startCase } from 'lodash'
import { PermitInformationInitialStateI } from '../../../redux/reducers/createNewProgramSlices/permitInformationSlice'
import { TrappingProtocolsInitialStateI } from '../../../redux/reducers/createNewProgramSlices/trappingProtocolsSlice'
import { EfficiencyTrialProtocolsInitialStateI } from '../../../redux/reducers/createNewProgramSlices/efficiencyTrialProtocolsSlice'
import { CreateNewProgramInitialStateI } from '../../../redux/reducers/createNewProgramSlices/createNewProgramHomeSlice'
import { TrappingSitesStoreI } from '../../../redux/reducers/createNewProgramSlices/trappingSitesSlice'
import { CrewMembersStoreI } from '../../../redux/reducers/createNewProgramSlices/crewMembersSlice'
import { TrappingProtocolsStoreI } from '../../../redux/reducers/createNewProgramSlices/trappingProtocolsSlice'
import {
  postMonitoringProgramSubmissions,
  saveMonitoringProgramSubmission,
} from '../../../redux/reducers/postSlices/monitoringProgramPostBundler'
import {
  returnDefinitionArray,
  returnNullableTableId,
} from '../../../utils/utils'

interface ProgramMetaDataSubmissionI {
  programName: string
  streamName: string
  personnelLead: number
  fundingAgency: number
  efficiencyProtocolsDocumentLink?: string
  trappingProtocolsDocumentLink?: string
  createdAt: Date
  updatedAt: Date
}
interface TrappingSitesSubmissionI {
  trapName: string
  dataRecorderId: number
  dataRecorderAgencyId: number
  siteName: string
  coneSizeFt: number
  xCoord: number
  yCoord: number
  coordinateSystem?: string
  projection?: string
  datum?: string
  gageNumber: number
  gageAgency?: number
  comments?: string
  createdAt: Date
  updatedAt: Date
}
interface CrewMembersSubmissionI {
  firstName: string
  lastName: string
  email: string
  phone: string
  agencyId: number
  role: string
  orcidId: string
  createdAt: Date
  updatedAt: Date
}
interface EfficiencyTrialProtocolsSubmissionI {
  hatcheryName: string
  streamName: string
  agreementId?: string
  aggrementStartDate?: Date
  aggrementEndDate?: Date
  renewalDate?: Date
  frequencyOfFishCollection: number
  quantityOfFish: number
  hatcheryFileLink?: string
}
interface TrappingProtocolsSubmissionI {
  species: string
  lifeStage: number
  run: number
  numberMeasured: number
}
interface PermitInformationSubmissionI {}

export interface MonitoringProgramSubmissionI {
  metaData: ProgramMetaDataSubmissionI
  trappingSites: TrappingSitesSubmissionI[]
  crewMembers: CrewMembersSubmissionI[]
  efficiencyTrialProtocols: EfficiencyTrialProtocolsSubmissionI
  trappingProtocols: TrappingProtocolsSubmissionI[]
  permittingInformation: any
}
const CreateNewProgramHome = ({
  createNewProgramHomeStore,
  trappingSitesStore,
  crewMembersStore,
  efficiencyTrialProtocolsStore,
  trappingProtocolsStore,
  permitInformationStore,
  navigation,
  connectivityState,
  dropdownsState,
}: {
  createNewProgramHomeStore: CreateNewProgramInitialStateI
  trappingSitesStore: TrappingSitesStoreI
  crewMembersStore: CrewMembersStoreI
  efficiencyTrialProtocolsStore: EfficiencyTrialProtocolsInitialStateI
  trappingProtocolsStore: TrappingProtocolsStoreI
  permitInformationStore: PermitInformationInitialStateI
  navigation: any
  connectivityState: any
  dropdownsState: any
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { monitoringProgramName, streamName, fundingAgency } =
    createNewProgramHomeStore.values

  const [formIsCompleteAndValid, setFormIsCompleteAndValid] = useState(
    false as boolean
  )

  useEffect(() => {
    const checkForm = createNewProgramHomeStore.steps.every(
      (step) => step.completed === true
    )
    if (checkForm) {
      setFormIsCompleteAndValid(true)
    } else {
      setFormIsCompleteAndValid(false)
    }
  }, [createNewProgramHomeStore])

  const POSTMonitoringProgramSubmissions = () => {
    try {
      const metaData = handleSaveProgramMetaData()
      const trappingSites = handleSaveTrappingSites()
      const crewMembers = handleSaveCrewMembers()
      console.log(
        '🚀 ~ POSTMonitoringProgramSubmissions ~ crewMembers:',
        crewMembers
      )
      const efficiencyTrialProtocols = handleSaveEfficiencyTrialProtocols()
      const trappingProtocols = handleSaveTrappingProtocols()
      const permittingInformation = handleSavePermittingInformation()

      const monitoringProgramSubmission: MonitoringProgramSubmissionI = {
        metaData: metaData,
        trappingSites: trappingSites,
        crewMembers: crewMembers,
        efficiencyTrialProtocols: efficiencyTrialProtocols,
        trappingProtocols: trappingProtocols,
        permittingInformation: permittingInformation,
      }

      dispatch(saveMonitoringProgramSubmission(monitoringProgramSubmission))
      if (connectivityState.isConnected) {
        console.log('CONNECTED')
        dispatch(postMonitoringProgramSubmissions())
      }
    } catch (error) {
      console.error(error)
    }
  }

  // Program Meta Data

  const handleSaveProgramMetaData = useCallback(() => {
    const { fundingAgency, monitoringProgramName, streamName } =
      createNewProgramHomeStore.values

    const fundingAgencyValues = returnDefinitionArray(
      dropdownsState.values.fundingAgency
    )

    const programMetaDataSubmission: ProgramMetaDataSubmissionI = {
      programName: monitoringProgramName,
      streamName: streamName,
      personnelLead: 14, //to be completed when a logged in user is persisted
      fundingAgency: fundingAgencyValues.indexOf(fundingAgency) + 1, //fundingAgency, //to be completed
      // efficiencyProtocolsDocumentLink: 'VARCHAR(200)', //to be completed
      // trappingProtocolsDocumentLink: 'VARCHAR(200)', //to be completed
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    return programMetaDataSubmission
  }, [createNewProgramHomeStore])

  // Trapping Sites

  const handleSaveTrappingSites = useCallback(() => {
    const fundingAgencyValues = returnDefinitionArray(
      dropdownsState.values.fundingAgency
    )
    console.log('🚀 ~ Object.values ~ trappingSitesStore:', trappingSitesStore)
    const trappingSitesSubmission: Array<TrappingSitesSubmissionI> =
      Object.values(trappingSitesStore).map((trapSiteObj: any) => {
        const {
          trapName,
          coneSize,
          trapLatitude,
          trapLongitude,
          USGSStationNumber,
          releaseSiteLatitude, // need to address release site information
          releaseSiteLongitude,
          releaseSiteName,
        } = trapSiteObj
        return {
          trapName,
          dataRecorderId: 14, //to be completed when a logged in user is persisted
          dataRecorderAgencyId:
            fundingAgencyValues.indexOf(
              createNewProgramHomeStore.values.fundingAgency
            ) + 1,
          siteName: trapName, //to be completed
          coneSizeFt: Number(coneSize),
          xCoord: Number(trapLatitude),
          yCoord: Number(trapLongitude),
          releaseSiteName,
          releaseSiteXCoord: Number(releaseSiteLatitude),
          releaseSiteYCoord: Number(releaseSiteLongitude),
          // coordinateSystem: 'VARCHAR(100)', //to be completed
          // projection: 'VARCHAR(100)', //ignore for now ?release_site_projection
          // datum: 'VARCHAR(100)', //ignore for now ?release_site_datum
          gageNumber: Number(USGSStationNumber),
          gageAgency:
            fundingAgencyValues.indexOf(
              createNewProgramHomeStore.values.fundingAgency
            ) + 1, //'INTEGER REFERENCES agency', //to be completed
          // comments: 'VARCHAR(500)', //to be completed
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      })

    return trappingSitesSubmission
  }, [trappingSitesStore])

  // Crew Members / Personnel / Program Personnel

  const handleSaveCrewMembers = useCallback(() => {
    const fundingAgencyValues = returnDefinitionArray(
      dropdownsState.values.fundingAgency
    )
    const crewMembersSubmission: Array<CrewMembersSubmissionI> = Object.values(
      crewMembersStore
    ).map((crewMemberObj: any) => {
      const {
        firstName,
        lastName,
        phoneNumber,
        email,
        isLead,
        agency,
        orcidId,
      } = crewMemberObj

      return {
        firstName,
        lastName,
        email,
        phone: phoneNumber,
        agencyId: fundingAgencyValues.indexOf(agency) + 1,
        role: isLead ? 'lead' : 'non-lead',
        orcidId: orcidId,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    })

    return crewMembersSubmission
  }, [crewMembersStore])

  // Efficiency Trial Protocols

  const handleSaveEfficiencyTrialProtocols = useCallback(() => {
    const {
      hatchery,
      frequencyOfReceivingFish,
      expectedNumberOfFishReceivedAtEachPickup,
      agreementStartDate,
      agreementEndDate,
      renewalDate,
    } = efficiencyTrialProtocolsStore.values

    const frequencyOfReceivingFishValues = returnDefinitionArray(
      dropdownsState.values.frequency
    )

    const efficiencyTrialProtocolsSubmission: EfficiencyTrialProtocolsSubmissionI =
      {
        hatcheryName: hatchery,
        streamName: createNewProgramHomeStore.values.streamName, //to be completed
        // agreementId: 'VARCHAR(25)', //to be completed
        aggrementStartDate: agreementStartDate,
        aggrementEndDate: agreementEndDate,
        renewalDate: renewalDate,
        frequencyOfFishCollection:
          frequencyOfReceivingFishValues.indexOf(frequencyOfReceivingFish) + 1,
        quantityOfFish: Number(expectedNumberOfFishReceivedAtEachPickup),
        // hatcheryFileLink: 'VARCHAR(200)', //to be completed
      }

    return efficiencyTrialProtocolsSubmission
  }, [efficiencyTrialProtocolsStore])

  // Trapping Protocols

  const handleSaveTrappingProtocols = useCallback(() => {
    const returnTaxonCode = (speciesString: string) => {
      let code: string = ''
      dropdownsState.values.taxon.forEach((taxonValue: any) => {
        if (
          taxonValue.commonname
            .toLowerCase()
            .includes(speciesString.toLowerCase())
        ) {
          code = taxonValue.code
        }
      })
      return code
    }

    const lifeStageValues = returnDefinitionArray(
      dropdownsState.values.lifeStage
    )
    const runValues = returnDefinitionArray(dropdownsState.values.run)

    const saveTrappingProtocolsSubmission: Array<TrappingProtocolsSubmissionI> =
      Object.values(trappingProtocolsStore).map((trappingProtocolObj: any) => {
        const { species, run, lifeStage, numberMeasured } = trappingProtocolObj

        return {
          species: returnTaxonCode(species),
          lifeStage: lifeStageValues.indexOf(lifeStage) + 1,
          run: runValues.indexOf(run) + 1,
          numberMeasured: Number(numberMeasured),
        }
      })

    return saveTrappingProtocolsSubmission
  }, [trappingProtocolsStore])

  // Permitting Information

  const handleSavePermittingInformation = useCallback(() => {
    //WORK IN PROGRESS permitting information does not currently account for multiple entries of take and mortality
    const {
      dateExpired,
      dateIssued,
      flowThreshold,
      trapCheckFrequency,
      waterTemperatureThreshold,
    } = permitInformationStore.values

    const frequencyOfReceivingFishValues = returnDefinitionArray(
      dropdownsState.values.frequency
    )
    const permittingInformationSubmission = {
      // permit_id: 'VARCHAR(25)', //to be completed
      streamName: createNewProgramHomeStore.values.streamName,
      permitStartDate: dateIssued,
      permitEndDate: dateExpired,
      flowThreshold: Number(flowThreshold),
      temperatureThreshold: Number(waterTemperatureThreshold),
      frequencySamplingInclementWeather:
        frequencyOfReceivingFishValues.indexOf(trapCheckFrequency) + 1,
      // permit_file_link: 'VARCHAR(200)', //to be completed

      // expectedTakeAndMortality: Object.values(
      //   permitInformationStore.takeAndMortalityValues
      // ).map((takeAndMortalityObj: any) => {
      //   console.log('🚀 ~ ).map ~ takeAndMortalityObj:', takeAndMortalityObj)

      //   const {
      //     expectedTake,
      //     indirectMortality,
      //     lifeStage,
      //     listingUnitOrStock,
      //     species,
      //   } = takeAndMortalityObj
      //   return {
      //     species: 'VARCHAR(10) REFERENCES taxon (code)', //to be completed
      //     listing_unit: 'INTEGER REFERENCES listing_unit', //to be completed
      //     fish_life_stage: 'fish_life_stage_enum', //to be completed
      //     allowed_expected_take: Number(expectedTake), //to be completed
      //     allowed_mortality_count: Number(indirectMortality), //to be completed
      //   }
      // }),
    }

    return permittingInformationSubmission
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
                  POSTMonitoringProgramSubmissions()
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
      <CreateNewProgramNavButtons
        navigation={navigation}
        formIsCompleteAndValid={formIsCompleteAndValid}
        POSTMonitoringProgramSubmissions={POSTMonitoringProgramSubmissions}
      />
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
    connectivityState: state.connectivity,
    dropdownsState: state.dropdowns,
  }
}

export default connect(mapStateToProps)(CreateNewProgramHome)
