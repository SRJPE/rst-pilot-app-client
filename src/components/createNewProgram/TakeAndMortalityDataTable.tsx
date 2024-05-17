import React, { useEffect, useState } from 'react'
import { DataTable } from 'react-native-paper'
import { connect } from 'react-redux'
import { Icon, IconButton } from 'native-base'
import { Entypo } from '@expo/vector-icons'
import { RootState } from '../../redux/store'
import { IndividualTrappingSiteValuesI } from '../../redux/reducers/createNewProgramSlices/trappingSitesSlice'
import { TakeAndMortalityValuesI } from '../../redux/reducers/createNewProgramSlices/permitInformationSlice'
import { startCase } from 'lodash'

interface Header {
  colData: string
  label: string
  numeric: boolean
  flex: number
}
const headers: Header[] = [
  { colData: 'species', label: 'Species', numeric: false, flex: 1 },
  { colData: 'listingUnitOrStock', label: 'Stock', numeric: false, flex: 1 },
  { colData: 'lifeStage', label: 'Life Stage', numeric: false, flex: 1 },
  { colData: 'expectedTake', label: 'Expected Take', numeric: false, flex: 1 },
  {
    colData: 'indirectMortality',
    label: 'Indirect Mortality',
    numeric: false,
    flex: 1,
  },
]
const TakeAndMortalityDataTable = ({
  takeAndMortalityValuesStore,
  handleShowTableModal,
}: {
  takeAndMortalityValuesStore: TakeAndMortalityValuesI
  handleShowTableModal?: any
}) => {
  const [processedData, setProcessedData] = useState(
    [] as Array<IndividualTrappingSiteValuesI>
  )

  useEffect(() => {
    setProcessedData(Object.values(takeAndMortalityValuesStore))
  }, [takeAndMortalityValuesStore])
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
      {processedData.map((takeAndMortalityObject: any, idx: number) => {
        return (
          <DataTable.Row style={[{ height: 55 }]} key={idx}>
            {Object.entries(takeAndMortalityObject).map(
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
                      {startCase(cellValue)}
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
                console.log('TRAP OBJECT ROW DATA: ', takeAndMortalityObject)
                handleShowTableModal(takeAndMortalityObject)
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
    takeAndMortalityValuesStore: state.permitInformation.takeAndMortalityValues,
  }
}

export default connect(mapStateToProps)(TakeAndMortalityDataTable)
