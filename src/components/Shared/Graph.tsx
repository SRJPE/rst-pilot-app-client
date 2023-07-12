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

interface ZoomDomainI {
  x?: any,
  y?: any
}

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
  timeBased,
  zoomDomain,
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
  timeBased?: boolean
  zoomDomain?: ZoomDomainI
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
            style={{
              data: {
                fill: (props) => {
                  return props.datum.colorScale
                    ? props.datum.colorScale
                    : barColor
                },
              },
            }}
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
                          // const fill = props.style?.fill
                          // return fill === barColor
                          //   ? null
                          //   : { style: { fill: barColor } }
                        },
                      },
                      {
                        target: 'data',
                        mutation: (props) => {
                          handlePointClick(data.datum)
                          // const fill = props.style?.fill
                          // return fill === selectedBarColor
                          //   ? null
                          //   : { style: { fill: selectedBarColor } }
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
            style={{
              data: {
                fill: (props) => {
                  return barColor
                  // if (Object.keys(props.datum).includes('colorScale')) {
                  //   return props.datum.colorScale
                  //     ? props.datum.colorScale
                  //     : barColor
                  // } else {
                  //   return barColor
                  // }
                },
              },
            }}
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
                          // const fill = props.style?.fill
                          // return fill === barColor
                          //   ? null
                          //   : { style: { fill: barColor } }
                        },
                      },
                      {
                        target: 'data',
                        mutation: (props) => {
                          // handlePointClick(data.datum)
                          // const fill = props.style?.fill
                          // return fill === selectedBarColor
                          //   ? null
                          //   : { style: { fill: selectedBarColor } }
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
        scale={timeBased ? { x: 'time', y: 'linear' } : undefined}
        containerComponent={
          <VictoryZoomContainer
            zoomDomain={zoomDomain ? zoomDomain : { y: [0, 50] }}
            zoomDimension='x'
          />
        }
        theme={VictoryTheme.material}
        domainPadding={30}
        width={width}
        height={height}
        style={{ background: { fill: backgroundColor } }}
      >
        <VictoryAxis
          fixLabelOverlap={true}
          tickFormat={(value) => {
            return `${value}`
          }}
        />
        <VictoryAxis
          dependentAxis
          // fixLabelOverlap={true}
          tickFormat={(value) => {
            return `${value}`
          }}
        />
        {chartTypeComponent()}
        <VictoryScatter
          data={data}
          style={{
            data: {
              fill: (props) => {
                return props.datum.colorScale
                  ? props.datum.colorScale
                  : barColor
              },
            },
          }}
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
                        // const fill = props.style?.fill
                        // return fill === barColor
                        //   ? null
                        //   : { style: { fill: barColor } }
                      },
                    },
                    {
                      target: 'data',
                      mutation: (props) => {
                        handlePointClick(data.datum)
                        // const fill = props.style?.fill
                        // return fill === selectedBarColor
                        //   ? null
                        //   : { style: { fill: selectedBarColor } }
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
