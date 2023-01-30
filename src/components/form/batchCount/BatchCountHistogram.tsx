import { indexOf } from 'lodash'
import { View } from 'native-base'
import { useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { RootState } from '../../../redux/store'
import {
  VictoryBar,
  VictoryChart,
  VictoryTheme,
  VictoryAxis,
  VictoryLabel,
  VictoryContainer,
  Bar,
  VictoryTooltip,

  // VictorySelectionContainer,
} from 'victory-native'

const BatchCountHistogram = ({
  forkLengthsStore,
}: {
  forkLengthsStore: any
}) => {
  const [processedData, setProcessedData] = useState(
    [] as { forkLength: number; count: number }[]
  )
  useEffect(() => {
    prepareDataForGraph()
  }, [forkLengthsStore])

  const prepareDataForGraph = () => {
    const storageArray: { forkLength: number; count: number }[] = []
    Object.keys(forkLengthsStore).forEach((key: any) => {
      storageArray.push({
        forkLength: Number(key),
        count: forkLengthsStore[key],
      })
    })
    setProcessedData(storageArray)
  }

  const calculateXAxisTickValues = () => {}
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
        domainPadding={30}
        // title='Popularity of Dog Breeds by Percentage'
        // containerComponent={
        //   <VictoryContainer title={'Popularity of Dog Breeds by Percentage'} />
        // }
      >
        {/*---X AXIS---*/}
        <VictoryAxis
          label='Fork Length (cm)'
          // tickValues={[1, 2, 3, 4]}
          // tickFormat={['Quarter 1', 'Quarter 2', 'Quarter 3', 'Quarter 4']}
          tickFormat={(x) => x}
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
          labelComponent={
            <VictoryLabel dy={25} />

            // <VictoryTooltip
            //   flyoutWidth={30}
            //   style={{ fontSize: 20, fill: 'black' }}
            // />
          }
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
  return {
    forkLengthsStore: state.fishInput.batchCharacteristics.forkLengths,
  }
}
export default connect(mapStateToProps)(BatchCountHistogram)
