import { useNavigation } from '@react-navigation/native'
import { HStack, VStack, Text, Button, Divider, Heading } from 'native-base'
import { memo, useCallback, useEffect, useState } from 'react'
import { connect, useDispatch } from 'react-redux'
import { FishStoreI } from '../../redux/reducers/formSlices/fishInputSlice'
import { updateActiveStep } from '../../redux/reducers/formSlices/navigationSlice'
import { saveTotalFishHolding } from '../../redux/reducers/markRecaptureSlices/releaseTrialSlice'
import { AppDispatch, RootState } from '../../redux/store'
import CustomModalHeader from '../Shared/CustomModalHeader'
import FishHoldingCard from './FishHoldingCard'

const FishHoldingModalContent = ({
  fishStore,
  handleMarkFishFormSubmit,
  closeModal,
}: {
  fishStore: FishStoreI
  handleMarkFishFormSubmit?: any
  closeModal: any
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const [selectedFishStore, setSelectedFishStore] = useState({} as any)
  const [selectedLifeStages, setSelectedLifeStages] = useState([] as Array<any>)
  const [selectedRuns, setSelectedRuns] = useState([] as Array<any>)
  const [totalFish, setTotalFish] = useState(0 as number)

  const navigation: any = useNavigation()

  useEffect(() => {
    setSelectedLifeStagesAndRuns()
  }, [])

  useEffect(() => {
    calculateTotalFish()
  }, [selectedFishStore])

  const setSelectedLifeStagesAndRuns = () => {
    const lifeStagesNamesArray: string[] = []
    const runNamesArray: string[] = []
    const tempSelectedFishStore = {} as any

    //for each fish in the fish Store
    for (const fish in fishStore) {
      //only add fish that are marked for recapture
      if (!fishStore[fish].willBeUsedInRecapture) continue

      //do not add yolk sac fry to store
      if (fishStore[fish].lifeStage === 'yolk sac fry') continue

      //add remaining fish objects to selectedFishStore
      tempSelectedFishStore[fish] = fishStore[fish]

      //add to the temp store arr
      lifeStagesNamesArray.push(fishStore[fish].lifeStage)
      runNamesArray.push(fishStore[fish].run)
    }
    //set the temp fish store the state
    setSelectedFishStore(tempSelectedFishStore)

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
    // setSelectedFishStore(selectedFishStoreCopy)
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
    setSelectedLifeStagesAndRuns()
    calculateTotalFish()
  }

  const handleSubmit = () => {
    dispatch(saveTotalFishHolding(totalFish))
  }

  //render new cards when selected runs or lifeStages change
  const renderFishHoldingCards = useCallback(() => {
    return (
      <HStack space={10} justifyContent='center'>
        <FishHoldingCard
          cardContent={selectedRuns}
          handlePressRemoveBadge={handlePressRemoveBadge}
          cardTitle='Run'
        />
        <FishHoldingCard
          cardContent={selectedLifeStages}
          handlePressRemoveBadge={handlePressRemoveBadge}
          cardTitle='Life Stage'
        />
      </HStack>
    )
  }, [selectedRuns, selectedLifeStages])

  return (
    <>
      <CustomModalHeader
        headerText={'Fish Holding'}
        showHeaderButton={true}
        closeModal={closeModal}
        headerButton={
          <Button
            bg='primary'
            mx='2'
            px='10'
            shadow='3'
            onPress={() => {
              navigation.navigate('Trap Visit Form', {
                screen: 'Incomplete Sections',
              })
              dispatch(updateActiveStep(6))
              handleSubmit()
              closeModal()
            }}
          >
            <Text fontSize='xl' color='white'>
              Save
            </Text>
          </Button>
        }
      />
      <>
        <Divider my={2} thickness='3' />
        <VStack
          alignItems='center'
          paddingX='10'
          paddingTop='7'
          paddingBottom='3'
          space={5}
        >
          <Heading color='black' fontSize='2xl'>
            Which fish are you holding for mark recapture Trials?
          </Heading>
          <HStack m='2%' space={10}>
            <Button
              bg='primary'
              alignSelf='flex-start'
              shadow='5'
              onPress={handleClearAll}
            >
              <Text fontWeight='bold' color='white'>
                Clear all, I am not holding any fish.
              </Text>
            </Button>
            <Button
              bg='primary'
              alignSelf='flex-start'
              shadow='5'
              onPress={handleResetAll}
            >
              <Text fontWeight='bold' color='white'>
                Reset All
              </Text>
            </Button>
            {/* <Button
              bg='primary'
              alignSelf='flex-start'
              shadow='5'
              onPress={() =>
                console.log('selectedFishStore: ', selectedFishStore)
              }
            >
              <Text fontWeight='bold' color='white'>
                Log selectedFishStore
              </Text>
            </Button> */}
          </HStack>
          {renderFishHoldingCards()}
          {/* this margin needs to be changed */}
          <Heading mt='-10'>Total Fish Holding: {totalFish}</Heading>
        </VStack>
      </>
    </>
  )
}

const mapStateToProps = (state: RootState) => {
  return {
    fishStore: state.fishInput.fishStore,
  }
}

export default connect(mapStateToProps)(FishHoldingModalContent)
