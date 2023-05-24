import React, { useEffect, useState } from 'react'
import { DataTable } from 'react-native-paper'
import { connect } from 'react-redux'
import { Icon, IconButton } from 'native-base'
import { Entypo } from '@expo/vector-icons'
import { RootState } from '../../redux/store'
import { IndividualTrappingSiteValuesI } from '../../redux/reducers/createNewProgramSlices/trappingSitesSlice'

const headers = ['Species', 'Run', 'Life Stage', 'Number Measured', '']

const TrappingProtocolsDataTable = ({
  trappingProtocolsStore,
  handleShowTableModal,
}: {
  trappingProtocolsStore: any
  handleShowTableModal?: any
}) => {
  const [processedData, setProcessedData] = useState(
    [] as Array<IndividualTrappingSiteValuesI>
  )

  useEffect(() => {
    setProcessedData(Object.values(trappingProtocolsStore))
  }, [trappingProtocolsStore])
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
      {processedData.map((trappingProtocolObject: any, idx: number) => {
        return (
          <DataTable.Row style={[{ height: 55 }]} key={idx}>
            {Object.values(trappingProtocolObject).map(
              (callValue: any, idx: number) => (
                <DataTable.Cell key={idx}>{callValue}</DataTable.Cell>
              )
            )}
            <IconButton
              marginY={3}
              variant='solid'
              bg='primary'
              colorScheme='primary'
              size='sm'
              onPress={
                () =>
                  console.log('TRAP OBJECT ROW DATA: ', trappingProtocolObject)
                // handleShowTableModal(trappingProtocolObject)
              }
            >
              <Icon as={Entypo} size='5' name='edit' color='warmGray.50' />
            </IconButton>
          </DataTable.Row>
        )
      })}
    </DataTable>
  )
}

const mapStateToProps = (state: RootState) => {
  return {
    trappingProtocolsStore: state.trappingProtocols.trappingProtocolsStore,
  }
}

export default connect(mapStateToProps)(TrappingProtocolsDataTable)
