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

  const [routes, setRoutes] = useState<Array<TabNavigationRoute>>([])

  const forkLengths = useMemo(
    () => batchCountStore?.forkLengths || {},
    [batchCountStore?.forkLengths]
  )
  const selectedSpecies = useMemo(
    () => batchCountStore?.batchCharacteristics?.multiSpecies || [],
    [batchCountStore?.batchCharacteristics?.multiSpecies]
  )

  console.log('previouslyEnteredFish', previouslyEnteredFish)

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
      console.log(
        'groupedPreviouslyEnteredFish[key]',
        groupedPreviouslyEnteredFish[key]
      )
      combined[key] = (combined[key] || []).concat(
        groupedPreviouslyEnteredFish[key]
      )
    }
    for (const key in groupedForkLengths) {
      combined[key] = (combined[key] || []).concat(groupedForkLengths[key])
    }
    console.log('combined', combined)
    return combined
  }, [groupedForkLengths, groupedPreviouslyEnteredFish])

  const activeSpeciesTab = routes[tabIndex]?.title
  const totalSlots = 50

  const slots = useMemo(() => {
    return Array.from({ length: totalSlots }, (_, i) => {
      const cellData = combinedFishObj[activeSpeciesTab]?.[i] || DEFAULT_CELL
      return { index: i, cellData }
    })
  }, [combinedFishObj, activeSpeciesTab])

  // ✅ Memoized renderScene
  const renderScene = useCallback(
    ({ route }: { route: TabNavigationRoute }) => (
      <MultiSpeciesChartTab
        species={route.title}
        activeTab={route.key}
        slots={slots}
        currentSpeciesPlusCount={currentSpeciesPlusCount}
        combinedFishObj={combinedFishObj}
      />
    ),
    [slots, currentSpeciesPlusCount, combinedFishObj]
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

  return (
    <NativeBaseProvider>
      <Center flex={1} px='3'>
        <TabView
          navigationState={{ index: tabIndex, routes }}
          renderScene={renderScene}
          renderTabBar={renderTabBar}
          onIndexChange={setTabIndex}
          initialLayout={initialLayout}
          style={{
            marginTop: StatusBar.currentHeight,
            height: 420,
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
      </Center>
    </NativeBaseProvider>
  )
}

const mapStateToProps = (state: RootState) => ({
  tabSlice: state.tabSlice,
  batchCountStore: state.batchCount,
  fishInputSlice: state.fishInput,
})

export default connect(mapStateToProps)(memo(MultiSpeciesBatchChart))
