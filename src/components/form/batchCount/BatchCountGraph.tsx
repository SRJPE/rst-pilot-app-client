import { Box, Center, Text } from 'native-base'
import React from 'react'
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit'
import { connect } from 'react-redux'
import { RootState } from '../../../redux/store'

const BatchCountGraph = ({ fishStore }: { fishStore: any }) => {
  const { forkLengths } = fishStore.batchCharacteristics
  const forkLengthSet = new Set(forkLengths)
  const data = {
    // labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    labels: Array.from(forkLengthSet),
    datasets: [
      {
        data: forkLengths,
      },
    ],
  }
  const chartConfig = {
    backgroundGradientFrom: '#1E2923',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#08130D',
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
  }
  const chartConfig2 = {
    backgroundColor: '#e26a00',
    backgroundGradientFrom: '#fb8c00',
    backgroundGradientTo: '#ffa726',
    decimalPlaces: 2, // optional, defaults to 2dp
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#ffa726',
    },
  }
  return (
    <BarChart
      style={{
        marginVertical: 8,
        borderRadius: 16,
      }}
      data={data}
      width={700}
      height={220}
      yAxisLabel='$'
      chartConfig={chartConfig2}
      verticalLabelRotation={30}
    />
  )
}
const mapStateToProps = (state: RootState) => {
  return {
    fishStore: state.fishInput,
  }
}

export default connect(mapStateToProps)(BatchCountGraph)
