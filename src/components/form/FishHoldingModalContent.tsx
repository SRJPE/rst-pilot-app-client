import { HStack, VStack, Text, Button, Divider, Heading } from 'native-base'
import { memo, useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { RootState } from '../../redux/store'
import CustomModalHeader from '../Shared/CustomModalHeader'
import FishHoldingCard from './FishHoldingCard'

const FishHoldingModalContent = ({
  individualFishStore,
  handleMarkFishFormSubmit,
  closeModal,
}: {
  individualFishStore: any
  handleMarkFishFormSubmit?: any
  closeModal: any
}) => {
  const [selectedLifeStages, setSelectedLifeStages] = useState([] as Array<any>)
  const [selectedRuns, setSelectedRuns] = useState([] as Array<any>)
  const [totalFish, setTotalFish] = useState(0 as number)

  useEffect(() => {
    setSelectedLifeStagesAndRuns()
    calculateTotalFish()
  }, [])

  const setSelectedLifeStagesAndRuns = () => {
    const lifeStagesStore = []
    const runsStore = []
    //for each fish in individualFish Array
    for (let currentFish of individualFishStore) {
      //do not add yolk sac fry to store
      if (currentFish.lifeStage === 'yolk sac fry') continue
      //add `to the temp store arr
      lifeStagesStore.push(currentFish.lifeStage)
      runsStore.push(currentFish.run)
    }
    //slickly remove duplicates and set state
    const lifeStagesSet = [...new Set(lifeStagesStore)]
    const runsSet = [...new Set(runsStore)]
    setSelectedLifeStages(lifeStagesSet)
    setSelectedRuns(runsSet)
  }
  const calculateTotalFish = () => {
    //this needs work ask Erin about functionality
    let count = 0
    for (let fish of individualFishStore) {
      //do not add yolk sac fry to count
      if (fish.lifeStage === 'yolk sac fry') continue
      if (fish.willBeUsedInRecapture) {
        count++
      }
    }
    setTotalFish(count)
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

  const handlePressRemoveBadge = (badgeToRemove: string, cardTitle: string) => {
    if (cardTitle === 'Run') {
      setSelectedRuns([...removeBadgeFromList(selectedRuns, badgeToRemove)])
    } else {
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

  const renderFishHoldingCards = () => {
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
  }

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
            // isDisabled={
            //   (touched && Object.keys(touched).length === 0) ||
            //   (errors && Object.keys(errors).length > 0)
            // }
            onPress={() => {
              // handleSubmit()
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
          // space={10}
          paddingX='10'
          paddingTop='7'
          paddingBottom='3'
        >
          <Heading color='black' fontSize='2xl' mb='5%'>
            Which fish are you holding for mark recapture Trials?
          </Heading>
          <HStack m='4' space={4}>
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
          </HStack>
          {renderFishHoldingCards()}
          <Heading>
            <Text>Total Fish Holding:</Text>
            {totalFish}
          </Heading>
        </VStack>
      </>
    </>
  )
}

const mapStateToProps = (state: RootState) => {
  return {
    individualFishStore: state.fishInput.individualFish,
  }
}

export default connect(mapStateToProps)(FishHoldingModalContent)
