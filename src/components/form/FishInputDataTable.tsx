import React from 'react'
import { DataTable } from 'react-native-paper'

const headers = [
  'species',
  'fork len.',
  'run',
  'weight',
  'life stage',
  'adipose clipped',
  'existing mark',
  'dead',
  'recapture',
]

const emptyTableData = {
  1: '---',
  2: '---',
  3: '---',
  4: '---',
  5: '---',
  6: '---',
  7: '---',
  8: '---',
}

interface FishInputDataTableI {
  fishInputSliceState: any
}

const FishInputDataTable = (props: FishInputDataTableI) => {
  const numberOfItemsPerPage = 5
  const [page, setPage] = React.useState(0)
  const [pageRows, setPageRows] = React.useState([
    ...props.fishInputSliceState.individualFish.slice(0, numberOfItemsPerPage),
  ])

  React.useEffect(() => {
    const rowsForPage = props.fishInputSliceState.individualFish.slice(
      page * numberOfItemsPerPage,
      page * numberOfItemsPerPage + numberOfItemsPerPage
    )

    while (rowsForPage.length < 5) {
      rowsForPage.push(emptyTableData)
    }

    setPageRows(rowsForPage)
  }, [page])

  return (
    <DataTable>
      <DataTable.Header>
        {headers.map((header: string, idx: number) => (
          <DataTable.Title key={`${header}-${idx}`}>{header}</DataTable.Title>
        ))}
      </DataTable.Header>

      {pageRows.map((obj, rowIdx: number) => {
        return (
          <DataTable.Row>
            {Object.keys(obj).map((key: string | number, itemIdx: number) => {
              console.log(key)
              return (
                <DataTable.Cell>
                  {obj[key] ? `${obj[key]}` : '---'}
                </DataTable.Cell>
              )
            })}
          </DataTable.Row>
        )
      })}

      <DataTable.Pagination
        page={page}
        numberOfPages={Math.ceil(
          props.fishInputSliceState.individualFish.length / numberOfItemsPerPage
        )}
        label={`Page ${page + 1}`}
        onPageChange={(page: number) => setPage(page)}
        numberOfItemsPerPage={numberOfItemsPerPage}
      />
    </DataTable>
  )
}

export default FishInputDataTable
