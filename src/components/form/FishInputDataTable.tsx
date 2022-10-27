import React from 'react'
import { DataTable } from 'react-native-paper'

const numberOfItemsPerPageList = [2, 3, 4]

const data = {
  headers: ['species', 'fork length', 'weight', 'run', 'adipose clipped'], // length = 5
  rows: [
    ['chinook', 100, 10, '', ''],
    ['chinook', 100, 10, '', ''],
    ['chinook', 100, 10, '', ''],
  ]
}

const FishInputDataTable = () => {
  const [page, setPage] = React.useState(0)
  const [numberOfItemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[0]
  )
  const from = page * numberOfItemsPerPage
  const to = Math.min((page + 1) * numberOfItemsPerPage, data.rows.length)

  React.useEffect(() => {
    setPage(0)
  }, [numberOfItemsPerPage])

  return (
    <DataTable>
      <DataTable.Header>
        {data.headers.map((header: string) => <DataTable.Title>{header}</DataTable.Title>)}
      </DataTable.Header>


      {data.rows.map((row: any[]) => {
        return (
          <DataTable.Row>
            {row.map((item: string | number) => (
              <DataTable.Cell>{item}</DataTable.Cell>
            ))}
          </DataTable.Row>
        )
      })}

      <DataTable.Pagination
        page={page}
        numberOfPages={Math.ceil(data.rows.length / numberOfItemsPerPage)}
        onPageChange={(page) => setPage(page)}
        label={`${from + 1}-${to} of ${data.rows.length}`}
        showFastPaginationControls
        numberOfItemsPerPageList={numberOfItemsPerPageList}
        numberOfItemsPerPage={numberOfItemsPerPage}
        onItemsPerPageChange={onItemsPerPageChange}
        selectPageDropdownLabel={'Rows per page'}
      />
    </DataTable>
  )
}

export default FishInputDataTable
