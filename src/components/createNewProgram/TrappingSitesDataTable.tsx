import { useEffect, useState } from 'react'
import { DataTable } from 'react-native-paper'
import { StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { Icon, IconButton, Row, View } from 'native-base'
import { Entypo } from '@expo/vector-icons'

const headers = [
  'Name',
  'Latitude',
  'Longitude',
  'Cone Size',
  'Flow Gauge',
  'RS Name',
  'RS Latitude',
  'RS Longitude',
]
const testData = [
  {
    Name: 'Name 1',
    Latitude: 0,
    Longitude: 0,
    'Cone Size': 0,
    'Flow Gauge': 0,
    'RS Name': 'RS Name',
    'RS Latitude': 'RS Latitude',
    'RS Longitude': 'RS Longitude',
  },
  {
    Name: 'Name 2',
    Latitude: 1,
    Longitude: 1,
    'Cone Size': 1,
    'Flow Gauge': 1,
    'RS Name': 'RS Name',
    'RS Latitude': 'RS Latitude',
    'RS Longitude': 'RS Longitude',
  },
]

const TrappingSitesDataTable = ({}: // forkLengthsStore,
// handleShowTableModal,
{
  // forkLengthsStore?: any
  // handleShowTableModal?: any
}) => {
  const [processedData, setProcessedData] = useState(testData as Array<any>)

  return (
    <DataTable>
      <DataTable.Header style={[{ paddingLeft: 0 }]}>
        {headers.map((header: string, idx: number) => (
          <DataTable.Title key={idx} numeric>
            {header}
          </DataTable.Title>
        ))}
      </DataTable.Header>
      {processedData.map((trapObject: any, idx: number) => {
        console.log('🚀 ~ {processedData.map ~ trapObject:', trapObject)
        return (
          // <Row key={idx}>
          <DataTable.Row
            style={[{ height: 55 }]}
            key={idx}
            onPress={
              () => {}
              // handleShowTableModal(trapObject)
            }
          >
            {Object.values(trapObject).map((callValue: any, idx: number) => (
              <DataTable.Cell key={idx}>{callValue}</DataTable.Cell>
            ))}
            <IconButton
              marginY={3}
              variant='solid'
              bg='primary'
              colorScheme='primary'
              size='sm'
              onPress={() => console.log('TRAP OBJECT ROW DATA: ', trapObject)}
            >
              <Icon as={Entypo} size='5' name='edit' color='warmGray.50' />
            </IconButton>
          </DataTable.Row>
          // </Row>
        )
      })}
    </DataTable>
  )
}

export default TrappingSitesDataTable
