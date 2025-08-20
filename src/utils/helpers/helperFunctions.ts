import type { TrapVisitResponse } from '../interfaces'

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

    if (!targetDate) return false
    return (
      ladDate.getMonth() === targetDate?.getMonth() &&
      ladDate.getDate() === targetDate?.getDate()
    )
  })
}

export const findRunDefinition = ({
  ladObject,
  number,
  trapSite,
}: {
  ladObject: any
  number: number
  trapSite?: string
}) => {
  if (!ladObject || !number) return
  const buckets = [
    { definition: 'fall', min: ladObject.fallMin1, max: ladObject.fallMax1 },
    { definition: 'fall', min: ladObject.fallMin2, max: ladObject.fallMax2 },
    {
      definition: 'spring',
      min: ladObject.springMin1,
      max: ladObject.springMax1,
    },
    {
      definition: 'spring',
      min: ladObject.springMin2,
      max: ladObject.springMax2,
    },
    {
      definition: 'winter',
      min: ladObject.winterMin1,
      max: ladObject.winterMax1,
    },
    {
      definition: 'winter',
      min: ladObject.winterMin2,
      max: ladObject.winterMax2,
    },
    {
      definition: 'late fall',
      min: ladObject.lateFallMin1,
      max: ladObject.lateFallMax1,
    },
    {
      definition: 'late fall',
      min: ladObject.lateFallMin2,
      max: ladObject.lateFallMax2,
    },
  ]

  const runObj = buckets.find(
    bucket => number >= bucket.min && number <= bucket.max
  )

  if (
    trapSite &&
    (trapSite.toLowerCase().includes('battle') ||
      trapSite.toLowerCase().includes('upper clear'))
  ) {
    if (runObj?.definition === 'fall') return 'spring'
  }

  return runObj?.definition || 'not recorded'
}

export const retrieveTrapVisitsRequiringTurbidity = (
  previousTrapVisits: any[]
) => {
  const filteredTrapVisits = previousTrapVisits?.filter((trapVisit: any) => {
    return trapVisit.createdTrapVisitEnvironmentalResponse?.some(
      (response: any) =>
        response.measureName === 'water turbidity' &&
        response.measureValueNumeric === null
    )
    //? Copilot suggested this line, would this be a good idea?
    //&& trapVisit.createdTrapVisitResponse.trapVisitTimeEnd
  })

  const formattedTrapVisits = filteredTrapVisits.map((trapVisit: any) => {
    return {
      trapVisitId: trapVisit.createdTrapVisitResponse.id,
      programId: trapVisit.createdTrapVisitResponse.programId,
      trapLocationId: trapVisit.createdTrapVisitResponse.trapLocationId,
      waterTurbidity: trapVisit.createdTrapVisitEnvironmentalResponse.find(
        (response: any) => response.measureName === 'water turbidity'
      )?.measureValueNumeric,
      trapVisitEndTime: trapVisit.createdTrapVisitResponse.trapVisitTimeEnd,
      trapVisitStartTime: trapVisit.createdTrapVisitResponse.trapVisitTimeStart,
    }
  })

  return formattedTrapVisits
}

export const getLadObject = ({
  activeTabId,
  trapOperationsStore,
  lengthAtDateModel,
}: {
  activeTabId: string
  trapOperationsStore: any
  lengthAtDateModel: any
}) => {
  let dateTimeValue = new Date()

  const timeProperty = getTimeProperty(
    trapOperationsStore?.[activeTabId]?.values
  )

  if (timeProperty) {
    dateTimeValue = trapOperationsStore?.[activeTabId]?.values?.[timeProperty]
  } else if (
    activeTabId &&
    trapOperationsStore?.[activeTabId]?.values?.trapVisitStopTime
  ) {
    dateTimeValue =
      trapOperationsStore?.[activeTabId]?.values?.trapVisitStopTime
  } else if (
    activeTabId &&
    trapOperationsStore?.[activeTabId]?.values?.trapVisitStartTime
  ) {
    dateTimeValue =
      trapOperationsStore?.[activeTabId]?.values?.trapVisitStartTime
  } else if (
    activeTabId &&
    trapOperationsStore?.[activeTabId]?.values?.sampleTime
  ) {
    dateTimeValue = trapOperationsStore?.[activeTabId]?.values?.sampleTime
  }

  const ladObjectForTrapDate = findLengthAtDateRun(
    lengthAtDateModel,
    dateTimeValue ? new Date(dateTimeValue) : new Date()
  )
  return ladObjectForTrapDate || null
}

export const getTimeProperty = (trapOperationsValues: any) => {
  if (trapOperationsValues.trapVisitStopTime) {
    return 'trapVisitStopTime'
  } else if (trapOperationsValues.trapVisitStartTime) {
    return 'trapVisitStartTime'
  } else if (trapOperationsValues.sampleTime) {
    return 'sampleTime'
  }

  return null
}

export function formatDateString_MM_DD_YY(date: Date | string) {
  const d = date instanceof Date ? date : new Date(date)

  const month = d.getMonth() + 1 // months are 0-based
  const day = d.getDate()
  const year = d.getFullYear().toString().slice(-2) // last 2 digits

  return `${month}_${day}_${year}`
}
