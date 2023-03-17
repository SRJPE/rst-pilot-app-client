import { View } from 'native-base'
import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { RootState } from '../../../redux/store'
import {
  VictoryBar,
  VictoryChart,
  VictoryTheme,
  VictoryAxis,
  VictoryLabel,
} from 'victory-native'
import { reformatBatchCountData } from '../../../utils/utils'

const BatchCountHistogram = ({
  forkLengthsStore,
}: {
  forkLengthsStore: any
}) => {
  const [tickValues, setTickValues] = useState([] as number[])
  const [processedData, setProcessedData] = useState(
    [] as { forkLength: number; count: number }[]
  )

  useEffect(() => {
    calculateXAxisTickValues()
    prepareDataForGraph()
  }, [forkLengthsStore])

  useEffect(() => {
    calculateXAxisTickValues()
  }, [processedData])

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
    //currently an issue with too many tick values when the range is too big
    //possible solution by skipping iterations inside padArrayWithMissingNumbers based on range
    // console.log(
    //   '🚀 ~ calculateXAxisTickValues ~ paddedTickValues',
    //   paddedTickValues
    // )
    setTickValues(paddedTickValues)
  }
  return (
    <View
      flex={1}
      justifyContent='center'
      alignItems='center'
      backgroundColor='#f5fcff'
    >
      <VictoryChart
        width={667}
        height={300}
        theme={VictoryTheme.material}
        domainPadding={37}
      >
        {/*---X AXIS---*/}
        <VictoryAxis
          label='Fork Length (mm)'
          tickFormat={(x) => x}
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
          tickFormat={(x) => x}
          style={{
            axisLabel: { fontSize: 18, padding: 30 },
            tickLabels: { fontSize: 12, padding: 5 },
          }}
        />
        <VictoryBar
          data={processedData}
          x='forkLength'
          y='count'
          labels={({ datum }) => datum.count}
          barWidth={23}
          labelComponent={<VictoryLabel dy={25} />}
          style={{
            data: { fill: '#007C7C', opacity: 0.8 },
            labels: { fontSize: 16, fill: 'white' },
          }}
        />
      </VictoryChart>
    </View>
  )
}
const mapStateToProps = (state: RootState) => {
  let tabGroupId = 'placeholderId'
  if (
    state.tabSlice.activeTabId &&
    state.fishInput[state.tabSlice.tabs[state.tabSlice.activeTabId].groupId]
  ) {
    tabGroupId = state.tabSlice.tabs[state.tabSlice.activeTabId].groupId
  }

  return {
    forkLengthsStore:
      state.fishInput[tabGroupId].batchCharacteristics.forkLengths,
  }
}
export default connect(mapStateToProps)(BatchCountHistogram)
