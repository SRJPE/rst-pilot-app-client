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
import {
  Animated,
  Dimensions,
  FlatList,
  Pressable,
  StatusBar,
} from 'react-native'
import type { NavigationState, SceneRendererProps } from 'react-native-tab-view'
import { SceneMap, TabView } from 'react-native-tab-view'
import { connect, useDispatch, useSelector } from 'react-redux'
import { FishDetailPopover } from './FishDetailPopover'
import MultiSpeciesChartTab from './MultiSpeciesChartTab'

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

  const filterStoreBySpecies = (fishValues: any[], species: string) => {
    return fishValues.filter(fish => fish.species === species)
  }

  //! Previously entered fish original implementation
  // const previouslyEnteredFish = useMemo(() => {
  //   if (!activeTabId) return []

  //   return Object.values(fishInputSlice[activeTabId]?.fishStore || [])
  //     .filter(fishRecord => fishRecord.species === speciesRadioValue)
  //     .reduce((acc: any[], fishRecord) => {
  //       if (fishRecord.numFishCaught === 1) {
  //         acc.push(fishRecord)
  //       }

  //       if (fishRecord.numFishCaught > 1) {
  //         const updatedFishEntries = Array.from(
  //           { length: fishRecord.numFishCaught },
  //           (fishRecordValues, i) => ({
  //             ...fishRecord,
  //             numFishCaught: 1,
  //           })
  //         )
  //         acc.push(...updatedFishEntries)
  //       }

  //       return acc
  //     }, [])
  // }, [fishInputSlice, activeTabId, speciesRadioValue, tabIndex])

  const previouslyEnteredFish = useSelector((state: RootState) => {
    if (!activeTabId) return []
    const fishStore = state.fishInput[activeTabId]?.fishStore || {}
    const fishArray = Object.values(fishStore)
    const filteredFish = filterStoreBySpecies(fishArray, speciesRadioValue)

    return filteredFish
  })

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

    return '0'
  }, [batchCountStore.forkLengths, speciesRadioValue])

  const [routes, setRoutes] = useState<Array<TabNavigationRoute>>([])
  //! Previous implementation with useState and useEffect
  // const [combinedFishObj, setCombinedFishObj] = useState<Record<string, any[]>>(
  //   {}
  // )
  // const [groupedForkLengths, setGroupedForkLengths] = useState<
  //   Record<string, any[]>
  // >({})

  // const [groupedPreviouslyEnteredFish, setGroupedPreviouslyEnteredFish] =
  //   useState<Record<string, any[]>>({})

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

  const groupedPreviouslyEnteredFish = useMemo(() => {
    return groupForkLengthsBySpecies(previouslyEnteredFish)
  }, [previouslyEnteredFish])

  const groupedForkLengths = useMemo(() => {
    return groupForkLengthsBySpecies(forkLengths)
  }, [forkLengths])

  const combinedFishObj = useMemo(() => {
    const combinedEnteredFish: Record<string, any[]> = {}

    console.log(
      '🚀 ~ MultiSpeciesBatchChart.tsx:168 ~ MultiSpeciesBatchChart ~ groupedPreviouslyEnteredFish:',
      groupedPreviouslyEnteredFish
    )
    for (const key in groupedPreviouslyEnteredFish) {
      combinedEnteredFish[key] = (combinedEnteredFish[key] || []).concat(
        groupedPreviouslyEnteredFish[key]
      )
    }

    console.log(
      '🚀 ~ MultiSpeciesBatchChart.tsx:176 ~ MultiSpeciesBatchChart ~ groupedForkLengths:',
      groupedForkLengths
    )
    for (const key in groupedForkLengths) {
      combinedEnteredFish[key] = (combinedEnteredFish[key] || []).concat(
        groupedForkLengths[key]
      )
    }

    return combinedEnteredFish
  }, [groupedForkLengths, groupedPreviouslyEnteredFish])
  console.log(
    '🚀 ~ MultiSpeciesBatchChart.tsx:182 ~ MultiSpeciesBatchChart ~ combinedFishObj:',
    combinedFishObj
  )

  //! Previous implementation with useState and useEffect
  // useEffect(() => {
  //   // const groupedPreviouslyEnteredFish = groupForkLengthsBySpecies(
  //   //   previouslyEnteredFish
  //   // )
  //   // setGroupedPreviouslyEnteredFish(groupedPreviouslyEnteredFish)
  //   // const groupedForkLengths = groupForkLengthsBySpecies(forkLengths)
  //   // setGroupedForkLengths(groupedForkLengths)

  //   const combinedEnteredFish: Record<string, any[]> = {}
  //   for (const key in groupedForkLengths) {
  //     combinedEnteredFish[key] = groupedForkLengths[key].slice() // shallow copy to avoid mutation
  //   }

  //   for (const key in groupedPreviouslyEnteredFish) {
  //     combinedEnteredFish[key] = (combinedEnteredFish[key] || []).concat(
  //       groupedPreviouslyEnteredFish[key]
  //     )
  //   }

  //   setCombinedFishObj(combinedEnteredFish)
  // }, [previouslyEnteredFish, forkLengths])

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

  const totalSlots = 50
  const fishCount = groupedPreviouslyEnteredFish[activeSpeciesTab]?.length || 0
  const remainingSlots = totalSlots - fishCount

  const slots = Array.from({ length: totalSlots }, (_, i) => {
    const cellData = combinedFishObj[activeSpeciesTab]?.[i] || DEFAULT_CELL
    return { index: i, cellData }
  })
  console.log(
    '🚀 ~ MultiSpeciesBatchChart.tsx:223 ~ MultiSpeciesBatchChart ~ slots:',
    slots
  )

  const renderScene = useMemo(() => {
    const scenes = selectedSpecies.reduce<TabAcc>((acc, species, index) => {
      acc[`tab-${index}`] = () => (
        <MultiSpeciesChartTab
          activeSpeciesTab={species}
          slots={slots}
          currentSpeciesPlusCount={currentSpeciesPlusCount}
          combinedFishObj={combinedFishObj}
        />
      )
      return acc
    }, {})

    return SceneMap(scenes)
  }, [selectedSpecies, slots, combinedFishObj, currentSpeciesPlusCount])

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
                    setTabIndex(i)
                    setSpeciesRadioValue(route.title)
                  }}
                >
                  <Box
                    borderBottomWidth='3'
                    borderColor={borderColor}
                    minWidth={200}
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
          renderScene={renderScene}
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
