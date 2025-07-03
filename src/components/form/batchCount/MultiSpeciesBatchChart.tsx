import React, { memo, useCallback, useState, useMemo, useEffect } from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  Animated,
  Pressable,
} from 'react-native'
import { connect, useDispatch } from 'react-redux'
import { TabView, SceneMap } from 'react-native-tab-view'
import {
  NativeBaseProvider,
  Box,
  Text,
  Center,
  useColorModeValue,
  HStack,
} from 'native-base'
import Constants from 'expo-constants'
import { ScrollView } from 'native-base'
import { AppDispatch, RootState } from '@/src/redux/store'
import type { BatchStoreI } from '@/src/redux/reducers/formSlices/batchCountSlice'
import { TabStateI } from '@/src/redux/reducers/formSlices/tabSlice'

const FirstRoute = () => (
  <Center flex={1} my='4'>
    <Text>This is Tab 1</Text>
  </Center>
)

const SecondRoute = () => (
  <Center flex={1} my='4'>
    <Text>This is Tab 2</Text>
  </Center>
)

const ThirdRoute = () => (
  <Center flex={1} my='4'>
    <Text>This is Tab 3</Text>
  </Center>
)

const FourthRoute = () => (
  <Center flex={1} my='4'>
    <Text>This is Tab 4 </Text>
  </Center>
)

const FifthRoute = () => (
  <Center flex={1} my='4'>
    <Text>This is Tab 5</Text>
  </Center>
)
const SixthRoute = () => (
  <Center flex={1} my='4'>
    <Text>This is Tab 6</Text>
  </Center>
)
const SeventhRoute = () => (
  <Center flex={1} my='4'>
    <Text>This is Tab 7</Text>
  </Center>
)
const EighthRoute = () => (
  <Center flex={1} my='4'>
    <Text>This is Tab 8</Text>
  </Center>
)

const initialLayout = {
  width: Dimensions.get('window').width,
}
// const renderScene = SceneMap({
//   first: FirstRoute,
//   second: SecondRoute,
//   third: ThirdRoute,
//   fourth: FourthRoute,
//   fifth: FifthRoute,
//   sixth: SixthRoute,
//   seventh: SeventhRoute,
//   eighth: EighthRoute,
// })

const MultiSpeciesBatchChart = ({
  batchCountStore,
  tabSlice,
}: {
  batchCountStore: BatchStoreI
  tabSlice: TabStateI
  // visitSetupState: any
}) => {
  const activeTabId = tabSlice?.activeTabId
  console.log('🚀 ~ MultiSpeciesBatchChart.tsx:188 ~ activeTabId:', activeTabId)
  const [index, setIndex] = React.useState(0)
  console.log('🚀 ~ MultiSpeciesBatchChart.tsx:97 ~ index:', index)

  const [routes, setRoutes] = useState([])
  const activeSpeciesTab = routes[index]?.title

  const forkLengths = useMemo(() => {
    return batchCountStore?.forkLengths || {}
  }, [batchCountStore?.forkLengths])

  const selectedSpecies = useMemo(() => {
    return batchCountStore?.batchCharacteristics?.multiSpecies || []
  }, [batchCountStore?.batchCharacteristics?.multiSpecies])

  function groupForkLengthsBySpecies(
    data: Record<string, any>
  ): Record<string, number[]> {
    const result: Record<string, number[]> = {}

    Object.values(data).forEach((item: any) => {
      if (!item.species || typeof item.forkLength !== 'number') return
      if (!result[item.species]) {
        result[item.species] = []
      }
      result[item.species].push(item.forkLength)
    })

    return result
  }

  const groupedForkLengths = groupForkLengthsBySpecies(forkLengths)
  console.log(
    '🚀 ~ MultiSpeciesBatchChart.tsx:130 ~ groupedForkLengths:',
    groupedForkLengths
  )
  console.log(
    '🚀 ~ MultiSpeciesBatchChart.tsx:99 ~ activeSpeciesTab:',
    activeSpeciesTab
  )

  const renderScene = () => {
    const scenes = selectedSpecies.reduce((acc, species, index) => {
      acc[`tab-${index}`] = () => (
        <Box
          flex={1}
          my='4'
          display={'flex'}
          style={{}}
          flexDirection={'row'}
          borderWidth={1}
          flexWrap={'wrap'}
        >
          {Array.from({ length: 30 }).map((_, i) => (
            <Box key={i} flex={1} flexBasis={'9.5%'} h={50} borderWidth={1}>
              <Center borderWidth={1} h={'full'} w={'full'}>
                <Text>{groupedForkLengths[activeSpeciesTab]?.at(i) || ''}</Text>
              </Center>
            </Box>
          ))}
        </Box>
      )
      return acc
    }, {})
    console.log(
      '🚀 ~ MultiSpeciesBatchChart.tsx:119 ~ scenes ~ scenes:',
      scenes
    )

    return SceneMap(scenes)
  }

  useEffect(() => {
    const newRoutes = selectedSpecies.map((species, i) => ({
      key: `tab-${i}`,
      title: species,
    }))
    setRoutes(newRoutes)
  }, [selectedSpecies])

  // output: { "Chinook salmon": [32, 33, 34, 35, 37], "Fathead minnow": [38, 39, 37, 36] }

  const renderTabBar = props => {
    const inputRange = props.navigationState.routes.map((x, i) => i)
    return (
      <Box flexDirection='row'>
        <ScrollView horizontal>
          {props.navigationState.routes.map((route, i) => {
            const opacity = props.position.interpolate({
              inputRange,
              outputRange: inputRange.map(inputIndex =>
                inputIndex === i ? 1 : 0.5
              ),
            })
            const color =
              index === i
                ? useColorModeValue('#000', '#e5e5e5')
                : useColorModeValue('#1f2937', '#a1a1aa')
            const borderColor =
              index === i
                ? 'cyan.500'
                : useColorModeValue('coolGray.200', 'gray.400')
            return (
              <Pressable
                onPress={() => {
                  console.log(i)
                  setIndex(i)
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
          })}
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
            index,
            routes,
          }}
          renderScene={renderScene()}
          renderTabBar={renderTabBar}
          onIndexChange={setIndex}
          initialLayout={initialLayout}
          style={{
            marginTop: StatusBar.currentHeight,
            height: 300,
            width: '100%',
          }}
        />
      </Center>
    </NativeBaseProvider>
  )
}

const mapStateToProps = (state: RootState) => {
  return {
    tabSlice: state.tabSlice,
    batchCountStore: state.batchCount,
    // visitSetupState: state.visitSetup,
  }
}

export default connect(mapStateToProps)(memo(MultiSpeciesBatchChart))
