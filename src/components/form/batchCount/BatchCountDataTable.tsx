import { Pressable } from 'native-base'
import { useEffect, useState } from 'react'
import { DataTable } from 'react-native-paper'

const BatchCountDataTable = ({
  processedData,
  handleShowTableModal,
}: {
  processedData: { forkLength: number; count: number }[]
  handleShowTableModal: any
}) => {
  const [page, setPage] = useState<number>(0)
  const numberOfItemsPerPage = 4

  function sortByForkLength(data: { forkLength: number; count: number }[]) {
    return data.sort((a, b) => a.forkLength - b.forkLength)
  }

  return (
    <DataTable>
      <DataTable.Header>
        <DataTable.Title numeric>Fork Length (cm)</DataTable.Title>
        <DataTable.Title numeric>Count</DataTable.Title>
      </DataTable.Header>
      {sortByForkLength(processedData).map(
        (forkLengthObject: any, idx: number) => {
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
        }
      )}

      <DataTable.Pagination
        page={page}
        onPageChange={(page: number) => setPage(page)}
        numberOfPages={Math.ceil(processedData.length / numberOfItemsPerPage)}
        label={`Page ${page + 1} of ${processedData.length}`}
        numberOfItemsPerPage={numberOfItemsPerPage}
        showFastPaginationControls
      />
    </DataTable>
  )
}

export default BatchCountDataTable

const data = [
  { forkLength: 3, count: 3 },
  { forkLength: 5, count: 4 },
  { forkLength: 4, count: 2 },
  { forkLength: 6, count: 1 },
]
