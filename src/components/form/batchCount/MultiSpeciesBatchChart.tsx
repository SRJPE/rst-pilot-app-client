import type { batchCountI } from '@/src/redux/reducers/formSlices/batchCountSlice'
import { InitialStateI } from '@/src/redux/reducers/formSlices/fishInputSlice'
import { TabStateI } from '@/src/redux/reducers/formSlices/tabSlice'
import { RootState } from '@/src/redux/store'

import {
  Box,
  Center,
  HStack,
  NativeBaseProvider,
  ScrollView,
  Text,
  useColorModeValue,
  Checkbox,
} from 'native-base'
import React, {
  ComponentType,
  memo,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react'
import { Animated, Dimensions, Pressable, StatusBar } from 'react-native'
import type { NavigationState, SceneRendererProps } from 'react-native-tab-view'
import { TabView } from 'react-native-tab-view'
import { connect, useSelector, shallowEqual } from 'react-redux'
import MultiSpeciesChartTab from './MultiSpeciesChartTab'

type TabNavigationRoute = { key: string; title: string }
type TabAcc = { [key: string]: ComponentType<unknown> }

const initialLayout = {
  width: Dimensions.get('window').width,
}

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

function groupForkLengthsBySpecies(
  data: Record<string, any>
): Record<string, any[]> {
  const result: Record<string, any[]> = {}
  for (const item of Object.values(data)) {
    if (!item?.species || typeof Number(item.forkLength) !== 'number') continue
    if (!result[item.species]) result[item.species] = []
    if (
      typeof Number(item.numFishCaught) === 'number' &&
      Number(item.numFishCaught) > 1
    ) {
      for (let i = 0; i < item.numFishCaught; i++) {
        result[item.species].push({ ...item })
      }
    } else {
      result[item.species].push(item)
    }
  }
  return result
}

const MultiSpeciesBatchChart = ({
  batchCountStore,
  tabSlice,
  speciesRadioValue,
  setSpeciesRadioValue,
  tabIndex,
  setTabIndex,
  fishInputSlice,
  fishMeasureCounts = {},
  fishMeasureProtocol = {},
}: {
  tabIndex: number
  setTabIndex: (index: number) => void
  speciesRadioValue: string
  setSpeciesRadioValue: (value: string) => void
  batchCountStore: batchCountI
  tabSlice: TabStateI
  fishInputSlice: InitialStateI
  fishMeasureCounts?: Record<string, any>
  fishMeasureProtocol?: Record<any, any>
}) => {
  console.log('tabSlice', tabSlice)
  const activeTabId = tabSlice?.activeTabId || 'placeholderId'

  const getRows = (activeSpeciesTab: string) => {
    const individualFish = combinedFishObj?.[activeSpeciesTab]?.filter(
      item => !item.plusCount
    )
    const rows = individualFish ? Math.ceil(individualFish.length / 10) : 1
    return rows
  }

  // ✅ Redux selector optimized with shallowEqual
  const previouslyEnteredFish = useSelector((state: RootState) => {
    if (!activeTabId) return []
    const fishStore = state.fishInput[activeTabId]?.fishStore || {}
    return Object.values(fishStore).filter(
      (fish: any) => fish.species === speciesRadioValue
    )
  }, shallowEqual)

  // ✅ Efficient calculation (no intermediate arrays)
  const currentSpeciesPlusCount = useMemo(() => {
    const combinedPlusCountTotal =
      fishMeasureCounts[speciesRadioValue]?.plusCount || 0

    return String(combinedPlusCountTotal || 0)
  }, [batchCountStore.forkLengths, speciesRadioValue, fishMeasureCounts])

  const currentSpeciesMeasuredCount = useMemo(() => {
    const combinedMeasuredCountTotal =
      fishMeasureCounts[speciesRadioValue]?.individualCount || 0

    return String(combinedMeasuredCountTotal || 0)
  }, [batchCountStore.forkLengths, speciesRadioValue, fishMeasureCounts])

  const [routes, setRoutes] = useState<Array<TabNavigationRoute>>([])
  const [fallToggle, setFallToggle] = useState(true)
  const [lateFallToggle, setLateFallToggle] = useState(true)
  const [springToggle, setSpringToggle] = useState(true)
  const [winterToggle, setWinterToggle] = useState(true)
  const [hybridToggle, setHybridToggle] = useState(true)

  const forkLengths = useMemo(
    () => batchCountStore?.forkLengths || {},
    [batchCountStore?.forkLengths]
  )
  const selectedSpecies = useMemo(
    () => batchCountStore?.batchCharacteristics?.multiSpecies || [],
    [batchCountStore?.batchCharacteristics?.multiSpecies]
  )

  const groupedPreviouslyEnteredFish = useMemo(
    () => groupForkLengthsBySpecies(previouslyEnteredFish),
    [previouslyEnteredFish]
  )

  const groupedForkLengths = useMemo(
    () => groupForkLengthsBySpecies(forkLengths),
    [forkLengths]
  )

  const combinedFishObj = useMemo(() => {
    const combined: Record<string, any[]> = {}
    for (const key in groupedPreviouslyEnteredFish) {
      combined[key] = (combined[key] || []).concat(
        groupedPreviouslyEnteredFish[key]
      )
    }
    for (const key in groupedForkLengths) {
      combined[key] = (combined[key] || []).concat(groupedForkLengths[key])
    }
    return combined
  }, [groupedForkLengths, groupedPreviouslyEnteredFish])

  const activeSpeciesTab = routes[tabIndex]?.title
  const totalSlots = 50

  const slots = useMemo(() => {
    const rows = getRows(activeSpeciesTab)
    let protocolSlots = fishMeasureProtocol[activeSpeciesTab] || totalSlots

    if (
      activeSpeciesTab &&
      activeSpeciesTab.toLocaleLowerCase().includes('chinook') &&
      rows * 10 > protocolSlots
    ) {
      protocolSlots = rows * 10
    }

    let fishCellData = combinedFishObj[activeSpeciesTab] || []

    if (
      activeSpeciesTab &&
      activeSpeciesTab.toLocaleLowerCase().includes('chinook')
    ) {
      const filteredFishByRun = combinedFishObj?.[activeSpeciesTab]?.filter(
        item => {
          const toggledRuns = []
          if (fallToggle) toggledRuns.push('fall')
          if (lateFallToggle) toggledRuns.push('late fall')
          if (springToggle) toggledRuns.push('spring')
          if (winterToggle) toggledRuns.push('winter')
          if (hybridToggle) toggledRuns.push('hybrid')

          return (
            toggledRuns.includes(item.runDefinition) ||
            toggledRuns.includes(item.run)
          )
        }
      )
      fishCellData = filteredFishByRun || []
    }

    return Array.from({ length: protocolSlots }, (_, i) => {
      const cellData = fishCellData[i] || DEFAULT_CELL
      return { index: i, cellData }
    })
  }, [
    combinedFishObj,
    activeSpeciesTab,
    fishMeasureProtocol,
    fallToggle,
    springToggle,
    winterToggle,
    lateFallToggle,
    hybridToggle,
  ])

  // ✅ Memoized renderScene
  const renderScene = useCallback(
    ({ route }: { route: TabNavigationRoute }) => (
      <MultiSpeciesChartTab
        species={route.title}
        activeTab={route.key}
        slots={slots}
        currentSpeciesPlusCount={currentSpeciesPlusCount}
        currentSpeciesMeasuredCount={currentSpeciesMeasuredCount}
        combinedFishObj={combinedFishObj}
      />
    ),
    [
      slots,
      currentSpeciesPlusCount,
      currentSpeciesMeasuredCount,
      combinedFishObj,
    ]
  )

  // ✅ Memoized renderTabBar
  const renderTabBar = useCallback(
    (
      props: SceneRendererProps & {
        navigationState: NavigationState<TabNavigationRoute>
      }
    ) => (
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
                    <Animated.Text style={{ color }}>
                      {route.title}
                    </Animated.Text>
                  </Box>
                </Pressable>
              )
            }
          )}
        </ScrollView>
      </Box>
    ),
    [tabIndex, setTabIndex, setSpeciesRadioValue]
  )

  // Build routes once per species change
  useEffect(() => {
    const newRoutes = selectedSpecies.map((species: string, i: number) => ({
      key: `tab-${i}`,
      title: species,
    }))
    setRoutes(newRoutes)
  }, [selectedSpecies])

  // Update tab index when speciesRadioValue changes
  useEffect(() => {
    const spvTabIndex = routes.findIndex(
      route => route.title === speciesRadioValue
    )
    setTabIndex(spvTabIndex >= 0 ? spvTabIndex : 0)
  }, [speciesRadioValue, routes, setTabIndex])

  const getChartHeight = (activeSpeciesTab: string) => {
    const rows = getRows(activeSpeciesTab)
    if (
      activeSpeciesTab &&
      activeSpeciesTab.toLocaleLowerCase().includes('chinook') &&
      rows > 5
    )
      return 420 + (rows - 5) * 50

    if (fishMeasureProtocol[activeSpeciesTab]) {
      const baseHeight = 170
      return (
        baseHeight + Math.ceil(fishMeasureProtocol[activeSpeciesTab] / 10) * 50
      )
    }
    return 420
  }

  const handleToggles = (toggleName: string) => {
    switch (toggleName) {
      case 'fall':
        setFallToggle(!fallToggle)
        break
      case 'late fall':
        setLateFallToggle(!lateFallToggle)
        break
      case 'spring':
        setSpringToggle(!springToggle)
        break
      case 'winter':
        setWinterToggle(!winterToggle)
        break
      case 'hybrid':
        setHybridToggle(!hybridToggle)
        break

      default:
        break
    }
  }

  return (
    <Center flex={1} px='3'>
      <TabView
        navigationState={{ index: tabIndex, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setTabIndex}
        initialLayout={initialLayout}
        style={{
          marginTop: StatusBar.currentHeight,
          height: getChartHeight(activeSpeciesTab),
          width: '100%',
        }}
        lazy
        renderLazyPlaceholder={() => (
          <Center flex={1}>
            <Text>Loading...</Text>
          </Center>
        )}
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
      {activeSpeciesTab?.toLocaleLowerCase()?.includes('chinook') &&
        !tabSlice?.tabs?.[activeTabId]?.name
          .toLowerCase()
          .includes('butte') && (
          <Box px='2%' mb={3} w='100%'>
            <Text bold mb={2}>
              Filter Table by Run:
            </Text>
            <HStack space={3} alignItems='center'>
              <HStack alignItems='center' space={4}>
                <HStack space={2}>
                  <Checkbox
                    value='fall'
                    isChecked={fallToggle}
                    shadow='3'
                    _checked={{
                      bg: 'primary',
                      borderColor: 'primary',
                    }}
                    size='md'
                    onChange={() => handleToggles('fall')}
                  />
                  <Text fontSize='16'>Fall</Text>
                </HStack>
                <HStack space={2}>
                  <Checkbox
                    value='late fall'
                    isChecked={lateFallToggle}
                    shadow='3'
                    _checked={{
                      bg: 'primary',
                      borderColor: 'primary',
                    }}
                    size='md'
                    onChange={() => handleToggles('late fall')}
                  />
                  <Text fontSize='16'>Late Fall</Text>
                </HStack>
                <HStack space={2}>
                  <Checkbox
                    value='spring'
                    isChecked={springToggle}
                    shadow='3'
                    _checked={{
                      bg: 'primary',
                      borderColor: 'primary',
                    }}
                    size='md'
                    onChange={() => handleToggles('spring')}
                  />
                  <Text fontSize='16'>Spring</Text>
                </HStack>
                <HStack space={2}>
                  <Checkbox
                    value='winter'
                    isChecked={winterToggle}
                    shadow='3'
                    _checked={{
                      bg: 'primary',
                      borderColor: 'primary',
                    }}
                    size='md'
                    onChange={() => handleToggles('winter')}
                  />
                  <Text fontSize='16'>Winter</Text>
                </HStack>
                <HStack space={2}>
                  <Checkbox
                    value='hybrid'
                    isChecked={hybridToggle}
                    shadow='3'
                    _checked={{
                      bg: 'primary',
                      borderColor: 'primary',
                    }}
                    size='md'
                    onChange={() => handleToggles('hybrid')}
                  />
                  <Text fontSize='16'>Hybrid</Text>
                </HStack>
              </HStack>
            </HStack>
          </Box>
        )}
    </Center>
  )
}

const mapStateToProps = (state: RootState) => ({
  tabSlice: state.tabSlice,
  batchCountStore: state.batchCount,
  fishInputSlice: state.fishInput,
})

export default connect(mapStateToProps)(memo(MultiSpeciesBatchChart))
