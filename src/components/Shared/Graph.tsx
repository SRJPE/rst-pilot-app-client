import moment from 'moment'
import { View, Text, VStack, ScrollView } from 'native-base'
import React from 'react'
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLegend,
  VictoryLabel,
  VictoryLine,
  VictoryScatter,
  VictoryTheme,
  VictoryZoomContainer,
} from 'victory-native'

interface ZoomDomainI {
  x?: any
  y?: any
}

export default function Graph({
  chartType,
  title,
  data,
  subData,
  showDates = false,
  xLabel,
  yLabel,
  height,
  width,
  barColor,
  selectedBarColor,
  backgroundColor = 'white',
  onPointClick,
  timeBased,
  zoomDomain,
  legendData,
  legendItemsPerRow,
}: {
  chartType: 'bar' | 'line' | 'true-or-false' | 'scatterplot' | 'linewithplot'
  title?: string
  data: any
  subData?: any
  showDates?: boolean
  xLabel?: string
  yLabel?: string
  height: number
  width: number
  barColor: string
  selectedBarColor: string
  backgroundColor?: string
  onPointClick?: (pointClicked: any) => void
  timeBased?: boolean
  zoomDomain?: ZoomDomainI
  legendData?: any[]
  legendItemsPerRow?: number
}) {
  const dotSize = 5

  const handlePointClick = (datum: any) => {
    if (onPointClick) {
      onPointClick(datum)
    }
  }

  const addJitter = (value: any, jitterAmount = 0.1) => {
    return value + Math.random() * jitterAmount - jitterAmount / 2
  }

  const chartTypeComponent = () => {
    switch (chartType) {
      case 'bar':
        return (
          <VictoryBar
            data={data}
            style={{
              data: {
                fill: (props: any) => {
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
                  onPressIn: (event: any, data: any) => {
                    return [
                      {
                        target: 'data',
                        eventKey: 'all',
                        mutation: (props: any) => {
                          // const fill = props.style?.fill
                          // return fill === barColor
                          //   ? null
                          //   : { style: { fill: barColor } }
                        },
                      },
                      {
                        target: 'data',
                        mutation: (props: any) => {
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
            interpolation='natural'
            x='x'
            y='y'
            // style={{
            //   data: {
            //     fill: (props: any) => {
            //       return props.datum.colorScale
            //         ? props.datum.colorScale
            //         : barColor
            //     },
            //   },
            // }}
            events={[
              {
                target: 'data',
                eventHandlers: {
                  onPressIn: (event: any, data: any) => {
                    return [
                      // {
                      //   target: 'data',
                      //   eventKey: 'all',
                      //   mutation: (props: any) => {
                      //     // const fill = props.style?.fill
                      //     // return fill === barColor
                      //     //   ? null
                      //     //   : { style: { fill: barColor } }
                      //   },
                      // },
                      {
                        target: 'data',
                        mutation: (props: any) => {
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
      case 'true-or-false':
        return (
          <VictoryScatter
            data={data}
            x='x'
            y='y'
            style={{
              data: {
                fill: (props: any) => {
                  return props.datum.colorScale
                    ? props.datum.colorScale
                    : barColor
                },
              },
            }}
            events={[
              {
                target: 'data',
                eventHandlers: {
                  onPressIn: (event: any, data: any) => {
                    return [
                      // {
                      //   target: 'data',
                      //   eventKey: 'all',
                      //   mutation: (props: any) => {
                      //     // const fill = props.style?.fill
                      //     // return fill === barColor
                      //     //   ? null
                      //     //   : { style: { fill: barColor } }
                      //   },
                      // },
                      {
                        target: 'data',
                        mutation: (props: any) => {
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
      case 'scatterplot':
        return (
          <VictoryScatter
            data={data}
            x='x'
            y='y'
            size={dotSize}
            style={{
              data: {
                fill: (props: any) => {
                  return props.datum.colorScale
                    ? props.datum.colorScale
                    : barColor
                },
              },
            }}
            events={[
              {
                target: 'data',
                eventHandlers: {
                  onPressIn: (event: any, data: any) => {
                    return [
                      // {
                      //   target: 'data',
                      //   eventKey: 'all',
                      //   mutation: (props: any) => {
                      //     // const fill = props.style?.fill
                      //     // return fill === barColor
                      //     //   ? null
                      //     //   : { style: { fill: barColor } }
                      //   },
                      // },
                      {
                        target: 'data',
                        mutation: (props: any) => {
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
      case 'scatterplot':
        return (
          <VictoryScatter
            data={data}
            x={({ x }) => x} // Add jitter to Y-axis value
            y={({ y }) => addJitter(y, 0.2)} // Add jitter to Y-axis value
            size={dotSize}
            style={{
              data: {
                fill: (props: any) => {
                  return props.datum.colorScale
                    ? props.datum.colorScale
                    : barColor
                },
              },
            }}
            events={[
              {
                target: 'data',
                eventHandlers: {
                  onPressIn: (event: any, data: any) => {
                    return [
                      // {
                      //   target: 'data',
                      //   eventKey: 'all',
                      //   mutation: (props) => {
                      //     // const fill = props.style?.fill
                      //     // return fill === barColor
                      //     //   ? null
                      //     //   : { style: { fill: barColor } }
                      //   },
                      // },
                      {
                        target: 'data',
                        mutation: (props) => {
                          console.log('data.datum', data.datum)
                          console.log('props', props)
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
      case 'linewithplot':
        return (
          <VictoryLine
            data={data}
            interpolation='natural'
            x='x'
            y='y'
            // style={{
            //   data: {
            //     fill: (props: any) => {
            //       return props.datum.colorScale
            //         ? props.datum.colorScale
            //         : barColor
            //     },
            //   },
            // }}
            events={[
              {
                target: 'data',
                eventHandlers: {
                  onPressIn: (event: any, data: any) => {
                    return [
                      // {
                      //   target: 'data',
                      //   eventKey: 'all',
                      //   mutation: (props: any) => {
                      //     // const fill = props.style?.fill
                      //     // return fill === barColor
                      //     //   ? null
                      //     //   : { style: { fill: barColor } }
                      //   },
                      // },
                      {
                        target: 'data',
                        mutation: (props: any) => {
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
    <VStack>
      {title && (
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
          {title}
        </Text>
      )}
      <VictoryChart
        scale={timeBased ? { x: 'time', y: 'linear' } : undefined}
        containerComponent={
          <VictoryZoomContainer
            zoomDomain={
              chartType === 'true-or-false'
                ? { y: [0, 2.5] }
                : zoomDomain
                ? zoomDomain
                : undefined
            }
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
          label={xLabel}
          axisLabelComponent={
            <VictoryLabel
              dy={25}
              style={{
                fontWeight: 500,
                letterSpacing: 1.5,
                fontFamily: 'Helvetica Neue',
              }}
            />
          }
          fixLabelOverlap={true}
          tickFormat={(value) => {
            if (data.length === 0) {
              return ''
            }
            let date = new Date(Number(value))
            if (String(date) !== 'Invalid Date' && showDates) {
              return `${moment(date).format('MMM Do YY')}`
            } else {
              return `${value}`
            }
          }}
        />
        <VictoryAxis
          label={yLabel}
          axisLabelComponent={
            <VictoryLabel
              dy={-30}
              style={{
                fontWeight: 500,
                letterSpacing: 1.5,
                fontFamily: 'Helvetica Neue',
              }}
            />
          }
          dependentAxis
          // label='Number of fish with mark'
          // fixLabelOverlap={true}
          tickFormat={(value) => {
            if (data.length === 0) {
              return ''
            }
            if (chartType === 'true-or-false') {
              if (value === 1) {
                return 'False'
              } else if (value === 2) {
                return 'True'
              } else {
                return ''
              }
            } else if (chartType === 'linewithplot' && yLabel === 'Density') {
              return ''
            } else {
              return `${value}`
            }
          }}
        />
        {chartTypeComponent()}
        {chartType === 'bar' ? (
          <VictoryScatter
            data={data}
            size={dotSize}
            style={{
              data: {
                fill: (props: any) => {
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
                  onPressIn: (event: any, data: any) => {
                    return [
                      {
                        target: 'data',
                        eventKey: 'all',
                        mutation: (props: any) => {
                          // const fill = props.style?.fill
                          // return fill === barColor
                          //   ? null
                          //   : { style: { fill: barColor } }
                        },
                      },
                      {
                        target: 'data',
                        mutation: (props: any) => {
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
        ) : (
          <></>
        )}
        {chartType === 'linewithplot' && subData ? (
          <VictoryScatter
            data={subData}
            size={dotSize}
            style={{
              data: {
                fill: (props: any) => {
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
                  onPressIn: (event: any, data: any) => {
                    return [
                      {
                        target: 'data',
                        eventKey: 'all',
                        mutation: (props: any) => {
                          // const fill = props.style?.fill
                          // return fill === barColor
                          //   ? null
                          //   : { style: { fill: barColor } }
                        },
                      },
                      {
                        target: 'data',
                        mutation: (props: any) => {
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
        ) : (
          <></>
        )}
      </VictoryChart>
      {legendData 
      && legendData.length
       ? (
        <VictoryLegend
          orientation='horizontal'
          x={85}
          y={20}
          itemsPerRow={legendItemsPerRow ? legendItemsPerRow : 5}
          title='Legend'
          centerTitle
          gutter={20}
          style={{
            parent: { justifyContent: 'center', alignItems: 'center', marginRight: -220 },
            border: { stroke: 'black' },
            title: { fontSize: 20 },
          }}
          data={legendData}
        />
      ) : (
        <></>
      )}
    </VStack>
  )
}

// name: user friendly mark combo
