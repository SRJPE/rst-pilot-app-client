import { HStack, View, Text, VStack } from 'native-base'
import { useEffect, useState } from 'react'
import { batch, connect } from 'react-redux'
import { RootState } from '../../../redux/store'
import {
  VictoryBar,
  VictoryChart,
  VictoryTheme,
  VictoryAxis,
  VictoryLabel,
  VictoryZoomContainer,
  VictoryTooltip,
} from 'victory-native'
import { reformatBatchCountData } from '../../../utils/utils'
import { capitalize } from 'lodash'

const BatchCountHistogram = ({
  forkLengthsStore,
  batchCountStore,
}: {
  forkLengthsStore: any
  batchCountStore: any
}) => {
  const prepareDataForGraph = () => {
    const reformatedBatchCountData = reformatBatchCountData(forkLengthsStore)
    const storageArray: { forkLength: number; count: number }[] = []

    reformatedBatchCountData &&
      Object.keys(reformatedBatchCountData).forEach((key: any) => {
        const count: number = Object.values(
          reformatedBatchCountData[key]
        ).reduce((a, b) => a + b)
        storageArray.push({
          forkLength: Number(key),
          count: count,
        })
      })

    setProcessedData(storageArray)
  }

  const padArrayWithMissingNumbers = (arr: number[]): number[] => {
    arr = Array.from(new Set(arr)).sort((a, b) => a - b)
    const start = arr[0]
    const end = arr[arr.length - 1]
    let missingNumbers: number[] = []

    for (let i = start; i < end; i++) {
      if (!arr.includes(i)) {
        missingNumbers.push(i)
        //this is where iterations could be skipped based on range
        //this would skip 5 numbers before adding a tick
        // i += 5
      }
    }
    return [...arr, ...missingNumbers]
  }

  const adjustTickValues = (arr: number[], maxTicks = 8): number[] => {
    arr = Array.from(new Set(arr)).sort((a, b) => a - b)
    const start = arr[0]
    const end = arr[arr.length - 1]
    const range = end - start

    // Determine step size based on range and maxTicks constraint
    let step = Math.ceil(range / (maxTicks - 1))
    if (step < 1) step = 1

    let tickValues: number[] = []
    for (let i = start; i <= end; i += step) {
      tickValues.push(i)
    }

    return tickValues
  }

  const calculateXAxisTickValues = () => {
    const tickValuesStore: number[] = []
    processedData.forEach((element: any) => {
      tickValuesStore.push(element.forkLength)
    })
    if (processedData.length <= 4) {
      let smallestValue = tickValuesStore[0]
      let LargestValue = tickValuesStore[tickValuesStore.length - 1]
      let start = Math.floor(smallestValue - 2) || 0
      let end = Math.floor(LargestValue + 2) || 5
      tickValuesStore.push(start, end)
    }

    const paddedTickValues = padArrayWithMissingNumbers(tickValuesStore)
    const adjustedTickValues = adjustTickValues(paddedTickValues)

    setTickValues(adjustedTickValues)
  }

  const calculateYAxisTickValues = (data: { count: number }[]): number[] => {
    const defaultTicks = [0, 1, 2, 3, 4, 5]
    if (!data || data.length === 0) return defaultTicks

    const maxCount = Math.max(...data.map(d => d.count))
    if (maxCount <= defaultTicks.at(-1)!) return defaultTicks

    const highestTick = Math.ceil(maxCount / 5) * 5
    const step = Math.ceil(highestTick / 5)
    const yAxisTicks = []

    for (let i = 0; i <= highestTick; i += step) {
      yAxisTicks.push(i)
      if (yAxisTicks.length === 6) break
    }

    return yAxisTicks
  }

  const calculateBarWidth = (
    arr: number[],
    defaultWidth = 25,
    minWidth = 5
  ): number => {
    let uniqueArr = Array.from(new Set(arr)).sort((a, b) => a - b)
    if (arr.length <= 1) return defaultWidth

    const firstValue = uniqueArr?.at(0) ?? 0
    const lastValue = uniqueArr?.at(-1) ?? 0
    const range = lastValue - firstValue

    if (range <= 5) return defaultWidth

    // Reduce bar width as range increases, ensuring it doesn't go below minWidth
    const dynamicWidth = Math.max(
      defaultWidth * (defaultWidth / range),
      minWidth
    )

    return Math.min(defaultWidth, dynamicWidth)
  }

  const calculateTotalCount = () => {
    let count: number = 0
    if (!forkLengths) return count
    Object.values(forkLengths).forEach(() => {
      count += 1
    })
    return count
  }

  const calculateLastFish = (): number | null => {
    let forkLengthOfLastFish: number | null = null
    if (!forkLengths) return null
    Object.values(forkLengths).forEach((entry: any) => {
      forkLengthOfLastFish = entry.forkLength
    })
    return forkLengthOfLastFish
  }
  const [tickValues, setTickValues] = useState([] as number[])
  const [processedData, setProcessedData] = useState(
    [] as { forkLength: number; count: number }[]
  )
  const { tabId, batchCharacteristics, forkLengths } = batchCountStore
  const { species, adiposeClipped, fishConditions, existingMarks } =
    batchCharacteristics
  const barWidth = calculateBarWidth(tickValues)

  const [selectedBar, setSelectedBar] = useState<number | null>(null) // Track the selected bar

  const handleBarClick = (datum: { forkLength: number; count: number }) => {
    if (selectedBar === datum.forkLength) {
      // If the same bar is clicked again, deselect it
      setSelectedBar(null)
    } else {
      // Otherwise, set the clicked bar as selected
      setSelectedBar(datum.forkLength)
    }
  }

  useEffect(() => {
    calculateXAxisTickValues()
    prepareDataForGraph()
  }, [forkLengthsStore])

  useEffect(() => {
    calculateXAxisTickValues()
  }, [processedData])

  return (
    <View flex={1} display='flex' backgroundColor='#f5fcff'>
      <HStack
        justifyContent={'space-between'}
        flex={1}
        px='5%'
        alignItems={'flex-start'}
        pt={5}
      >
        <VStack>
          <Text>
            Species: <Text bold>{capitalize(species)}</Text>
          </Text>

          <Text>
            Adipose Clipped:{' '}
            <Text bold>{adiposeClipped ? 'True' : 'False'}</Text>
          </Text>
        </VStack>
        {existingMarks && existingMarks.length > 0 ? (
          <VStack>
            <Text>
              Mark Type: <Text bold>{existingMarks[0].markType} </Text>
            </Text>
            <Text>
              Mark Color: <Text bold>{existingMarks[0].markColor} </Text>
            </Text>
            <Text>
              Mark Position: <Text bold>{existingMarks[0].markPosition} </Text>
            </Text>
          </VStack>
        ) : (
          <Text bold>N/A</Text>
        )}

        <VStack>
          <Text>
            Total: <Text bold>{calculateTotalCount()}</Text>
          </Text>
          <Text>
            Last Fork Length Entered:{' '}
            <Text bold>{calculateLastFish() ?? 'N/A'}</Text>
          </Text>
        </VStack>
      </HStack>
      <VictoryChart theme={VictoryTheme.material} domainPadding={15}>
        {/*---X AXIS---*/}
        <VictoryAxis
          label='Fork Length (mm)'
          tickFormat={x => x}
          tickValues={tickValues}
          style={{
            axisLabel: { fontSize: 18, padding: 30 },
            tickLabels: { fontSize: 12, padding: 5 },
          }}
        />
        {/*---Y AXIS---*/}
        <VictoryAxis
          dependentAxis
          label='Count'
          tickFormat={y => y}
          tickValues={calculateYAxisTickValues(processedData)}
          style={{
            axisLabel: { fontSize: 18, padding: 30 },
            tickLabels: { fontSize: 12, padding: 5 },
          }}
        />
        <VictoryBar
          data={processedData}
          x='forkLength'
          y='count'
          labels={({ datum }) =>
            datum.forkLength === selectedBar
              ? [`Fork Length: ${datum.forkLength}`, `Count: ${datum.count}`]
              : null
          }
          barWidth={barWidth}
          labelComponent={
            <VictoryTooltip
              style={{ color: 'black', fontSize: 16 }}
              activateData={true}
              flyoutStyle={{
                fill: '#f0f0f0',
                stroke: '#ccc',
                pointerEvents: 'none',
              }}
              // @ts-ignore
              // VictoryTooltip expects a boolean for `active`, but using a function works for per-datum control.
              // This works at runtime even though TypeScript doesn't recognize it.
              active={({ datum }) => datum.forkLength === selectedBar}
            />
          }
          style={{
            data: {
              fill: ({ datum }) =>
                datum.forkLength === selectedBar ? '#FF5733' : '#007C7C', // Highlight selected bar
              opacity: 0.8,
            },
          }}
          events={[
            {
              target: 'data',
              eventHandlers: {
                onPress: (_, props) => {
                  handleBarClick(props.datum) // Handle bar click
                },
              },
            },
          ]}
        />
      </VictoryChart>
    </View>
  )
}
const mapStateToProps = (state: RootState) => {
  return {
    forkLengthsStore: state.batchCount.forkLengths,
    batchCountStore: state.batchCount,
  }
}
export default connect(mapStateToProps)(BatchCountHistogram)
