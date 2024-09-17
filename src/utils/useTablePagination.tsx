import { useEffect, useState } from 'react'

const useTablePagination = (
  items: any[],
  {
    itemsPerPage: providedItemsPerPage,
    numberOfItemsPerPageList: providedNumberOfItemsPerPageList,
  }: Partial<{
    itemsPerPage?: number
    numberOfItemsPerPageList?: number[]
  }> = {}
) => {
  const [page, setPage] = useState<number>(0)
  const [numberOfItemsPerPageList] = useState(
    providedNumberOfItemsPerPageList || [5, 10, 25]
  )
  const [itemsPerPage] = useState(
    providedItemsPerPage || numberOfItemsPerPageList[0]
  )
  const from = page * itemsPerPage
  const to = Math.min((page + 1) * itemsPerPage, items.length)

  const onPageChange = (page: number) => setPage(page)

  useEffect(() => {
    setPage(0)
  }, [itemsPerPage])

  return {
    page,
    itemsPerPage,
    from,
    to,
    onPageChange,
  }
}

export default useTablePagination
