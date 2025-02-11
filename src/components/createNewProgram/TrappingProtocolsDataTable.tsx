import React, { useEffect, useState } from 'react'
import { DataTable } from 'react-native-paper'
import { connect } from 'react-redux'
import { Icon, IconButton } from 'native-base'
import { Entypo } from '@expo/vector-icons'
import { RootState } from '../../redux/store'
import { IndividualTrappingSiteValuesI } from '../../redux/reducers/createNewProgramSlices/trappingSitesSlice'

const headers = ['Species', 'Run', 'Life Stage', 'Number Measured', 'UID']

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
      <DataTable.Header style={{ display: 'flex' }}>
        {headers.map((header: string, idx: number) => (
          <DataTable.Title key={idx} style={{ flex: 3 }}>
            {header}
          </DataTable.Title>
        ))}
        <DataTable.Title style={{ flex: 1, padding: 3 }}>{''}</DataTable.Title>
      </DataTable.Header>
      {processedData.map((trappingProtocolObject: any, idx: number) => {
        const cellValues = { ...trappingProtocolObject } as any
        delete cellValues?.uid
        return (
          <DataTable.Row style={[{ height: 55, display: 'flex' }]} key={idx}>
            {Object.values(trappingProtocolObject).map(
              (callValue: any, idx: number) => (
                <DataTable.Cell style={{ flex: 3 }} key={idx}>
                  {callValue}
                </DataTable.Cell>
              )
            )}
            <IconButton
              flex={1}
              // margin={2}
              p={1}
              variant='solid'
              bg='transparent'
              // colorScheme='primary'
              size='sm'
              onPress={() => {
                console.log('TRAP OBJECT ROW DATA: ', trappingProtocolObject)
                handleShowTableModal(trappingProtocolObject)
              }}
            >
              <Icon as={Entypo} size='5' name='edit' color='primary' />
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
