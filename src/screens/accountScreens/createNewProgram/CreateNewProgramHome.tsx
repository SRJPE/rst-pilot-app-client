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
import { GroupTrapSiteValuesI } from '../../../redux/reducers/createNewProgramSlices/multipleTrapsSlice'

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
  releaseSiteName: string
  releaseSiteXCoord: number
  releaseSiteYCoord: number
  coordinateSystem?: string
  projection?: string
  datum?: string
  gageNumber: number
  gageAgency: number
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
  agreementStartDate: Date
  agreementEndDate: Date
  renewalDate: Date
  frequencyOfFishCollection?: number | null
  quantityOfFish: number
  hatcheryFileLink?: string
}
interface TrappingProtocolsSubmissionI {
  species: string
  lifeStage: number
  run: number
  numberMeasured: number
}
interface PermitInformationSubmissionI {
  streamName: string
  permit_file_link?: string
  permitStartDate: Date
  permitEndDate: Date
  flowThreshold: number
  temperatureThreshold: number
  frequencySamplingInclementWeather: number
  expectedTakeAndMortality: Array<{
    species: any
    listingUnit: number
    fishLifeStage: number
    allowedExpectedTake: number
    allowedMortalityCount: number
  }>
}

export interface MonitoringProgramSubmissionI {
  metaData: ProgramMetaDataSubmissionI
  trappingSites: TrappingSitesSubmissionI[]
  crewMembers: CrewMembersSubmissionI[]
  efficiencyTrialProtocols: EfficiencyTrialProtocolsSubmissionI[]
  trappingProtocols: TrappingProtocolsSubmissionI[]
  permittingInformation: PermitInformationSubmissionI[]
}
const CreateNewProgramHome = ({
  createNewProgramHomeStore,
  trappingSitesStore,
  multipleTrapsStore,
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
  multipleTrapsStore: GroupTrapSiteValuesI
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
    const trappingSitesSubmission: Array<TrappingSitesSubmissionI> =
      Object.values(trappingSitesStore).map((trapSiteObj: any) => {
        const {
          trapName,
          coneSize,
          trapLatitude,
          trapLongitude,
          USGSStationNumber,
          releaseSiteLatitude,
          releaseSiteLongitude,
          releaseSiteName,
        } = trapSiteObj
        let groupSiteName: any = null

        Object.values(multipleTrapsStore).forEach((trapSiteGroup: any) => {
          if (trapSiteGroup.groupItems.includes(trapName)) {
            groupSiteName = trapSiteGroup.trapSiteName
          }
        })

        return {
          trapName,
          dataRecorderId: 14, //to be completed when a logged in user is persisted
          dataRecorderAgencyId:
            fundingAgencyValues.indexOf(
              createNewProgramHomeStore.values.fundingAgency
            ) + 1,
          siteName: groupSiteName,
          coneSizeFt: Number(coneSize),
          xCoord: Number(trapLatitude),
          yCoord: Number(trapLongitude),
          releaseSiteName,
          releaseSiteXCoord: Number(releaseSiteLatitude),
          releaseSiteYCoord: Number(releaseSiteLongitude),
          // coordinateSystem: 'VARCHAR(100)', //ignore for now
          // projection: 'VARCHAR(100)', //ignore for now - release_site_projection
          // datum: 'VARCHAR(100)', //ignore for now - release_site_datum
          gageNumber: Number(USGSStationNumber),
          gageAgency:
            fundingAgencyValues.indexOf(
              createNewProgramHomeStore.values.fundingAgency
            ) + 1,
          // comments: 'VARCHAR(500)', //to be completed
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      })

    return trappingSitesSubmission
  }, [trappingSitesStore, multipleTrapsStore])

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
    if (hatchery === '') {
      return []
    } else {
      const efficiencyTrialProtocolsSubmission: EfficiencyTrialProtocolsSubmissionI =
        {
          hatcheryName: hatchery,
          streamName: createNewProgramHomeStore.values.streamName, //to be completed
          // agreementId: 'VARCHAR(25)', //to be completed
          agreementStartDate: agreementStartDate,
          agreementEndDate: agreementEndDate,
          renewalDate: renewalDate,
          frequencyOfFishCollection: frequencyOfReceivingFishValues
            ? frequencyOfReceivingFishValues.indexOf(frequencyOfReceivingFish) +
              1
            : null,
          quantityOfFish: Number(expectedNumberOfFishReceivedAtEachPickup),
          // hatcheryFileLink: 'VARCHAR(200)', //to be completed
        }

      return [efficiencyTrialProtocolsSubmission]
    }
  }, [efficiencyTrialProtocolsStore])

  //
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

  // Trapping Protocols
  const handleSaveTrappingProtocols = useCallback(() => {
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
    const lifeStageValues = returnDefinitionArray(
      dropdownsState.values.lifeStage
    )
    const listingUnitOrStockValues = returnDefinitionArray(
      dropdownsState.values.listingUnit
    )
    const runValues = returnDefinitionArray(dropdownsState.values.run)

    if (flowThreshold === null) {
      return []
    } else {
      const permittingInformationSubmission: PermitInformationSubmissionI = {
        streamName: createNewProgramHomeStore.values.streamName,
        // permit_file_link: 'VARCHAR(200)', //to be completed
        permitStartDate: dateIssued,
        permitEndDate: dateExpired,
        flowThreshold: Number(flowThreshold),
        temperatureThreshold: Number(waterTemperatureThreshold),
        frequencySamplingInclementWeather:
          frequencyOfReceivingFishValues.indexOf(trapCheckFrequency) + 1,
        expectedTakeAndMortality: Object.values(
          permitInformationStore.takeAndMortalityValues
        ).map((takeAndMortalityObj: any) => {
          const {
            expectedTake,
            indirectMortality,
            lifeStage,
            listingUnitOrStock,
            species,
          } = takeAndMortalityObj
          return {
            species: returnTaxonCode(species),
            listingUnit:
              listingUnitOrStockValues.indexOf(listingUnitOrStock) + 1,
            fishLifeStage: lifeStageValues.indexOf(lifeStage) + 1,
            allowedExpectedTake: Number(expectedTake),
            allowedMortalityCount: Number(indirectMortality),
          }
        }),
      }

      return [permittingInformationSubmission]
    }
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
    multipleTrapsStore: state.multipleTraps.groupTrapSiteValues,
    crewMembersStore: state.crewMembers.crewMembersStore,
    efficiencyTrialProtocolsStore: state.efficiencyTrialProtocols,
    trappingProtocolsStore: state.trappingProtocols.trappingProtocolsStore,
    permitInformationStore: state.permitInformation,
    connectivityState: state.connectivity,
    dropdownsState: state.dropdowns,
  }
}

export default connect(mapStateToProps)(CreateNewProgramHome)
