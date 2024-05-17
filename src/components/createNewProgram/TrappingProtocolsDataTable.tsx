import React, { useEffect, useState } from 'react'
import { DataTable } from 'react-native-paper'
import { connect } from 'react-redux'
import { Icon, IconButton } from 'native-base'
import { Entypo } from '@expo/vector-icons'
import { RootState } from '../../redux/store'
import { IndividualTrappingSiteValuesI } from '../../redux/reducers/createNewProgramSlices/trappingSitesSlice'

interface Header {
  colData: string
  label: string
  numeric: boolean
  flex: number
}
const headers: Header[] = [
  { colData: 'species', label: 'Species', numeric: false, flex: 1 },
  { colData: 'run', label: 'Run', numeric: false, flex: 1 },
  { colData: 'lifeStage', label: 'Life Stage', numeric: false, flex: 1 },
  {
    colData: 'numberMeasured',
    label: 'Number Measured',
    numeric: false,
    flex: 1,
  },
]

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
      <DataTable.Header>
        {headers.map(({ label, numeric, flex }, idx: number) => (
          <DataTable.Title
            key={idx}
            numeric={numeric}
            style={{
              paddingHorizontal: 10,
              flex: flex,
            }}
          >
            {label}
          </DataTable.Title>
        ))}
        <DataTable.Title
          style={{
            paddingHorizontal: 10,
            flex: 0,
          }}
        >
          {''}
        </DataTable.Title>
      </DataTable.Header>
      {processedData.map((trappingProtocolObject: any, idx: number) => {
        return (
          <DataTable.Row style={[{ height: 55 }]} key={idx}>
            {Object.entries(trappingProtocolObject).map(
              (keyValuePair: any, idx: number) => {
                const [key, cellValue] = keyValuePair
                const currentCol = headers.find(
                  (header) => header.colData === key
                )

                if (currentCol)
                  return (
                    <DataTable.Cell
                      numeric={currentCol.numeric}
                      key={idx}
                      style={{
                        paddingHorizontal: 10,
                        flex: currentCol.flex,
                      }}
                    >
                      {cellValue.toString().charAt(0).toUpperCase() +
                        cellValue.toString().slice(1)}
                    </DataTable.Cell>
                  )
              }
            )}
            <IconButton
              marginY={3}
              variant='solid'
              bg='primary'
              colorScheme='primary'
              size='sm'
              onPress={() => {
                console.log('TRAP OBJECT ROW DATA: ', trappingProtocolObject)
                handleShowTableModal(trappingProtocolObject)
              }}
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
