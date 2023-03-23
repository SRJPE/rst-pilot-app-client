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

const FishHolding = ({
  fishStore,
  selectedFishStoreState,
  fishHoldingTabId,
}: {
  fishStore: FishStoreI
  selectedFishStoreState: SelectedFishStoreI
  fishHoldingTabId: string
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const navigation: any = useNavigation()
  const [selectedFishStore, setSelectedFishStore] = useState({} as any)
  const [selectedLifeStages, setSelectedLifeStages] = useState([] as Array<any>)
  const [selectedRuns, setSelectedRuns] = useState([] as Array<any>)
  const [totalFish, setTotalFish] = useState(0 as number)

  useEffect(() => {
    if (Object.keys(selectedFishStoreState).length === 0) {
      createSelectedFishStore()
    } else {
      setSelectedFishStore(selectedFishStoreState as SelectedFishStoreI)
    }
    setSelectedLifeStagesAndRuns()
  }, [])

  useEffect(() => {
    setSelectedLifeStagesAndRuns()
    calculateTotalFish()
  }, [selectedFishStore])

  const createSelectedFishStore = () => {
    const tempSelectedFishStore = {} as any
    for (const fish in fishStore) {
      //only add chinook to the list
      if (fishStore[fish].species !== 'Chinook salmon') continue
      //do not add yolk sac fry to store
      if (fishStore[fish].lifeStage === 'yolk sac fry') continue
      //add remaining fish objects to selectedFishStore
      tempSelectedFishStore[fish] = fishStore[fish]
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
    setTotalFish(Object.keys(selectedFishStore).length)
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

  const handleSubmit = () => {
    if (fishHoldingTabId) {
      dispatch(saveTotalFishHolding(totalFish))
      dispatch(
        saveFishHolding({
          tabId: fishHoldingTabId,
          values: {
            totalFishHolding: totalFish,
            selectedFishStore: selectedFishStore,
          },
        })
      )
      dispatch(
        markFishHoldingCompleted({ tabId: fishHoldingTabId, completed: true })
      )
    }
  }

  //render new cards when selected runs or lifeStages change
  const renderFishHoldingCards = useCallback(() => {
    return (
      <HStack space={10} justifyContent='center' h='475' mb='75'>
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
      <View flex={1} bg='#fff' p='6%' borderColor='themeGrey' borderWidth='15'>
        <VStack space={10}>
          <Heading fontSize='28'>
            Which fish are you holding for mark recapture Trials?
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
        </VStack>

        <HStack space={10} justifyContent='center'>
          {/* <Button
            bg='primary'
            alignSelf='flex-start'
            shadow='5'
            onPress={() => {
              console.log('fishStore: ', fishStore)
              console.log('selectedFishStore: ', selectedFishStore)
              console.log('selectedRuns: ', selectedRuns)
              console.log('selectedLifeStages: ', selectedLifeStages)
              console.log('🚀 ~ totalFish:', totalFish)
            }}
          >
            <Text fontWeight='bold' color='white'>
              Log
            </Text>
          </Button> */}

          <Heading>Total Fish Holding: {totalFish}</Heading>
        </HStack>
      </View>
      <NavButtons navigation={navigation} handleSubmit={handleSubmit} />
    </>
  )
}

const mapStateToProps = (state: RootState) => {
  let fishInputTabId = 'placeholderId'
  if (
    state.tabSlice.activeTabId &&
    state.fishInput[state.tabSlice.activeTabId]
  ) {
    fishInputTabId = state.tabSlice.activeTabId
  }

  let fishHoldingTabId = 'placeholderId'
  if (
    state.tabSlice.activeTabId &&
    state.fishHolding[state.tabSlice.activeTabId]
  ) {
    fishHoldingTabId = state.tabSlice.activeTabId
  }

  return {
    fishStore: state.fishInput[fishInputTabId].fishStore,
    selectedFishStoreState:
      state.fishHolding[fishHoldingTabId].values.selectedFishStore,
    fishHoldingTabId,
  }
}

export default connect(mapStateToProps)(FishHolding)
