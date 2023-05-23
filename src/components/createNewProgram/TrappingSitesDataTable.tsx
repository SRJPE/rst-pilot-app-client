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
import { current } from '@reduxjs/toolkit'

interface Header {
  colData: string
  label: string
  numeric: boolean
  flex: number
}
const headers: Header[] = [
  { colData: 'trapName', label: 'Name', numeric: false, flex: 2 },
  // { label: 'Latitude', numeric: true, flex: 1 },
  // { label: 'Longitude', numeric: true, flex: 1 },
  { colData: 'coneSize', label: 'Cone Size', numeric: true, flex: 1 },
  { colData: 'USGSStationNumber', label: 'Flow Gauge', numeric: true, flex: 1 },
  { colData: 'releaseSiteName', label: 'RS Name', numeric: false, flex: 1 },
  // { label: 'RS Latitude', numeric: true, flex: 1 },
  // { label: 'RS Longitude', numeric: true, flex: 1 },
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
        {headers.map(({ label, numeric, flex }, idx: number) => (
          <DataTable.Title
            key={idx}
            numeric={numeric}
            style={{
              // borderWidth: 1,
              paddingHorizontal: 10,
              flex: flex,
            }}
          >
            {label}
          </DataTable.Title>
        ))}
        {hasMultipleTrapSites && (
          <DataTable.Title
            style={{
              //borderWidth: 1,
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
            flex: 1,
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
            {Object.entries(trapObject).map(
              (keyValuePair: any, idx: number) => {
                const [key, cellValue] = keyValuePair
                const currentCol = headers.find(
                  header => header.colData === key
                )

                if (currentCol)
                  return (
                    <DataTable.Cell
                      numeric={currentCol.numeric}
                      key={idx}
                      style={{
                        // borderWidth: 1,
                        paddingHorizontal: 10,
                        flex: currentCol.flex,
                      }}
                    >
                      {cellValue}
                    </DataTable.Cell>
                  )
              }
            )}

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
                flex: 1,
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
