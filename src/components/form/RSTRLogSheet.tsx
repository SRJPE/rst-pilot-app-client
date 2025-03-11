import React from 'react'
import { DataTable } from 'react-native-paper'
import { pick, cloneDeep, drop } from 'lodash'
import {
  Row,
  IconButton,
  Icon,
  Text,
  VStack,
  View,
  ScrollView,
} from 'native-base'
import { connect } from 'react-redux'
import { AppDispatch, RootState } from '../../redux/store'
import CustomModalHeader from '../Shared/CustomModalHeader'
import { visitSetupDefaultsSlice } from '../../redux/reducers/visitSetupDefaults'

const headers = [
  'Date',
  'Time',
  'Recorder',
  'Tide',
  'Rev Counter',
  'Trap Status',
  'Condition Code',
  'Comments',
]

const sortedDataByHeaders = [
  'date',
  'time',
  'createdBy',
  'tideCode',
  'revCounter',
  'gearStatus',
  'conditionCode',
  'comments',
]

const RSTRLogSheet = ({
  handleLogSheetState,
  previousTrapVisits,
  visitSetupState,
  activeTabId,
  visitSetupDefaultsSlice,
  dropdownValues,
}: {
  handleLogSheetState: () => void
  previousTrapVisits: any
  visitSetupState: any
  activeTabId: string | null
  visitSetupDefaultsSlice: any
  dropdownValues: any
}) => {
  const [tableData, setTableData] = React.useState<Array<any>>([])

  React.useEffect(() => {
    let trapVisitsForLocation = [] as Array<any>

    const sortedTrapVisits = [...previousTrapVisits].sort(
      (a: any, b: any) =>
        new Date(b.createdTrapVisitResponse.trapVisitTimeStart).getTime() -
        new Date(a.createdTrapVisitResponse.trapVisitTimeStart).getTime()
    )

    sortedTrapVisits.forEach((trapVisit: any) => {
      if (
        activeTabId &&
        trapVisit.createdTrapVisitResponse.trapLocationId ===
          visitSetupState?.[activeTabId]?.values?.trapLocationId
      ) {
        const {
          trapVisitTimeStart,
          createdBy,
          tideCode,
          revCounter,
          gearStatus,
          conditionCode,
          comments,
        } = trapVisit.createdTrapVisitResponse

        const date = new Date(trapVisitTimeStart)
        const formattedDate = `${
          date.getMonth() + 1
        }/${date.getDate()}/${date.getFullYear()}`
        const hours = date.getHours() % 12 || 12
        const minutes = date.getMinutes().toString().padStart(2, '0')
        const ampm = date.getHours() >= 12 ? 'PM' : 'AM'
        const formattedTime = `${hours}:${minutes} ${ampm}`

        trapVisitsForLocation.push({
          date: formattedDate,
          time: formattedTime,
          createdBy,
          tideCode,
          revCounter,
          gearStatus,
          conditionCode,
          comments,
        })
      }
    })

    setTableData(trapVisitsForLocation)
  }, [previousTrapVisits])

  const renderCell = (obj: any, key: any) => {
    if (key === 'createdBy') {
      const crewMember = visitSetupDefaultsSlice.crewMembers
        .flat()
        .find((crewMember: any) => {
          return crewMember.personnelId === obj[key]
        })
      return `${crewMember.firstName} ${crewMember.lastName}`
    }

    if (dropdownValues[key]) {
      const dropdownValue = dropdownValues[key].find((item: any) => {
        return item.id === obj[key]
      })
      return dropdownValue?.code || '---'
    }

    if (`${obj[key]}` === 'null') {
      return '---'
    }
    if (`${obj[key]}` === 'not recorded') {
      return 'NR'
    }
    if (`${obj[key]}`) {
      if (typeof obj[key] === 'string' || typeof obj[key] === 'boolean') {
        return `${`${obj[key]}`.charAt(0).toUpperCase()}${`${obj[key]}`.slice(
          1
        )}`
      }
      return `${obj[key]}`
    } else {
      return '---'
    }
  }

  return (
    <ScrollView>
      <CustomModalHeader
        headerText={'RSTR Log Sheet'}
        showHeaderButton={true}
        closeModal={handleLogSheetState}
      />
      <DataTable>
        <DataTable.Header>
          {headers.map((header: string, idx: number) => (
            <DataTable.Title
              key={`${header}-${idx}`}
              style={{
                flex: header === 'Recorder' ? 1.5 : 1,
              }}
            >
              {header}
            </DataTable.Title>
          ))}
        </DataTable.Header>

        {Object.keys(tableData).map((rowKey, idx: number) => {
          return (
            <Row key={`${rowKey}-${idx}`}>
              <DataTable.Row key={`${rowKey}-${idx}`} style={{ flex: 1 }}>
                {Object.keys(tableData[rowKey as keyof typeof tableData])
                  .sort(
                    (a, b) =>
                      sortedDataByHeaders.indexOf(a) -
                      sortedDataByHeaders.indexOf(b)
                  )
                  .map((objKey: string | number, itemIdx: number) => {
                    return (
                      <DataTable.Cell
                        key={`${objKey}-${itemIdx}`}
                        style={{
                          flex: objKey === 'createdBy' ? 1.5 : 1,
                          borderWidth: 0.25,
                          paddingLeft: 3,
                        }}
                        textStyle={{ fontSize: 16 }}
                      >
                        {renderCell(
                          tableData[rowKey as keyof typeof tableData],
                          objKey
                        )}
                      </DataTable.Cell>
                    )
                  })}
              </DataTable.Row>
            </Row>
          )
        })}
      </DataTable>
    </ScrollView>
  )
}

const mapStateToProps = (state: RootState) => {
  return {
    previousTrapVisits:
      state.trapVisitFormPostBundler.previousTrapVisitSubmissions,
    visitSetupState: state.visitSetup,
    activeTabId: state.tabSlice.activeTabId,
    visitSetupDefaultsSlice: state.visitSetupDefaults,
    dropdownValues: state.dropdowns.values,
  }
}

export default connect(mapStateToProps)(RSTRLogSheet)
