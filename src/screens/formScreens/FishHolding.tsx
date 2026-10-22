import { useNavigation } from '@react-navigation/native'
import {
  HStack,
  Text,
  Button,
  Heading,
  View,
  Input,
  Box,
  ScrollView,
} from 'native-base'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { connect, useDispatch } from 'react-redux'
import { useFormSave } from '../../context/FormSaveContext'
import { updateFishEntry } from '../../redux/reducers/formSlices/fishInputSlice'
import { saveTotalFishHolding } from '../../redux/reducers/markRecaptureSlices/releaseTrialSlice'
import { AppDispatch, RootState } from '../../redux/store'
import FishHoldingCard from '../../components/form/FishHoldingCard'
import NavButtons from '../../components/formContainer/NavButtons'
import {
  markFishHoldingCompleted,
  saveFishHolding,
  SelectedFishStoreI,
} from '../../redux/reducers/markRecaptureSlices/fishHoldingSlice'
import { saveTrapVisitInformation } from '../../redux/reducers/markRecaptureSlices/releaseTrialDataEntrySlice'
import { navigateHelper, findTrapLocationIds } from '../../utils/utils'
import { updateActiveStep } from '../../redux/reducers/formSlices/navigationSlice'

const mapStateToProps = (state: RootState) => {
  return {
    fishInput: state.fishInput,
    selectedFishStoreState: state.fishHolding.values.selectedFishStore,
    activeTabId: state.tabSlice.activeTabId,
    previouslyActiveTabId: state.tabSlice.previouslyActiveTabId,
    navigationSlice: state.navigation,
    visitSetupState: state.visitSetup,
    tabState: state.tabSlice,
    fishProcessingState: state.fishProcessing,
  }
}

const FishHolding = ({
  fishInput,
  selectedFishStoreState,
  activeTabId,
  previouslyActiveTabId,
  navigationSlice,
  visitSetupState,
  tabState,
  fishProcessingState,
}: {
  fishInput: any
  selectedFishStoreState: SelectedFishStoreI
  activeTabId: string | null
  previouslyActiveTabId: string | null
  navigationSlice: any
  visitSetupState: any
  tabState: any
  fishProcessingState: any
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const navigation: any = useNavigation()
  const { registerSaveHandler } = useFormSave()
  const [selectedFishStore, setSelectedFishStore] = useState({} as any)
  const [selectedLifeStages, setSelectedLifeStages] = useState([] as Array<any>)
  const [selectedRuns, setSelectedRuns] = useState([] as Array<any>)
  const [totalFish, setTotalFish] = useState(0 as number | string)

  useEffect(() => {
    if (
      selectedFishStoreState &&
      Object.keys(selectedFishStoreState).length === 0
    ) {
      createSelectedFishStore()
    } else {
      setSelectedFishStore(selectedFishStoreState as SelectedFishStoreI)
    }
    setSelectedLifeStagesAndRuns()
  }, [activeTabId, selectedFishStoreState])

  useEffect(() => {
    handleResetAll()
  }, [...Object.keys(fishInput).map(tabId => fishInput[tabId].fishStore)])

  useEffect(() => {
    if (previouslyActiveTabId && navigationSlice.activeStep === 16) {
      handleSubmit(previouslyActiveTabId)
    }
  }, [previouslyActiveTabId])

  useEffect(() => {
    setSelectedLifeStagesAndRuns()
    calculateTotalFish()
  }, [selectedFishStore])

  // This screen holds the crew's holding/release selections (and a manual
  // total-fish override) in local state with no autosave - previously only
  // persisted on explicit Next/Prev. If the crew navigated away via the
  // drawer, backgrounded the app, or it crashed mid-edit, those selections
  // were silently lost. registerSaveHandler wires into the drawer's "save
  // before leaving" hook; the unmount-cleanup below is a backstop for any
  // other way this screen gets torn down. Refs (not state) are used in the
  // cleanup since a cleanup closure is fixed at mount time.
  const selectedFishStoreRef = useRef(selectedFishStore)
  useEffect(() => {
    selectedFishStoreRef.current = selectedFishStore
  }, [selectedFishStore])

  const totalFishRef = useRef(totalFish)
  useEffect(() => {
    totalFishRef.current = totalFish
  }, [totalFish])

  const activeTabIdRef = useRef(activeTabId)
  useEffect(() => {
    activeTabIdRef.current = activeTabId
  }, [activeTabId])

  useEffect(() => {
    if (!activeTabId) return
    registerSaveHandler(() => handleSubmit(activeTabId))
    return () => registerSaveHandler(null)
  }, [selectedFishStore, totalFish, activeTabId])

  useEffect(() => {
    return () => {
      if (activeTabIdRef.current) {
        handleSubmit(activeTabIdRef.current, undefined, {
          selectedFishStore: selectedFishStoreRef.current,
          totalFish: totalFishRef.current,
        })
      }
    }
  }, [])

  const combineFishStoreForAllTabs = () => {
    let combinedFishStore = {} as any
    let count = 0 as number
    for (let individualFishStore in fishInput) {
      if (individualFishStore === 'placeholderId') continue

      if (
        fishProcessingState?.[individualFishStore]?.values
          ?.willBeHoldingFishForMarkRecapture
      ) {
        for (let fish in fishInput[individualFishStore].fishStore) {
          const fishObj = {
            ...fishInput[individualFishStore].fishStore[fish],
            tabId: individualFishStore,
            fishObjId: fish,
          }
          combinedFishStore[count] = fishObj
          count++
        }
      }
    }

    return combinedFishStore
  }

  const createSelectedFishStore = () => {
    const tempSelectedFishStore = {} as any
    const fishStoreForAllTabs = combineFishStoreForAllTabs()

    for (const fish in fishStoreForAllTabs) {
      //only add chinook to the list
      if (fishStoreForAllTabs[fish].species !== 'Chinook salmon') continue
      //do not add yolk sac fry to store
      if (fishStoreForAllTabs[fish].lifeStage === 'yolk sac fry') continue
      //add remaining fish objects to selectedFishStore
      tempSelectedFishStore[fish] = fishStoreForAllTabs[fish]
    }
    //set the temp fish store the state
    setSelectedFishStore(tempSelectedFishStore)
  }

  const setSelectedLifeStagesAndRuns = () => {
    const lifeStagesNamesArray: string[] = []
    const runNamesArray: string[] = []
    //for each fish in the fish Store
    for (const fish in selectedFishStore) {
      //add to the temp store arr
      lifeStagesNamesArray.push(selectedFishStore[fish].lifeStage)
      runNamesArray.push(selectedFishStore[fish].run)
    }
    //remove duplicates by creating new Sets and then set state
    const lifeStagesSet = [...new Set(lifeStagesNamesArray)]
    const runsSet = [...new Set(runNamesArray)]
    setSelectedLifeStages(lifeStagesSet)
    setSelectedRuns(runsSet)
  }

  const calculateTotalFish = () => {
    let sum = 0

    for (let fish in selectedFishStore) {
      sum += parseInt(selectedFishStore[fish].numFishCaught, 10)
    }
    setTotalFish(sum)
  }

  const removeBadgeFromList = (list: Array<any>, badgeToRemove: string) => {
    for (let i = 0; i < list.length; i++) {
      //find the selected button by its name
      if (list[i] === badgeToRemove) {
        //remove that item from the list
        list.splice(i, 1)
      }
    }
    return list
  }

  const removeFishFromSelectedStore = (
    badgeToRemove: string,
    propInQuestion: string
  ) => {
    //make a copy of the fish store
    const selectedFishStoreCopy = { ...selectedFishStore }
    //for each prop in the selectedFishStore
    //if the prop value.run === badge to remove
    //delete that property from the selectedFishStore
    for (const fish in selectedFishStoreCopy) {
      if (selectedFishStoreCopy[fish][propInQuestion] === badgeToRemove) {
        delete selectedFishStoreCopy[fish]
      }
    }
    return selectedFishStoreCopy
  }

  // when a badge is removed
  // all fish objects with the corresponding badge should be removed from the selectedFishStore
  const handlePressRemoveBadge = (badgeToRemove: string, cardTitle: string) => {
    if (cardTitle === 'Run') {
      setSelectedFishStore(removeFishFromSelectedStore(badgeToRemove, 'run'))
      setSelectedRuns([...removeBadgeFromList(selectedRuns, badgeToRemove)])
    } else {
      setSelectedFishStore(
        removeFishFromSelectedStore(badgeToRemove, 'lifeStage')
      )
      setSelectedLifeStages([
        ...removeBadgeFromList(selectedLifeStages, badgeToRemove),
      ])
    }
    calculateTotalFish()
  }

  const handleClearAll = () => {
    setSelectedRuns([])
    setSelectedLifeStages([])
    setTotalFish(0)
  }

  const handleResetAll = () => {
    createSelectedFishStore()
    setSelectedLifeStagesAndRuns()
    calculateTotalFish()
  }

  const tabIds = Object.keys(tabState.tabs)
  const handleSubmit = (
    tabId: string,
    buttonDirection?: string,
    overrides?: { selectedFishStore?: any; totalFish?: number | string }
  ) => {
    const effectiveSelectedFishStore =
      overrides?.selectedFishStore ?? selectedFishStore
    const effectiveTotalFish = overrides?.totalFish ?? totalFish
    if (tabId) {
      const totalFishNumeric = parseInt(effectiveTotalFish as string, 10)
      //saves for release trial
      dispatch(saveTotalFishHolding(totalFishNumeric))
      //saves for releaseTrial data entry
      dispatch(
        saveTrapVisitInformation({
          crew: visitSetupState[tabIds[0]].values.crew,
          programId: visitSetupState[tabIds[0]].values.programId,
          trapLocationIds: findTrapLocationIds(visitSetupState),
        })
      )
      // saves to fish holding
      for (let fish in effectiveSelectedFishStore) {
        effectiveSelectedFishStore[fish] = {
          ...effectiveSelectedFishStore[fish],
          willBeUsedInRecapture: true,
        }

        dispatch(
          updateFishEntry({
            tabId: effectiveSelectedFishStore[fish].tabId,
            id: effectiveSelectedFishStore[fish].fishObjId,
            ...effectiveSelectedFishStore[fish],
            willBeUsedInRecapture: true,
          })
        )
      }
      dispatch(
        saveFishHolding({
          totalFishHolding: totalFishNumeric,
          selectedFishStore: effectiveSelectedFishStore,
        })
      )
      dispatch(markFishHoldingCompleted(true))
    }
    if (buttonDirection) {
      const destination =
        buttonDirection === 'left'
          ? 'Trap Post-Processing'
          : 'Incomplete Sections'

      navigateHelper(
        destination,
        navigationSlice,
        navigation,
        dispatch,
        updateActiveStep
      )
    }
  }

  //render new cards when selected runs or lifeStages change
  const renderFishHoldingCards = useCallback(() => {
    return (
      <HStack space={10} justifyContent='center' height={'400px'}>
        <FishHoldingCard
          cardContent={selectedLifeStages}
          handlePressRemoveBadge={handlePressRemoveBadge}
          cardTitle='Life Stage'
        />
        <FishHoldingCard
          cardContent={selectedRuns}
          handlePressRemoveBadge={handlePressRemoveBadge}
          cardTitle='Run'
        />
      </HStack>
    )
  }, [selectedRuns, selectedLifeStages])

  const handleTotalFishChange = (text: string) => setTotalFish(text)

  return (
    <>
      <ScrollView
        bg='#fff'
        p='5%'
        borderColor='themeGrey'
        borderWidth='15'
        flex={1}
        scrollEnabled
        height={'100%'}
      >
        <Heading fontSize='28'>
          Which fish are you holding for mark recapture trials?
        </Heading>
        <Box>
          <Text fontSize={'xl'} marginTop={5}>
            Select appropriate life stages and runs for the fish you are holding
            for mark recapture trials. Total Fish Holding will be updated based
            on the selected life stages and runs. You may also edit the final
            number within the input field.
          </Text>
        </Box>
        <View marginTop={10} marginBottom={10}>
          <HStack space={10} justifyContent='center'>
            <Heading alignSelf='center'>Total Fish Holding:</Heading>
            <Box alignItems='center' w={100}>
              <Input
                value={totalFish.toString()}
                w='100%'
                size={'2xl'}
                onChangeText={handleTotalFishChange}
                keyboardType='number-pad'
              />
            </Box>
          </HStack>
        </View>
        {/* {renderFishHoldingCards()} */}
        <HStack marginBottom={10}>
          <Button
            bg='primary'
            alignSelf='flex-start'
            shadow='5'
            ml='10'
            onPress={handleClearAll}
          >
            <Text fontWeight='bold' color='white'>
              Clear all, I am not holding any fish
            </Text>
          </Button>
          <Button
            bg='primary'
            alignSelf='flex-start'
            shadow='5'
            ml='180'
            onPress={handleResetAll}
          >
            <Text fontWeight='bold' color='white'>
              Reset All
            </Text>
          </Button>
        </HStack>
        {renderFishHoldingCards()}
      </ScrollView>
      <NavButtons
        navigation={navigation}
        handleSubmit={(buttonDirection?: string) => {
          if (activeTabId) handleSubmit(activeTabId, buttonDirection)
        }}
      />
    </>
  )
}

export default connect(mapStateToProps)(FishHolding)
