import React from 'react'
import { DataTable } from 'react-native-paper'
import { connect } from 'react-redux'
import { RootState } from '../../redux/store'
import { assign, pick, cloneDeep } from 'lodash'
import { Row, IconButton, Icon, Box } from 'native-base'
import { FishStoreI } from '../../redux/reducers/formSlices/fishInputSlice'
import { Entypo } from '@expo/vector-icons'

const headers = [
  'Species',
  'Count',
  'Fork Len.',
  'Run',
  'Weight',
  'Life Stage',
  'Clipped',
  'Marks',
  'Dead',
  'Recapture',
  '',
]

const sortedDataByHeaders = [
  'species',
  'numFishCaught',
  'forkLength',
  'run',
  'weight',
  'lifeStage',
  'adiposeClipped',
  'existingMarks',
  'dead',
  'willBeUsedInRecapture',
]

const emptyTableData = {
  species: '---',
  numFishCaught: '---',
  forkLength: '---',
  run: '---',
  weight: '---',
  lifeStage: '---',
  adiposeClipped: '---',
  existingMarks: '---',
  dead: '---',
  willBeUsedInRecapture: '---',
}

const FishInputDataTable = ({
  navigation,
  fishStore,
}: {
  navigation: any
  fishStore: FishStoreI
}) => {
  const numberOfItemsPerPage = 5
  const [page, setPage] = React.useState(0)
  const [pageRows, setPageRows] = React.useState({})

  React.useEffect(() => {
    const pageRows = generateRowsForPage()
    setPageRows(pageRows)
  }, [fishStore])

  React.useEffect(() => {
    const pageRows = generateRowsForPage()
    setPageRows(pageRows)
  }, [page])

  const generateRowsForPage = () => {
    const pageRowsIndexes = Object.keys(fishStore).slice(
      page * numberOfItemsPerPage,
      page * numberOfItemsPerPage + numberOfItemsPerPage
    )
    const pageRowsSliced: any = {}
    pageRowsIndexes.forEach((idx) => {
      pageRowsSliced[Number(idx)] = fishStore[Number(idx)]
    })

    let sortedPageRows = sortPageRows(pageRowsSliced)
    let paddedPageRows = addEmptyRows(sortedPageRows)
    return paddedPageRows
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

  const sortPageRows = (obj: FishStoreI) => {
    let sortedRows: any = {}

    const keys = Object.keys(obj)
    keys.forEach((key) => {
      let dataObj: any = cloneDeep(obj[Number(key)])
      dataObj.existingMarks = dataObj.existingMarks.length
      delete dataObj.UID
      delete dataObj.fishConditions
      let dataObjPadded = { ...emptyTableData, ...dataObj }

      const dataObjKeys = Object.keys(dataObjPadded)
      dataObjKeys.forEach((dataObjKey) => {
        if (dataObjPadded[dataObjKey] === '') {
          dataObjPadded[dataObjKey] = '---'
        }
      })
      sortedRows[Number(key)] = dataObjPadded
    })
    return sortedRows
  }

  const addEmptyRows = (obj: any) => {
    let objCopy = cloneDeep(obj)
    let keys = Object.keys(objCopy)
    for (let i = keys.length; i < numberOfItemsPerPage; i++) {
      let id = `empty-#${i}`
      objCopy[id] = emptyTableData
    }

    return objCopy
  }

  return (
    <DataTable>
      <DataTable.Header>
        {headers.map((header: string, idx: number) => (
          <DataTable.Title key={`${header}-${idx}`}>{header}</DataTable.Title>
        ))}
      </DataTable.Header>

      {Object.keys(pageRows).map((rowKey, idx: number) => {
        return (
          <Row key={`${rowKey}-${idx}`}>
            <DataTable.Row key={`${rowKey}-${idx}`} style={{ flex: 1 }}>
              {Object.keys(pageRows[rowKey as keyof typeof pageRows])
                .sort(
                  (a, b) =>
                    sortedDataByHeaders.indexOf(a) -
                    sortedDataByHeaders.indexOf(b)
                )
                .map((objKey: string | number, itemIdx: number) => {
                  if (objKey !== 'plusCountMethod' && objKey !== 'plusCount') {
                    return (
                      <DataTable.Cell key={`${objKey}-${itemIdx}`}>
                        {renderCell(
                          pageRows[rowKey as keyof typeof pageRows],
                          objKey
                        )}
                      </DataTable.Cell>
                    )
                  }
                })}
            </DataTable.Row>
            <IconButton
              marginY={3}
              variant='solid'
              bg='primary'
              colorScheme='primary'
              size='sm'
              isDisabled={rowKey.includes('empty')}
              onPress={() => {
                if (!rowKey.includes('empty')) {
                  if (fishStore[Number(rowKey)]) {
                    navigation.navigate('Add Fish', {
                      editModeData: {
                        id: rowKey,
                        ...fishStore[Number(rowKey)],
                      },
                    })
                  }
                }
              }}
            >
              <Icon as={Entypo} size='5' name='edit' color='warmGray.50' />
            </IconButton>
          </Row>
        )
      })}

      <DataTable.Pagination
        page={page}
        numberOfPages={Math.ceil(
          Object.keys(fishStore).length / numberOfItemsPerPage
        )}
        label={`Page ${page + 1}`}
        onPageChange={(page: number) => setPage(page)}
        numberOfItemsPerPage={numberOfItemsPerPage}
      />
    </DataTable>
  )
}

const mapStateToProps = (state: RootState) => {
  let activeTabId = 'placeholderId'
  if (
    state.tabSlice.activeTabId &&
    state.fishInput[state.tabSlice.activeTabId]
  ) {
    activeTabId = state.tabSlice.activeTabId
  }

  return {
    fishStore: state.fishInput[activeTabId].fishStore,
  }
}

export default connect(mapStateToProps)(FishInputDataTable)
