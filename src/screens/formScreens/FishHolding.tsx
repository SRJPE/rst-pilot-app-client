import { useNavigation } from '@react-navigation/native'
import { HStack, VStack, Text, Button, Heading, View } from 'native-base'
import { useCallback, useEffect, useState } from 'react'
import { connect, useDispatch } from 'react-redux'
import { FishStoreI } from '../../redux/reducers/formSlices/fishInputSlice'
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
  const [selectedFishStore, setSelectedFishStore] = useState({} as any)
  const [selectedLifeStages, setSelectedLifeStages] = useState([] as Array<any>)
  const [selectedRuns, setSelectedRuns] = useState([] as Array<any>)
  const [totalFish, setTotalFish] = useState(0 as number)

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
          combinedFishStore[count] =
            fishInput[individualFishStore].fishStore[fish]
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
  const findTrapLocationIds = () => {
    let container = [] as any
    for (let tabId in visitSetupState) {
      if (tabId === 'placeholderId') continue
      container.push(visitSetupState[tabId].values.trapLocationId)
    }
    return container
  }

  const tabIds = Object.keys(tabState.tabs)
  const handleSubmit = (tabId: string) => {
    if (tabId) {
      //saves for release trial
      dispatch(saveTotalFishHolding(totalFish))
      //saves for releaseTrial data entry
      dispatch(
        saveTrapVisitInformation({
          crew: visitSetupState[tabIds[0]].values.crew,
          programId: visitSetupState[tabIds[0]].values.programId,
          trapLocationIds: findTrapLocationIds(),
        })
      )
      // saves to fish holding
      dispatch(
        saveFishHolding({
          totalFishHolding: totalFish,
          selectedFishStore: selectedFishStore,
        })
      )
      dispatch(markFishHoldingCompleted(true))
    }
  }

  //render new cards when selected runs or lifeStages change
  const renderFishHoldingCards = useCallback(() => {
    return (
      <HStack space={10} justifyContent='center' h='70%'>
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

  return (
    <>
      <View flex={1} bg='#fff' p='5%' borderColor='themeGrey' borderWidth='15'>
        <VStack space={8}>
          <Heading fontSize='28'>
            Which fish are you holding for mark recapture trials?
          </Heading>
          <HStack>
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
          <Heading alignSelf='center'>Total Fish Holding: {totalFish}</Heading>
        </VStack>
      </View>
      <NavButtons
        navigation={navigation}
        handleSubmit={() => {
          if (activeTabId) handleSubmit(activeTabId)
        }}
      />
    </>
  )
}

export default connect(mapStateToProps)(FishHolding)
