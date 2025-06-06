import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  Heading,
  HStack,
  VStack,
  Text,
  View,
  Icon,
  ScrollView,
} from 'native-base'
import CustomModal from '../../components/Shared/CustomModal'
import NavButtons from '../../components/formContainer/NavButtons'
import { AppDispatch, RootState } from '../../redux/store'
import { connect, useDispatch } from 'react-redux'
import {
  markFishInputCompleted,
  markFishInputModalOpen,
  saveFishInput,
} from '../../redux/reducers/formSlices/fishInputSlice'
import {
  markStepCompleted,
  updateActiveStep,
} from '../../redux/reducers/formSlices/navigationSlice'
import FishInputDataTable from '../../components/form/FishInputDataTable'
import PlusCountModalContent from '../../components/form/PlusCountModalContent'
import { Ionicons } from '@expo/vector-icons'
import { DeviceEventEmitter, useWindowDimensions } from 'react-native'
import { TabStateI } from '../../redux/reducers/formSlices/tabSlice'
import { StackActions } from '@react-navigation/native'
import { navigateHelper } from '../../utils/utils'
import { showSlideAlert } from '../../redux/reducers/slideAlertSlice'
import { find, keyBy, mapValues } from 'lodash'

const mapStateToProps = (state: RootState) => {
  let activeTabId = 'placeholderId'
  if (
    state.tabSlice.activeTabId &&
    state.fishInput[state.tabSlice.activeTabId]
  ) {
    activeTabId = state.tabSlice.activeTabId
  }
  let speciesCaptured = state.fishInput[activeTabId].speciesCaptured

  return {
    activeTabId,
    speciesCaptured,
    tabSlice: state.tabSlice,
    fishInputSlice: state.fishInput,
    navigationSlice: state.navigation,
    visitSetupState: state.visitSetup,
    visitSetupDefaultsState: state.visitSetupDefaults,
  }
}

const FishInput = ({
  navigation,
  activeTabId,
  speciesCaptured,
  tabSlice,
  fishInputSlice,
  navigationSlice,
  visitSetupState,
  visitSetupDefaultsState,
}: {
  navigation: any
  activeTabId: string
  speciesCaptured: string[]
  tabSlice: TabStateI
  fishInputSlice: any
  navigationSlice: any
  visitSetupState: any
  visitSetupDefaultsState: any
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const [addPlusCountModalOpen, setAddPlusCountModalOpen] = useState(
    false as boolean
  )
  const [showError, setShowError] = useState(false as boolean)
  const [fishMeasureProtocol, setFishMeasureProtocol] = useState(
    {} as Record<string, number>
  )
  const [totalCatchCount, setTotalCatchCount] = useState(0)
  const [addFishModalTab, setAddFishModalTab] = useState<
    'Individual' | 'Batch'
  >('Individual')
  const [checkboxGroupValue, setCheckboxGroupValue] = useState(
    speciesCaptured.length > 1
      ? ([...speciesCaptured] as Array<string>)
      : (['YOY Chinook'] as Array<string>)
  )
  const errorMessage =
    tabSlice.tabs[tabSlice.activeTabId || activeTabId]?.errorDetails[
      'Fish Input'
    ]?.fishStore

  useEffect(() => {
    checkboxGroupValue.length < 1 ? setShowError(true) : setShowError(false)
  }, [checkboxGroupValue])

  useEffect(() => {
    if (!tabSlice?.activeTabId || !fishInputSlice) return

    const fishMeasureCounts = fishInputSlice?.[tabSlice.activeTabId]
      ?.fishMeasureCounts as { [key: string]: number }

    if (!fishMeasureCounts) return

    const total = Object.values(fishMeasureCounts).reduce(
      (sum: number, count: number) =>
        sum + (typeof count === 'number' ? count : 0),
      0
    ) as number

    setTotalCatchCount(total)
  }, [tabSlice.activeTabId, fishInputSlice])

  useEffect(() => {
    const activeTabId = tabSlice.activeTabId || 'placeholderId'

    const selectedProgramId = visitSetupState[activeTabId]?.values?.programId
    const selectedProgramObj = find(visitSetupDefaultsState.programs, {
      programId: selectedProgramId,
    })
    const fishMeasureProtocolObj = mapValues(
      keyBy(selectedProgramObj.fishMeasureProtocol, 'commonname'),
      (obj: any) => Number(obj.numberMeasured) || 0
    )
    setFishMeasureProtocol(fishMeasureProtocolObj)
  }, [visitSetupState, tabSlice, visitSetupDefaultsState])

  const handleSubmit = () => {
    dispatch(
      saveFishInput({
        tabId: activeTabId,
        speciesCaptured: checkboxGroupValue,
      })
    )
    dispatch(markFishInputCompleted({ tabId: activeTabId, bool: true }))
    let stepCompletedCheck = true

    if (stepCompletedCheck) {
      dispatch(markStepCompleted({ propName: 'fishInput' }))
    }
  }

  const submissionLoader = (direction: 'left' | 'right') => {
    const destination =
      direction === 'left' ? 'Fish Processing' : 'Trap Post-Processing'

    const callback = () => {
      navigateHelper(
        destination,
        navigationSlice,
        navigation,
        dispatch,
        updateActiveStep
      )
    }

    navigation.dispatch(StackActions.replace('Loading...'))

    setTimeout(() => {
      DeviceEventEmitter.emit('event.load', {
        process: () => handleSubmit(),
        callback,
      })
      showSlideAlert(dispatch)
    }, 1000)
  }

  return (
    <>
      <ScrollView
        flex={1}
        scrollEnabled
        bg='#fff'
        py='0%'
        borderColor='themeGrey'
        borderWidth='15'
      >
        <Heading mt={5} mb={showError ? '0' : '5'} px='4'>
          Enter Catch
        </Heading>
        <Text fontSize='lg' px='4' mb={5}>
          Record catch data using the individual fish input, the batch entry, or
          plus count.
        </Text>
        <VStack space={6}>
          <HStack space={10} px='4'>
            <Button
              bg='primary'
              p='3'
              borderRadius='5'
              flex='1'
              shadow='3'
              onPress={() => {
                navigation.navigate('Add Fish', {
                  // Add any props you want to pass here, for example:
                  fishMeasureProtocol,
                })
              }}
            >
              <Text fontSize='sm' fontWeight='bold' color='white'>
                Input Fish
              </Text>
            </Button>
            <Button
              bg='primary'
              p='3'
              borderRadius='5'
              flex='1'
              shadow='3'
              onPress={() => {
                navigation.navigate('Batch Count')
              }}
            >
              <Text fontSize='sm' fontWeight='bold' color='white'>
                Batch Count
              </Text>
            </Button>

            <Button
              bg='primary'
              p='3'
              flex='1'
              borderRadius='5'
              shadow='3'
              onPress={() => {
                setAddPlusCountModalOpen(true)
              }}
            >
              <Text fontSize='sm' fontWeight='bold' color='white'>
                Add Plus Counts
              </Text>
            </Button>
          </HStack>
          <HStack>
            <Text style={{ color: 'red', paddingHorizontal: 20 }}>
              {errorMessage}
            </Text>
          </HStack>

          <Box px='4'>
            <HStack space={2} alignItems='center'>
              <Heading mb={0}>Catch Table</Heading>
              <Text
                fontSize='xl'
                mb={0}
                style={{ textAlignVertical: 'center' }}
              >
                (Total Catch Count: {totalCatchCount})
              </Text>
            </HStack>
            <FishInputDataTable navigation={navigation} />
          </Box>
        </VStack>
        {/* --------- Modals --------- */}
        {addPlusCountModalOpen && (
          <CustomModal
            isOpen={addPlusCountModalOpen}
            closeModal={() => {
              if (activeTabId && activeTabId != 'placeholderId') {
                setAddPlusCountModalOpen(false)
                dispatch(
                  markFishInputModalOpen({ tabId: activeTabId, bool: false })
                )
              }
            }}
            height='100%'
          >
            <PlusCountModalContent
              closeModal={() => {
                setAddPlusCountModalOpen(false)
              }}
            />
          </CustomModal>
        )}
      </ScrollView>
      <NavButtons
        navigation={navigation}
        handleSubmit={(buttonDirection: 'left' | 'right') => {
          submissionLoader(buttonDirection)
        }}
        shouldProceedToLoadingScreen={true}
        values={checkboxGroupValue}
      />
    </>
  )
}

export default connect(mapStateToProps)(FishInput)
