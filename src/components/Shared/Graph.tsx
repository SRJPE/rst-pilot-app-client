import { View, Text } from 'native-base'
import React from 'react'
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLine,
  VictoryScatter,
  VictoryTheme,
  VictoryZoomContainer,
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
  chartType: 'bar' | 'line'
  title?: string
  data: any
  height: number
  width: number
  barColor: string
  selectedBarColor: string
  backgroundColor?: string
  onPointClick?: (pointClicked: any) => void
}) {
  const handlePointClick = (datum: any) => {
    if (onPointClick) {
      onPointClick(datum)
    }
  }

  const chartTypeComponent = () => {
    switch (chartType) {
      case 'bar':
        return (
          <VictoryBar
            data={data}
            style={{ data: { fill: barColor } }}
            barWidth={({ index }) => 2}
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
                          handlePointClick(data.datum)
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
                          handlePointClick(data.datum)
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
        domain={{ y: [0, 100] }}
        containerComponent={
          <VictoryZoomContainer zoomDomain={{ y: [0, 100] }} />
        }
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
        <VictoryScatter
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
                        handlePointClick(data.datum)
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
      </VictoryChart>
    </View>
  )
}
