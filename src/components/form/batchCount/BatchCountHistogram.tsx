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
  // VictorySelectionContainer,
} from 'victory-native'

const BatchCountHistogram = ({ processedData }: { processedData: any }) => {
  return (
    <View
      flex={1}
      justifyContent='center'
      alignItems='center'
      backgroundColor='#f5fcff'
    >
      <VictoryChart
        width={640}
        theme={VictoryTheme.material}
        domainPadding={30}
        // containerComponent={<VictorySelectionContainer />}
      >
        {/*---X AXIS---*/}
        <VictoryAxis
          // label='Fork Length (cm)'
          // tickValues={xAxisTickValues}
          // tickValues={[1, 2, 3, 4]}
          // tickFormat={['Quarter 1', 'Quarter 2', 'Quarter 3', 'Quarter 4']}
          tickFormat={(x) => x}
        />
        {/*---Y AXIS---*/}
        <VictoryAxis
          // label='Count'
          dependentAxis
          // tickFormat specifies how ticks should be displayed
          tickFormat={(x) => x}
        />
        <VictoryBar
          data={processedData}
          x='forkLength'
          y='count'
          // animate={{
          //   duration: 2000,
          //   onLoad: { duration: 1000 },
          // }}
        />
      </VictoryChart>
    </View>
  )
}

export default BatchCountHistogram
