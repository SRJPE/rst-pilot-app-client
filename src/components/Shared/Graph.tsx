import { View, Text } from 'native-base'
import React from 'react'
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLine,
  VictoryTheme,
} from 'victory-native'

export default function Graph({
  chartType,
  title,
  data,
  height,
  width,
  barColor,
  selectedBarColor,
  backgroundColor,
  onPointClick,
}: {
  chartType: 'graph' | 'line'
  title?: string
  data: any
  height: number
  width: number
  barColor: string
  selectedBarColor: string
  backgroundColor?: string
  onPointClick?: () => void
}) {
  const handlePointClick = () => {
    console.log('hit!')
    if (onPointClick) {
      onPointClick()
    }
  }

  const chartTypeComponent = () => {
    switch (chartType) {
      case 'graph':
        return (
          <VictoryBar
            data={data}
            style={{ data: { fill: barColor } }}
            x='x'
            y='y'
            events={[
              {
                target: 'data',
                eventHandlers: {
                  onPressIn: (event, data) => {
                    return [
                      {
                        target: 'data',
                        eventKey: 'all',
                        mutation: (props) => {
                          const fill = props.style?.fill
                          return fill === barColor
                            ? null
                            : { style: { fill: barColor } }
                        },
                      },
                      {
                        target: 'data',
                        mutation: (props) => {
                          console.log(data.datum)
                          handlePointClick()
                          const fill = props.style?.fill
                          return fill === selectedBarColor
                            ? null
                            : { style: { fill: selectedBarColor } }
                        },
                      },
                    ]
                  },
                },
              },
            ]}
          />
        )
      case 'line':
        return (
          <VictoryLine
            data={data}
            style={{ data: { fill: barColor } }}
            x='x'
            y='y'
            events={[
              {
                target: 'data',
                eventHandlers: {
                  onPressIn: (event, data) => {
                    return [
                      {
                        target: 'data',
                        eventKey: 'all',
                        mutation: (props) => {
                          const fill = props.style?.fill
                          return fill === barColor
                            ? null
                            : { style: { fill: barColor } }
                        },
                      },
                      {
                        target: 'data',
                        mutation: (props) => {
                          console.log(data.datum)
                          handlePointClick()
                          const fill = props.style?.fill
                          return fill === selectedBarColor
                            ? null
                            : { style: { fill: selectedBarColor } }
                        },
                      },
                    ]
                  },
                },
              },
            ]}
          />
        )
    }
  }

  return (
    <View>
      {title && (
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
          {title}
        </Text>
      )}
      <VictoryChart
        theme={VictoryTheme.material}
        domainPadding={30}
        width={width}
        height={height}
        style={{ background: { fill: backgroundColor } }}
      >
        <VictoryAxis
          tickFormat={(value) => {
            return `${value}`
          }}
        />
        <VictoryAxis
          dependentAxis
          tickFormat={(value) => {
            return `${value}`
          }}
        />
        {chartTypeComponent()}
      </VictoryChart>
    </View>
  )
}
