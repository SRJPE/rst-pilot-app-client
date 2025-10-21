import * as React from 'react'
import { DataTable } from 'react-native-paper'

const TablePagination = ({
  items,
  page,
  itemsPerPage,
  from,
  to,
  onPageChange,
}: {
  items: any[]
  page: number
  itemsPerPage: number
  from: number
  to: number
  onPageChange: (page: number) => void
}) => {
  return (
    <DataTable.Pagination
      page={page}
      numberOfPages={Math.ceil(items.length / itemsPerPage)}
      onPageChange={page => onPageChange(page)}
      label={`${from + 1}-${to} of ${items.length}`}
      showFastPaginationControls
      numberOfItemsPerPage={itemsPerPage}
      selectPageDropdownLabel={'Rows per page'}
    />
  )
}

export default TablePagination
