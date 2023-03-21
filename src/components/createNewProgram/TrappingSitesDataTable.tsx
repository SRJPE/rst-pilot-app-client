import { useEffect, useState } from 'react'
import { DataTable } from 'react-native-paper'
import { StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { Icon, IconButton, Row, View } from 'native-base'
import { Entypo } from '@expo/vector-icons'
import { RootState } from '../../redux/store'
import {
  IndividualTrappingSiteValuesI,
  TrappingSitesStoreI,
} from '../../redux/reducers/createNewProgramSlices/trappingSitesSlice'

const headers = [
  'Name',
  'Latitude',
  'Longitude',
  'Cone Size',
  'Flow Gauge',
  'RS Name',
  'RS Latitude',
  'RS Longitude',
  '',
]

const TrappingSitesDataTable = ({
  trappingSitesStore,
}: {
  trappingSitesStore: TrappingSitesStoreI
}) => {
  const [processedData, setProcessedData] = useState(
    [] as Array<IndividualTrappingSiteValuesI>
  )

  useEffect(() => {
    // calculateXAxisTickValues()
    setProcessedData(Object.values(trappingSitesStore))
  }, [trappingSitesStore])
  return (
    <DataTable>
      <DataTable.Header style={[{}]}>
        {headers.map((header: string, idx: number) => (
          <DataTable.Title
            key={idx}
            numeric
            style={[{ justifyContent: 'center', flexWrap: 'wrap' }]}
          >
            {header}
          </DataTable.Title>
        ))}
      </DataTable.Header>
      {processedData.map((trapObject: any, idx: number) => {
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

const mapStateToProps = (state: RootState) => {
  return {
    trappingSitesStore: state.trappingSites.trappingSitesStore,
  }
}

export default connect(mapStateToProps)(TrappingSitesDataTable)
