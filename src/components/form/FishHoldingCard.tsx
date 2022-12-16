import { Ionicons } from '@expo/vector-icons'
import { memo, useCallback, useEffect, useState } from 'react'
import { Badge, Box, VStack, Center, Icon } from 'native-base'
import { connect, useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../redux/store'

const FishHoldingCard = ({
  cardTitle,
  individualFishStore,
}: {
  cardTitle: string
  individualFishStore: Array<any>
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const dropdownValues = useSelector(
    (state: RootState) => state.dropdowns.values
  )
  const [selectedLifeStages, setSelectedLifeStages] = useState([] as Array<any>)
  console.log('🚀 ~ FishHoldingCardRendered')

  //update selectedLifeStages when individualFishStore changes
  useEffect(() => {
    const lifeStagesStore = []
    //for each fish in individualFish Array
    //add to the temp store arr
    for (let currentFish of individualFishStore) {
      lifeStagesStore.push(currentFish.lifeStage)
    }
    //slickly remove duplicates and set state
    const lifeStagesSet = [...new Set(lifeStagesStore)]
    setSelectedLifeStages(lifeStagesSet)
  }, [individualFishStore])

  const handlePressRemoveBadge = (badgeToRemove: string) => {
    console.log('🚀 ~ handlePressRemoveBadge ~ badgeToRemove', badgeToRemove)

    //iterate over the selected life stages
    //find the selected button by its name
    //remove that item from the list
    //set the new selectedLifeStages
  }

  const renderFishHoldingCardContent = useCallback(() => {
    return cardTitle === 'Run'
      ? dropdownValues?.run.map((item, idx) => {
          return (
            <Badge
              key={idx}
              bg='themeOrange'
              alignSelf='center'
              justifyContent='space-between'
              width='70%'
              variant='solid'
              shadow='3'
              _text={{
                color: 'white',
                fontSize: '16',
              }}
              rightIcon={
                <Icon
                  as={Ionicons}
                  name={'close'}
                  size='lg'
                  color='white'
                  onPress={() => handlePressRemoveBadge(item.definition)}
                />
              }
            >
              {item.definition}
            </Badge>
          )
        })
      : selectedLifeStages.map((item, idx) => {
          return (
            <Badge
              key={idx}
              bg='themeOrange'
              alignSelf='center'
              justifyContent='space-between'
              width='70%'
              variant='solid'
              shadow='3'
              _text={{
                color: 'white',
                fontSize: '16',
              }}
              rightIcon={
                <Icon
                  as={Ionicons}
                  name={'close'}
                  size='lg'
                  color='white'
                  onPress={() => handlePressRemoveBadge(item)}
                />
              }
            >
              {item}
            </Badge>
          )
        })
  }, [cardTitle, selectedLifeStages])

  return (
    <Box w='40%' rounded='xl' overflow='hidden'>
      <Center
        bg='primary'
        _text={{
          alignSelf: 'center',
          color: '#FFF',
          fontWeight: '700',
          fontSize: 'xl',
        }}
        bottom='0'
        px='6'
        py='1.5'
      >
        {cardTitle}
      </Center>
      <VStack
        py='2%'
        px='4%'
        pt='4'
        space={4}
        overflow='hidden'
        height={'60%'}
        bg='secondary'
        roundedBottom='xl'
      >
        {renderFishHoldingCardContent()}
      </VStack>
    </Box>
  )
}

const mapStateToProps = (state: RootState) => {
  return {
    individualFishStore: state.fishInput.individualFish,
  }
}

export default connect(mapStateToProps)(memo(FishHoldingCard))
