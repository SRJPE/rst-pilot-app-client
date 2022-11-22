import React from 'react'
import { DataTable } from 'react-native-paper'
import { connect } from 'react-redux'
import { RootState } from '../../redux/store'
import { assign, pick, cloneDeep } from 'lodash'

const headers = [
  'Species',
  'Count',
  'Fork Len.',
  'Run',
  'Weight',
  'Life Stage',
  'Clipped',
  'Mark',
  'Dead',
  'Recapture',
]

const emptyTableData = {
  species: '---',
  numFishCaught: '---',
  forkLength: '---',
  run: '---',
  weight: '---',
  lifeStage: '---',
  adiposeClipped: '---',
  existingMark: '---',
  dead: '---',
  willBeUsedInRecapture: '---',
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
    const pageRows = generateRowsForPage()
    setPageRows(pageRows)
  }, [individualFishList])

  React.useEffect(() => {
    const pageRows = generateRowsForPage()
    setPageRows(pageRows)
  }, [page])

  const generateRowsForPage = () => {
    const pageRows = individualFishList.slice(
      page * numberOfItemsPerPage,
      page * numberOfItemsPerPage + numberOfItemsPerPage
    )
    let sortedPageRows = sortPageRows(pageRows)
    addEmptyRows(sortedPageRows)

    return sortedPageRows
  }

  const renderCell = (obj: any, key: any) => {
    if (`${obj[key]}` === 'null') {
      return '---'
    }
    if (`${obj[key]}`) {
      return `${obj[key]}`
    } else {
      return '---'
    }
  }

  const sortPageRows = (arr: any[]) => {
    let sortedRows: any[] = []
    arr.forEach((dataObj) => {
      const sorted = Object.assign(
        cloneDeep(emptyTableData),
        pick(dataObj, Object.keys(emptyTableData))
      )
      sortedRows.push(sorted)
    })

    return sortedRows
  }

  const addEmptyRows = (arr: any[]) => {
    while (arr.length < 5) {
      arr.push(emptyTableData)
    }
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
          <DataTable.Row key={`${Object.keys(obj)[rowIdx]}-${rowIdx}`}>
            {Object.keys(obj)
              .map((key: string | number, itemIdx: number) => {
                return (
                  <DataTable.Cell key={`${key}-${obj[key]}-${itemIdx}`}>
                    {renderCell(obj, key)}
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
