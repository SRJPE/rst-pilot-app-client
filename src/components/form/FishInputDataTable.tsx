import React from 'react'
import { DataTable } from 'react-native-paper'
import { connect } from 'react-redux'
import { RootState } from '../../redux/store'

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

const FishInputDataTable = ({
  individualFishList,
}: {
  individualFishList: any
}) => {
  const numberOfItemsPerPage = 5
  const [page, setPage] = React.useState(0)
  const [pageRows, setPageRows] = React.useState([
    ...individualFishList.slice(0, numberOfItemsPerPage),
  ])

  React.useEffect(() => {
    const rowsForPage = generateRowsForPage()
    setPageRows(rowsForPage)
  }, [individualFishList])

  React.useEffect(() => {
    const rowsForPage = generateRowsForPage()
    setPageRows(rowsForPage)
  }, [page])

  const generateRowsForPage = () => {
    const rowsForPage = individualFishList.slice(
      page * numberOfItemsPerPage,
      page * numberOfItemsPerPage + numberOfItemsPerPage
    )
    while (rowsForPage.length < 5) {
      rowsForPage.push(emptyTableData)
    }
    return rowsForPage
  }

  return (
    <DataTable>
      <DataTable.Header>
        {headers.map((header: string, idx: number) => (
          <DataTable.Title key={`${header}-${idx}`}>{header}</DataTable.Title>
        ))}
      </DataTable.Header>

      {pageRows.map((obj, rowIdx: number) => {
        return (
          <DataTable.Row key={Object.keys(obj)[rowIdx]}>
            {Object.keys(obj).map((key: string | number, itemIdx: number) => {
              return (
                <DataTable.Cell key={`${key}-${obj[key]}-${itemIdx}`}>
                  {`${obj[key]}` ? `${obj[key]}` : '---'}
                </DataTable.Cell>
              )
            })}
          </DataTable.Row>
        )
      })}

      <DataTable.Pagination
        page={page}
        numberOfPages={Math.ceil(
          individualFishList.length / numberOfItemsPerPage
        )}
        label={`Page ${page + 1}`}
        onPageChange={(page: number) => setPage(page)}
        numberOfItemsPerPage={numberOfItemsPerPage}
      />
    </DataTable>
  )
}

const mapStateToProps = (state: RootState) => {
  return {
    individualFishList: state.fishInput.individualFish,
  }
}

export default connect(mapStateToProps)(FishInputDataTable)
