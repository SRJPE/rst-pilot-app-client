import type { batchCountI } from '@/src/redux/reducers/formSlices/batchCountSlice'
import { InitialStateI } from '@/src/redux/reducers/formSlices/fishInputSlice'
import { TabStateI } from '@/src/redux/reducers/formSlices/tabSlice'

import { removeForkLengthByUID } from '@/src/redux/reducers/formSlices/batchCountSlice'
import { AppDispatch, RootState } from '@/src/redux/store'
import {
  Box,
  Center,
  HStack,
  NativeBaseProvider,
  ScrollView,
  Text,
  useColorModeValue,
} from 'native-base'
import React, { ComponentType, memo, useEffect, useMemo, useState } from 'react'
import { Animated, Dimensions, Pressable, StatusBar } from 'react-native'
import type { NavigationState, SceneRendererProps } from 'react-native-tab-view'
import { SceneMap, TabView } from 'react-native-tab-view'
import { connect, useDispatch } from 'react-redux'
import { FishDetailPopover } from './FishDetailPopover'

type TabNavigationRoute = { key: string; title: string }
type TabAcc = {
  [key: string]: ComponentType<unknown>
}

const initialLayout = {
  width: Dimensions.get('window').width,
}

const MultiSpeciesBatchChart = ({
  batchCountStore,
  tabSlice,
  speciesRadioValue,
  setSpeciesRadioValue,
  tabIndex,
  setTabIndex,
  fishInputSlice,
  fishMeasureCounts = {}, // Default to empty object if not provided
}: {
  tabIndex: number
  setTabIndex: (index: number) => void
  speciesRadioValue: string
  setSpeciesRadioValue: (value: string) => void
  batchCountStore: batchCountI
  tabSlice: TabStateI
  fishInputSlice: InitialStateI
  fishMeasureCounts?: Record<string, any>
}) => {
  const activeTabId = tabSlice?.activeTabId || 'placeholderId'

  const previouslyEnteredFish = useMemo(() => {
    if (!activeTabId) return []

    return Object.values(fishInputSlice[activeTabId]?.fishStore || [])
      .filter(fishRecord => fishRecord.species === speciesRadioValue)
      .reduce((acc: any[], fishRecord) => {
        if (fishRecord.numFishCaught === 1) {
          acc.push(fishRecord)
        }

        if (fishRecord.numFishCaught > 1) {
          const updatedFishEntries = Array.from(
            { length: fishRecord.numFishCaught },
            (fishRecordValues, i) => ({
              ...fishRecord,
              numFishCaught: 1,
            })
          )
          acc.push(...updatedFishEntries)
        }

        return acc
      }, [])
  }, [fishInputSlice, activeTabId, speciesRadioValue, tabIndex])

  const currentSpeciesPlusCount = useMemo(() => {
    const plusCountValues = Object.values(
      batchCountStore.forkLengths || []
    ).filter(fish => fish.species === speciesRadioValue && fish.plusCount)

    const existingPlusCountTotal =
      fishMeasureCounts[speciesRadioValue]?.plusCount || 0

    const currentPlusCountTotal = plusCountValues.reduce(
      (acc, fish) => acc + (fish.numFishCaught || 0),
      0
    )

    if (currentPlusCountTotal + existingPlusCountTotal > 0) {
      return `${existingPlusCountTotal}`
    }

    return 'Not Entered Yet'
  }, [batchCountStore.forkLengths, speciesRadioValue])

  const [routes, setRoutes] = useState<Array<TabNavigationRoute>>([])

  const activeSpeciesTab = routes[tabIndex]?.title

  const forkLengths = useMemo(() => {
    return batchCountStore?.forkLengths || {}
  }, [batchCountStore?.forkLengths])

  const selectedSpecies = useMemo(() => {
    return batchCountStore?.batchCharacteristics?.multiSpecies || []
  }, [batchCountStore?.batchCharacteristics?.multiSpecies])

  function groupForkLengthsBySpecies(
    data: Record<string, any>
  ): Record<string, any[]> {
    const result: Record<string, any[]> = {}

    Object.values(data).forEach((item: any) => {
      if (!item.species || typeof item.forkLength !== 'number') return
      if (!result[item.species]) {
        result[item.species] = []
      }
      result[item.species].push(item)
    })

    return result
  }

  const groupedPreviouslyEnteredFish = groupForkLengthsBySpecies(
    previouslyEnteredFish
  )

  const groupedForkLengths = groupForkLengthsBySpecies(forkLengths)
  console.log(
    '🚀 ~ MultiSpeciesBatchChart.tsx:141 ~ groupedForkLengths:',
    groupedForkLengths
  )
  const DEFAULT_CELL = {
    forkLength: null,
    dead: false,
    existingMark: false,
    fishConditions: [],
    lifeStage: null,
    runDefinition: null,
    species: '',
    taxonCode: null,
    uid: null,
  }

  const renderScene = () => {
    const scenes = selectedSpecies.reduce<TabAcc>((acc, species, index) => {
      acc[`tab-${index}`] = () => (
        <Box
          flex={1}
          my='4'
          display={'flex'}
          flexDirection={'row'}
          borderWidth={1}
          flexWrap={'wrap'}
          borderRadius={15}
          // overflow='hidden'
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <Box
              key={i}
              flex={1}
              flexBasis={'9.5%'}
              h={41}
              borderWidth={1}
              background='gray.200'
            >
              <Center h={'full'} w={'full'}>
                <Text fontSize={18} bold>
                  {i + 1}
                </Text>
              </Center>
            </Box>
          ))}
          {Array.from({
            length: groupedPreviouslyEnteredFish[activeSpeciesTab]?.length,
          }).map((_, i) => {
            const existingFishCellData =
              groupedPreviouslyEnteredFish[activeSpeciesTab]?.at(i) ||
              DEFAULT_CELL

            return (
              <Box key={i} flex={1} flexBasis={'9.5%'} h={50}>
                <FishDetailPopover
                  cellData={existingFishCellData}
                  // onRemove={() => dispatch(removeForkLengthByUID(cellData.uid))}
                />
              </Box>
            )
          })}

          {Array.from({
            length:
              50 -
              (groupedPreviouslyEnteredFish[activeSpeciesTab]?.length || 0),
          }).map((_, i) => {
            const cellData =
              groupedForkLengths[activeSpeciesTab]?.at(i) || DEFAULT_CELL

            return cellData.uid ? (
              <Box
                key={cellData.uid}
                flex={1}
                flexBasis={'9.5%'}
                h={50}
                position='relative'
              >
                <FishDetailPopover
                  cellData={cellData}
                  onRemove={() => dispatch(removeForkLengthByUID(cellData.uid))}
                />
              </Box>
            ) : (
              <Box key={i} flex={1} flexBasis={'9.5%'} h={50}>
                <Center
                  borderWidth={1}
                  h={'full'}
                  w={'full'}
                  background={'white'}
                >
                  <Text fontSize={18}>{''}</Text>
                </Center>
              </Box>
            )
          })}
          <HStack w='full' background='gray.200'>
            <Text fontSize={18} p={3} display='flex'>
              <Text bold>Species:</Text>
              <Text> </Text>
              <Text>{activeSpeciesTab}</Text>
            </Text>
            <Text fontSize={18} p={3} display='flex'>
              <Text bold>Measured Count:</Text>
              <Text> </Text>
              <Text>{groupedForkLengths[activeSpeciesTab]?.length || 0}</Text>
            </Text>
            <Text fontSize={18} p={3} display='flex'>
              <Text bold>Plus Count:</Text>
              <Text> </Text>
              <Text>{currentSpeciesPlusCount}</Text>
            </Text>
          </HStack>
        </Box>
      )
      return acc
    }, {})

    return SceneMap(scenes)
  }

  useEffect(() => {
    const newRoutes = selectedSpecies.map((species: string, i: number) => ({
      key: `tab-${i}`,
      title: species,
    }))
    setRoutes(newRoutes)
  }, [selectedSpecies])

  useEffect(() => {
    const spvTabIndex = routes.findIndex(
      route => route.title === speciesRadioValue
    )

    setTabIndex(spvTabIndex >= 0 ? spvTabIndex : 0)
  }, [speciesRadioValue])

  const renderTabBar = (
    props: SceneRendererProps & {
      navigationState: NavigationState<TabNavigationRoute>
    }
  ) => {
    return (
      <Box flexDirection='row'>
        <ScrollView horizontal>
          {props.navigationState.routes.map(
            (route: TabNavigationRoute, i: number) => {
              const color =
                tabIndex === i
                  ? useColorModeValue('#000', '#e5e5e5')
                  : useColorModeValue('#1f2937', '#a1a1aa')
              const borderColor =
                tabIndex === i
                  ? 'cyan.500'
                  : useColorModeValue('coolGray.200', 'gray.400')
              return (
                <Pressable
                  key={route.key}
                  onPress={() => {
                    console.log(i)
                    setTabIndex(i)
                    setSpeciesRadioValue(route.title)
                  }}
                >
                  <Box
                    borderBottomWidth='3'
                    borderColor={borderColor}
                    width={200}
                    alignItems='center'
                    p='3'
                  >
                    <Animated.Text
                      style={{
                        color,
                      }}
                    >
                      {route.title}
                    </Animated.Text>
                  </Box>
                </Pressable>
              )
            }
          )}
        </ScrollView>
      </Box>
    )
  }

  const dispatch = useDispatch<AppDispatch>()

  return (
    <NativeBaseProvider>
      <Center flex={1} px='3'>
        <TabView
          navigationState={{
            index: tabIndex,
            routes,
          }}
          renderScene={renderScene()}
          renderTabBar={renderTabBar}
          onIndexChange={setTabIndex}
          initialLayout={initialLayout}
          style={{
            marginTop: StatusBar.currentHeight,
            height: 420,
            width: '100%',
          }}
        />
        <HStack space={5} justifyContent='center' mb={3}>
          <HStack space={2}>
            <Box
              h={5}
              w={8}
              borderWidth={2}
              borderRadius='50%'
              borderColor='black'
            />
            <Text>Dead</Text>
          </HStack>
        </HStack>
      </Center>
    </NativeBaseProvider>
  )
}

const mapStateToProps = (state: RootState) => {
  return {
    tabSlice: state.tabSlice,
    batchCountStore: state.batchCount,
    fishInputSlice: state.fishInput,
  }
}

export default connect(mapStateToProps)(memo(MultiSpeciesBatchChart))
