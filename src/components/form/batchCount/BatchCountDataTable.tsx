import { useEffect, useState } from 'react'
import { DataTable } from 'react-native-paper'
import { connect } from 'react-redux'
import { RootState } from '../../../redux/store'
import { reformatBatchCountData } from '../../../utils/utils'

const BatchCountDataTable = ({
  forkLengthsStore,
  handleShowTableModal,
}: {
  forkLengthsStore: any
  handleShowTableModal: any
}) => {
  const [page, setPage] = useState<number>(0)
  const numberOfItemsPerPage = 4
  const [processedData, setProcessedData] = useState(
    [] as { forkLength: number; count: number }[]
  )

  useEffect(() => {
    prepareDataForTable()
  }, [forkLengthsStore])

  const prepareDataForTable = () => {
    const reformatedBatchCountData = reformatBatchCountData(forkLengthsStore)
    const storageArray: { forkLength: number; count: number }[] = []

    Object.keys(reformatedBatchCountData).forEach((key: any) => {
      const count = Object.values(reformatedBatchCountData[key]).reduce(
        (a, b) => a + b
      )
      const forkLengthObject = {
        forkLength: Number(key),
        count: count,
      } as any
      Object.keys(reformatedBatchCountData[key]).forEach((innerKey: string) => {
        forkLengthObject[innerKey] = reformatedBatchCountData[key][innerKey]
      })

      storageArray.push(forkLengthObject)
    })

    setProcessedData(sortByForkLength(storageArray))
  }

  const sortByForkLength = (data: { forkLength: number; count: number }[]) => {
    return data.sort((a, b) => a.forkLength - b.forkLength)
  }

  return (
    <DataTable>
      <DataTable.Header>
        <DataTable.Title numeric>Fork Length (mm)</DataTable.Title>
        <DataTable.Title numeric>Count</DataTable.Title>
      </DataTable.Header>
      {processedData.map((forkLengthObject: any, idx: number) => {
        return (
          <DataTable.Row
            key={idx}
            onPress={() => handleShowTableModal(forkLengthObject)}
          >
            <DataTable.Cell numeric>
              {forkLengthObject.forkLength}
            </DataTable.Cell>
            <DataTable.Cell numeric>{forkLengthObject.count}</DataTable.Cell>
          </DataTable.Row>
        )
      })}

      <DataTable.Pagination
        page={page}
        onPageChange={(page: number) => setPage(page)}
        numberOfPages={Math.ceil(processedData.length / numberOfItemsPerPage)}
        label={`Page ${page + 1} of ${processedData.length || 1}`}
        numberOfItemsPerPage={numberOfItemsPerPage}
        showFastPaginationControls
      />
    </DataTable>
  )
}
const mapStateToProps = (state: RootState) => {
  let tabGroupId = 'placeholderId'
  if (
    state.tabSlice.activeTabId &&
    state.fishInput[state.tabSlice.tabs[state.tabSlice.activeTabId].groupId]
  ) {
    tabGroupId = state.tabSlice.tabs[state.tabSlice.activeTabId].groupId
  }

  return {
    forkLengthsStore:
      state.fishInput[tabGroupId].batchCharacteristics.forkLengths,
  }
}

export default connect(mapStateToProps)(BatchCountDataTable)
