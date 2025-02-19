import React, { useEffect, useState } from 'react'
import { DataTable } from 'react-native-paper'
import { connect } from 'react-redux'
import { HStack, Icon, IconButton } from 'native-base'
import { Entypo } from '@expo/vector-icons'
import { RootState } from '../../redux/store'
import { IndividualTrappingSiteValuesI } from '../../redux/reducers/createNewProgramSlices/trappingSitesSlice'
import { TakeAndMortalityValuesI } from '../../redux/reducers/createNewProgramSlices/permitInformationSlice'
import { removeIndividualTakeAndMortality } from '../../redux/reducers/createNewProgramSlices/permitInformationSlice'
import { useDispatch } from 'react-redux'

type ColumnDef = {
  label: string
  flex: number
  field: string
  type?: 'string' | 'number' | 'date'
}

const columnDefs: ColumnDef[] = [
  { label: 'Species', flex: 4, field: 'species', type: 'string' },
  { label: 'Stock', flex: 4, field: 'listingUnitOrStock', type: 'string' },
  { label: 'Life Stage', flex: 2, field: 'lifeStage', type: 'string' },
  { label: 'Expected Take', flex: 2, field: 'expectedTake', type: 'number' },
  {
    label: 'Indirect Mortality',
    flex: 2,
    field: 'indirectMortality',
    type: 'number',
  },
  // { label: 'UID', flex: 2, field: 'uid', type: 'string' },
  { label: 'Actions', flex: 2, field: 'actions' },
]

const TakeAndMortalityDataTable = ({
  takeAndMortalityValuesStore,
  handleShowTableModal,
}: {
  takeAndMortalityValuesStore: TakeAndMortalityValuesI
  handleShowTableModal?: any
}) => {
  const dispatch = useDispatch()
  const [processedData, setProcessedData] = useState(
    [] as Array<IndividualTrappingSiteValuesI>
  )
  console.log(
    '🚀 ~ file: TakeAndMortalityDataTable.tsx:30 ~ processedData:',
    processedData
  )

  useEffect(() => {
    setProcessedData(Object.values(takeAndMortalityValuesStore))
  }, [takeAndMortalityValuesStore])
  return (
    <DataTable style={{ paddingHorizontal: '4%' }}>
      <DataTable.Header style={{ display: 'flex', height: 65 }}>
        {columnDefs.map(({ type, label, flex }: ColumnDef, idx: number) => (
          <DataTable.Title
            key={idx}
            numeric
            numberOfLines={2}
            style={[
              {
                paddingHorizontal: 5,
                justifyContent: type === 'number' ? 'flex-end' : 'flex-start',
                flexWrap: 'wrap',
                // borderWidth: 1,
                // borderColor: 'red',
                flex,
              },
            ]}
          >
            {label}
          </DataTable.Title>
        ))}
      </DataTable.Header>
      {processedData.map((trappingProtocolObject: any, idx: number) => {
        return (
          <DataTable.Row
            key={idx}
            style={{ display: 'flex' }}
            onPress={
              () => {}
              // handleShowTableModal(trappingProtocolObject)
            }
          >
            {columnDefs
              .slice(0, columnDefs.length - 1)
              .map(({ type, field, flex }: ColumnDef, idx: number) => (
                <DataTable.Cell
                  key={idx}
                  style={{
                    paddingHorizontal: 5,
                    justifyContent:
                      type === 'number' ? 'flex-end' : 'flex-start',

                    // borderWidth: 1,
                    // borderColor: 'blue',
                    flex,
                  }}
                >
                  {trappingProtocolObject[field]}
                </DataTable.Cell>
              ))}
            {/* {Object.values(trappingProtocolObject).map(
              (callValue: any, idx: number) => (
                <DataTable.Cell
                  key={idx}
                  style={{ borderWidth: 1, borderColor: 'blue', flex: 1 }}
                >
                  {callValue}
                </DataTable.Cell>
              )
            )} */}
            <DataTable.Cell
              style={{
                flex: 2,
                paddingHorizontal: 10,
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <HStack space={3}>
                <IconButton
                  variant='solid'
                  bg='primary'
                  colorScheme='primary'
                  size='sm'
                  onPress={() => {
                    console.log(
                      'TRAP OBJECT ROW DATA: ',
                      trappingProtocolObject
                    )
                    handleShowTableModal(trappingProtocolObject)
                  }}
                >
                  <Icon as={Entypo} name='edit' color='warmGray.50' />
                </IconButton>
                <IconButton
                  variant='solid'
                  bg='primary'
                  colorScheme='primary'
                  size='sm'
                  onPress={() =>
                    dispatch(
                      removeIndividualTakeAndMortality(
                        trappingProtocolObject.uid
                      )
                    )
                  }
                >
                  <Icon as={Entypo} name='trash' color='warmGray.50' />
                </IconButton>
              </HStack>
            </DataTable.Cell>
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
