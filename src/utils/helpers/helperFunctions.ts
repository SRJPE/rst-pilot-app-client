export const generateErrorMessage = (errorCode: string) => {
  let errorMessage
  switch (errorCode) {
    case 'Network Error':
    case 'ERR_NETWORK':
      errorMessage =
        'A network error occurred, unable to reach server. Please try again.'
      break
    case 'ECONNABORTED':
      errorMessage =
        'The server took too long to respond. Your request could not be completed at this time.'
      break
    case 'ERR_BAD_REQUEST':
      errorMessage = 'Request failed with status code 400 (Bad Request)'
      break
    default:
      return errorCode
    // errorMessage = 'An unknown error occurred. Please try again.'
  }
  return errorMessage
}

export const convertBytesToKB = (bytes: number): string => {
  return Math.round(bytes / 1000).toFixed(0) + ' KB' // Convert bytes to KB and format to 2 decimal places
}

export const generatePaginationRecordsLabel = (
  pageNumber: number,
  pageSize: number,
  totalRecords: number
) => {
  if (totalRecords <= pageSize) {
    return `Page 1 (${totalRecords} Records)`
  }
  const startRecord = (pageNumber - 1) * pageSize + 1
  const endRecord = Math.min(pageNumber * pageSize, totalRecords)

  return `Page ${pageNumber} (Records ${startRecord} - ${endRecord} of ${totalRecords})`
}

export const convertUTCToLocalTime = (utcTime: string) => {
  const date = new Date(utcTime)
  return date.toLocaleString()
}

export const findLengthAtDateRun = (array: Array<any>, targetDate: Date) => {
  return array.find(item => {
    const ladDate = new Date(item.ladDate)
    return (
      ladDate.getMonth() === targetDate.getMonth() &&
      ladDate.getDate() === targetDate.getDate()
    )
  })
}

export const findRunDefinition = (ladObj: any, number: number) => {
  const buckets = [
    { definition: 'fall', min: ladObj.fallMin1, max: ladObj.fallMax1 },
    { definition: 'fall', min: ladObj.fallMin2, max: ladObj.fallMax2 },
    { definition: 'spring', min: ladObj.springMin1, max: ladObj.springMax1 },
    { definition: 'spring', min: ladObj.springMin2, max: ladObj.springMax2 },
    { definition: 'winter', min: ladObj.winterMin1, max: ladObj.winterMax1 },
    { definition: 'winter', min: ladObj.winterMin2, max: ladObj.winterMax2 },
    {
      definition: 'late fall',
      min: ladObj.lateFallMin1,
      max: ladObj.lateFallMax1,
    },
    {
      definition: 'late fall',
      min: ladObj.lateFallMin2,
      max: ladObj.lateFallMax2,
    },
  ]

  return (
    buckets.find(bucket => number >= bucket.min && number <= bucket.max)
      ?.definition || 'not recorded'
  )
}
