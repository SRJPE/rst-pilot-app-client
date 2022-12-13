import { Ionicons } from '@expo/vector-icons'

import {
  Badge,
  Pressable,
  Box,
  HStack,
  Spacer,
  Text,
  Flex,
  VStack,
  AspectRatio,
  Center,
  Image,
  Stack,
  Heading,
  IconButton,
  Icon,
} from 'native-base'
import { useEffect, useState } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../redux/store'

const mapStateToProps = (state: RootState) => {
  return {
    individualFishStore: state.fishInput.individualFish,
  }
}

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
        height={'3/4'}
        bg='secondary'
        roundedBottom='xl'
      >
        {cardTitle === 'Run'
          ? dropdownValues?.run.map((item) => {
              return (
                <Badge
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
                    />
                  }
                >
                  {item.definition}
                </Badge>
              )
            })
          : selectedLifeStages.map((item) => {
              return (
                <Badge
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
                    />
                  }
                >
                  {item}
                </Badge>
              )
            })}
      </VStack>
    </Box>
  )
}
export default connect(mapStateToProps)(FishHoldingCard)
