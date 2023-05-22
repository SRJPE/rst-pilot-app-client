import { useCallback, useEffect, useState } from 'react'
import { DataTable } from 'react-native-paper'
import { connect } from 'react-redux'
import { Icon, IconButton, ScrollView } from 'native-base'
import { Entypo } from '@expo/vector-icons'
import { RootState } from '../../redux/store'
import {
  IndividualTrappingSiteValuesI,
  TrappingSitesStoreI,
} from '../../redux/reducers/createNewProgramSlices/trappingSitesSlice'
import { GroupTrapSiteValuesI } from '../../redux/reducers/createNewProgramSlices/multipleTrapsSlice'

interface Header {
  content: string
  numeric: boolean
  flex: number
}
const headers: Header[] = [
  { content: 'Name', numeric: false, flex: 3 },
  { content: 'Latitude', numeric: true, flex: 1 },
  { content: 'Longitude', numeric: true, flex: 1 },
  { content: 'Cone Size', numeric: true, flex: 1 },
  { content: 'Flow Gauge', numeric: true, flex: 1 },
  { content: 'RS Name', numeric: false, flex: 3 },
  { content: 'RS Latitude', numeric: true, flex: 1 },
  { content: 'RS Longitude', numeric: true, flex: 1 },
]

const TrappingSitesDataTable = ({
  trappingSitesStore,
  multipleTrapsStore,
}: {
  trappingSitesStore: TrappingSitesStoreI
  multipleTrapsStore: GroupTrapSiteValuesI
}) => {
  const [processedData, setProcessedData] = useState(
    [] as Array<IndividualTrappingSiteValuesI>
  )

  useEffect(() => {
    console.log('🚀 ~ multipleTrapsStore:', multipleTrapsStore)
    setProcessedData(Object.values(trappingSitesStore))
  }, [trappingSitesStore])

  const hasMultipleTrapSites = processedData.length > 1

  const findGroupSite = (trapName: string) => {
    const allTrapGroups: { groupItems: string[]; trapSiteName: string }[] =
      Object.values(multipleTrapsStore)
    const assignedTrapGroup = allTrapGroups.reduce(
      (trapSiteName, currentGroup) => {
        if (currentGroup.groupItems.includes(trapName)) {
          trapSiteName = currentGroup.trapSiteName
        }
        return trapSiteName
      },
      'N/A'
    )
    return assignedTrapGroup
  }

  return (
    <DataTable style={{}}>
      <DataTable.Header style={[{}]}>
        {headers.map(({ content, numeric, flex }, idx: number) => (
          <DataTable.Title
            key={idx}
            numeric={numeric}
            style={{
              // borderWidth: 1,
              paddingHorizontal: 10,
              flex: flex,
            }}
          >
            {content}
          </DataTable.Title>
        ))}
        {hasMultipleTrapSites && (
          <DataTable.Title
            style={{
              // borderWidth: 1,
              paddingHorizontal: 10,
              flex: 2,
            }}
          >
            Trap Site
          </DataTable.Title>
        )}
        <DataTable.Title
          style={{
            // borderWidth: 1,
            paddingHorizontal: 10,
            flex: 2,
          }}
        >
          {''}
        </DataTable.Title>
      </DataTable.Header>
      {processedData.map((trapObject: any, idx: number) => {
        return (
          <DataTable.Row
            style={[{ height: 55 }]}
            key={idx}
            onPress={
              () => {}
              // handleShowTableModal(trapObject)
            }
          >
            {Object.values(trapObject).map((callValue: any, idx: number) => {
              return (
                <DataTable.Cell
                  numeric={headers.at(idx)?.numeric}
                  key={idx}
                  style={{
                    //borderWidth: 1,
                    paddingHorizontal: 10,
                    flex: headers.at(idx)?.flex,
                  }}
                >
                  {callValue}
                </DataTable.Cell>
              )
            })}
            {hasMultipleTrapSites && (
              <DataTable.Cell
                style={{
                  // borderWidth: 1,
                  paddingHorizontal: 10,
                  flex: 2,
                }}
              >
                {findGroupSite(trapObject.trapName)}
              </DataTable.Cell>
            )}
            <DataTable.Cell
              style={{
                flex: 2,
                justifyContent: 'flex-end',
                paddingHorizontal: 10,
                //borderWidth: 1,
              }}
            >
              <IconButton
                //marginY={3}
                variant='solid'
                bg='primary'
                colorScheme='primary'
                size='sm'
                onPress={() =>
                  console.log('TRAP OBJECT ROW DATA: ', trapObject)
                }
              >
                <Icon as={Entypo} size='5' name='edit' color='warmGray.50' />
              </IconButton>
            </DataTable.Cell>
          </DataTable.Row>
        )
      })}
      {/* </ScrollView> */}
    </DataTable>
  )
}

const mapStateToProps = (state: RootState) => {
  return {
    trappingSitesStore: state.trappingSites.trappingSitesStore,
    multipleTrapsStore: state.multipleTraps.groupTrapSiteValues,
  }
}

export default connect(mapStateToProps)(TrappingSitesDataTable)
