import { StackActions } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { ReleaseMarkI } from './interfaces'
import { every, some, sortBy, flatten, uniqBy, find, keyBy } from 'lodash'
import { ObjectSchema } from 'yup'
import type { InitialStateI as FishProcessingSliceState } from '../redux/reducers/formSlices/fishProcessingSlice'

export const checkOtherTabForms = ({
  tabSlice,
  activeTabId,
  reduxState,
  schema,
}: {
  tabSlice: any
  activeTabId: string | null
  reduxState: any
  schema: ObjectSchema<any>
}) => {
  const tabIds = Object.keys(tabSlice.tabs)

  const otherTabsValidity = tabIds.map(tabId => {
    if (tabId !== activeTabId) {
      const tabFormValues = reduxState[tabId]?.values
      const formIsValid = schema?.isValidSync(tabFormValues)
      return formIsValid
    }

    return
  })

  const tabIncomplete = otherTabsValidity.some(result => result === false)

  if (tabIncomplete) return false
  return true
}

export const showFishInputButton = ({
  fishProcessing,
  tabIds,
}: {
  fishProcessing: FishProcessingSliceState
  tabIds: Array<string>
}) => {
  const fishInputRequired = tabIds.some(
    (tabId: any) =>
      fishProcessing[tabId]?.values?.fishProcessedResult === 'processed fish'
  )

  return fishInputRequired
}

export const alphabeticalSort = (arrayToSort: Array<any>, name: string) => {
  //returns an alphabetically sorted copy of the original array
  const alphabeticalArray = [...arrayToSort].sort((a, b) => {
    if (a[name] < b[name]) return -1
    if (a[name] > b[name]) return 1
    return 0
  })
  return alphabeticalArray
}

export const reorderTaxon = (taxonArray: any[], reverse?: boolean) => {
  //sort the taxon
  const alphabeticalTaxon = alphabeticalSort(taxonArray, 'commonname')

  //move chinook and steelhead to the front
  let chinook, steelhead
  for (var i = 0; i < alphabeticalTaxon.length; i++) {
    if (alphabeticalTaxon[i]?.commonname === 'Chinook salmon') {
      chinook = alphabeticalTaxon[i]
      alphabeticalTaxon.splice(i, 1)
    }
    if (alphabeticalTaxon[i]?.commonname === 'Steelhead / rainbow trout') {
      steelhead = alphabeticalTaxon[i]
      alphabeticalTaxon.splice(i, 1)
    }
  }
  alphabeticalTaxon.unshift(chinook, steelhead)

  // // implemented bc of issue with react-native-dropdown-picker sorting
  if (reverse) {
    alphabeticalTaxon.reverse()
  }

  return alphabeticalTaxon?.map((taxon: any) => ({
    ...taxon,
    label: `${taxon?.commonname} ${
      taxon?.abbreviationCode ? `(${taxon?.abbreviationCode})` : ''
    }`,
    value: taxon?.commonname,
    parent: 'allSpecies',
  }))
}

export const fetchRecentlyUsedSpecies = ({
  siteId,
  trapLocations,
}: {
  siteId: number
  trapLocations: any[]
}) => {
  const [trapSiteData] = trapLocations.filter(ml => ml.id === siteId)

  if (trapSiteData?.recentSpecies?.length) {
    const recentlyUsedSpecies = trapSiteData.recentSpecies
    const formattedRecentlyUsedSpecies = recentlyUsedSpecies.map((rs: any) => ({
      label: rs.commonname,
      value: `recent_${rs.commonname}`,
      parent: 'recentlyUsed',
    }))

    return [
      { label: 'Recently Used', value: 'recentlyUsed' },
      ...formattedRecentlyUsedSpecies,
    ]
  }

  return []
}

export const findTaxonCode = (speciesValue: string, taxonArray: any[]) => {
  const speciesText = speciesValue?.includes('recent')
    ? speciesValue.split('_')[1]
    : speciesValue

  return taxonArray?.find(taxon => taxon.commonname === speciesText)?.code
}

export const createArray = (start: number, end: number) => {
  var result = []
  for (var i = start; i <= start + end; i++) {
    result.push(i)
  }
  return result
}

interface FishData {
  forkLength: number
  lifeStage: string
}

interface FormattedFishData {
  [forkLength: number]: {
    [lifeStage: string]: number
  }
}

export const handleSpeciesSearchTextChange = ({
  reorderedTaxon,
  searchValue,
  setSpeciesList,
  defaultSpeciesList,
}: {
  reorderedTaxon: any[]
  defaultSpeciesList: any[]
  searchValue: string
  setSpeciesList: React.Dispatch<
    React.SetStateAction<
      {
        label: string
        value: string
      }[]
    >
  >
}) => {
  const filteredSpeciesList = reorderedTaxon.filter(
    (species: any) =>
      species.commonname?.toLowerCase().includes(searchValue.toLowerCase()) ||
      species.abbreviationCode
        ?.toLowerCase()
        .includes(searchValue.toLowerCase())
  )
  // .map(({ parent, ...species }) => species)

  if (searchValue) {
    setSpeciesList([
      { label: 'Search Results', value: 'allSpecies' },
      ...filteredSpeciesList,
    ])
  } else {
    setSpeciesList(defaultSpeciesList)
  }
}

export const reformatBatchCountData = (
  data: Record<string, FishData>
): FormattedFishData => {
  const formattedData: FormattedFishData = {}
  for (const key in data) {
    const fish = data[key]
    if (!formattedData[fish.forkLength]) {
      formattedData[fish.forkLength] = {}
    }
    if (!formattedData[fish.forkLength][fish.lifeStage]) {
      formattedData[fish.forkLength][fish.lifeStage] = 0
    }
    formattedData[fish.forkLength][fish.lifeStage]++
  }
  return formattedData
}

export const buttonLookup: any = {
  '10-29': {
    firstButton: 10,
    additionalButtons: 19,
    lifeStage: 'Yolk Sac Fry',
  },
  '30-40': { firstButton: 30, additionalButtons: 10, lifeStage: 'Fry' },
  '41-59': { firstButton: 41, additionalButtons: 18, lifeStage: 'Parr' },
  '60-89': {
    firstButton: 60,
    additionalButtons: 29,
    lifeStage: 'Silvery Parr',
  },
  '90-117+': { firstButton: 90, additionalButtons: 27, lifeStage: 'Smolt' },
}

export const yoloButtonLookup: any = {
  '25-29': {
    firstButton: 25,
    additionalButtons: 4,
    lifeStage: 'Yolk Sac Fry',
  },
  '30-40': { firstButton: 30, additionalButtons: 10, lifeStage: 'Fry' },
  '41-59': { firstButton: 41, additionalButtons: 18, lifeStage: 'Parr' },
  '60-89': {
    firstButton: 60,
    additionalButtons: 29,
    lifeStage: 'Silvery Parr',
  },
  '90-117+': { firstButton: 90, additionalButtons: 27, lifeStage: 'Smolt' },
}

export const getButtonLookup = (selectedProgramObj: any) => {
  if (selectedProgramObj?.programName?.includes('Yolo')) {
    return yoloButtonLookup
  } else {
    return buttonLookup
  }
}

export const calculateLifeStage = (forkLength: number) => {
  //look over the the values of lookup, return the first key that is >= forkLength
  const lifeStageLookup: any = {
    'Yolk Sac Fry': 29,
    Fry: 40,
    Parr: 59,
    'Silvery Parr': 89,
    Smolt: 105,
  }
  for (const key in lifeStageLookup) {
    if (forkLength <= lifeStageLookup[key]) {
      return key
    }
  }
}

export const QARanges = {
  flowMeasure: {
    'Mill Creek': {
      'Mill Creek RST': { max: 2000, min: null },
    },
    'Deer Creek': {
      'Deer Creek RST': { max: 2000, min: null },
    },
    'Feather River': {
      'Eye Riffle': {
        'Eye riffle north': { max: 8000, min: 50 },
        'Eye riffle Side Channel': { max: 8000, min: 50 },
      },
      'Live Oak': { max: 25000, min: 50 },
      'Herringer Riffle': {
        'Herringer east': { max: 25000, min: 50 },
        'Herringer west': { max: 25000, min: 50 },
        'Herringer Upper west': { max: 25000, min: 50 },
      },
      'Sunset Pumps': {
        'Sunset East Bank': { max: 25000, min: 50 },
        'Sunset West Bank': { max: 25000, min: 50 },
      },
      'Shawns Beach': {
        'Shawns East': { max: 25000, min: 50 },
        'Shawns West': { max: 25000, min: 50 },
      },
      'Gateway Riffle': {
        'Gateway main1': { max: 8000, min: 50 },
        'Gateway Rootball': { max: 8000, min: 50 },
        "Gateway Main 400' Up River": { max: 8000, min: 50 },
        'Gateway Rootball River Left': { max: 8000, min: 50 },
      },
      'Steep Riffle': {
        'Steep Side Channel': { max: 6000, min: 50 },
        "Steep Riffle 10' ext": { max: 6000, min: 50 },
        'Steep Riffle RST': { max: 6000, min: 50 },
      },
    },
    'Yuba River': {
      Hallwood: {
        'Hallwood 1': { max: 15000, min: 50 },
        'Hallwood 2': { max: 15000, min: 50 },
        'Hallwood 3': { max: 15000, min: 50 },
      },
    },
    'FlowWest Test': {
      'FlowWest Test': {
        'FlowWest test 1': { max: 2000, min: 50 },
        'FlowWest test 2': { max: 2000, min: 50 },
      },
    },
  } as any,
  waterTemperature: { maxF: 100, maxC: 30, min: null },
  waterTurbidity: { max: 1000, min: null },
  coneDepth: { max: 100, min: null }, //need actual values
  totalRevolutions: { max: 25000, min: null },
  RPM: { max: 30 },
  forkLength: { maxAdult: 1000, maxJuvenile: 100, min: null },
  weight: { maxAdult: 400, maxJuvenile: 50, min: null },
  markNumber: { max: 1000, min: null }, //need actual values
  plusCount: { max: 1000, min: null }, //need actual values
  debrisVolume: { max: 2000, min: null },
}

export const returnDefinitionArray = (dropdownsArray: any[]) => {
  return dropdownsArray?.map((dropdownObj: any) => {
    return dropdownObj.definition
  })
}

export const returnNullableTableId = (value: any) =>
  value == -1 ? null : value + 1

export const markBadgeLookup = {
  type: {
    none: 'n',
    elastomer: 'ela',
    'fin clip': 'fin',
    'pigment/dye': 'p/d',
    'coded wire tag (cwt)': 'cwt',
    'freeze brand (bar)': 'bar',
    'freeze brand (dot)': 'dot',
    'pit tag': 'pit',
    'acoustic telemetry tag': 'att',
    'radio telemetry tag': 'rtt',
    'floy tag': 'ft',
    'photonic dye': 'pho',
    'not recorded': 'nr',
    'bismark brown': 'bis',
  },
  color: {
    black: 'bl',
    blue: 'bu',
    brown: 'br',
    'cobalt blue': 'cb',
    'dark blue': 'db',
    'fluorescent blue': 'fb',
    'fluorescent green': 'fg',
    'fluorescent red': 'fr',
    green: 'g',
    magenta: 'm',
    orange: 'o',
    pink: 'pi',
    purple: 'pu',
    red: 'r',
    white: 'w',
    yellow: 'y',
    'not recorded': 'nr',
  },
  position: {
    'adipose fin': 'adf',
    'anal fin': 'af',
    'caudal fin': 'cf',
    'dorsal fin': 'df',
    head: 'h',
    'internal/coelom': 'i/c',
    'left side': 'ls',
    'left side, back': 'lsb',
    'left side, front': 'lsf',
    nose: 'n',
    'pectoral fin': 'pf',
    'pelvic fin': 'pvf',
    'right side': 'rs',
    'right side, back': 'rsb',
    'right side, front': 'rsf',
    'whole body': 'wb',
    'not recorded': 'nr',
  },
}

export const getSubstring = (
  str: string,
  start: string,
  end: string
): string => {
  let char1 = str.indexOf(start) + 1
  let char2 = str.lastIndexOf(end)
  return str.substring(char1, char2)
}

export function gaussianKernel(x: number) {
  return (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * x * x)
}

export function kernelDensityEstimation(
  data: number[],
  bandwidth: number,
  grid: number[]
): number[] {
  const density: number[] = []

  for (let i = 0; i < grid.length; i++) {
    let sum = 0
    for (let j = 0; j < data.length; j++) {
      const u = (grid[i] - data[j]) / bandwidth
      sum += gaussianKernel(u)
    }
    density[i] = sum / (data.length * bandwidth)
  }

  return density
}

export const useDebounce = <T>(value: T, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(timeout)
  }, [value, delay])

  return debouncedValue
}

export const navigateHelper = (
  destination: string | undefined,
  navigationState: any,
  navigation: any,
  dispatch: any,
  updateActiveStep: any
) => {
  if (!destination) {
    navigation?.navigate('Home')
    return
  }

  const formSteps = Object.values(navigationState?.steps) as any
  let payload = null
  for (let i = 0; i < formSteps.length; i++) {
    if (formSteps[i].name === destination) {
      payload = i + 1
    }
  }

  navigation.dispatch(StackActions.replace(destination))
  dispatch({
    type: updateActiveStep,
    payload: payload,
  })
}

export const navigateFlowRightButton = ({
  values,
  activePage,
  holdingForMarkRecap,
  navigation,
  warnings,
  tabValues,
}: {
  values: any
  activePage: string
  holdingForMarkRecap: boolean
  navigation: any
  warnings?: any
  tabValues?: any
}) => {
  //this is now kind of redundant with the implementation of the loading screen
  switch (activePage) {
    case 'Visit Setup':
      return 'Trap Operations'
    case 'Trap Operations':
      if (values?.trapStatus === 'trap not functioning') {
        return 'Non Functional Trap'
      } else if (
        values?.trapStatus === 'trap not in service - restart trapping'
      ) {
        return 'Started Trapping'
      } else if (warnings?.warningResultFlow) {
        return 'High Flows'
      } else if (warnings?.warningResultTemp) {
        return 'High Temperatures'
      } else if (values.gearStatus === 'S') {
        return 'Trap Post-Processing'
      } else {
        return 'Fish Processing'
      }
    case 'Fish Processing':
      if (tabValues?.length) {
        if (some(tabValues, { fishProcessedResult: 'processed fish' })) {
          return 'Fish Input'
        } else if (
          every(tabValues, { fishProcessedResult: 'no fish caught' })
        ) {
          return 'Trap Post-Processing'
          // return 'No Fish Caught'
        } else {
          return 'Trap Post-Processing'
        }
      }

      if (values?.fishProcessedResult === 'no fish caught') {
        return 'Trap Post-Processing'
      } else if (
        values?.fishProcessedResult ===
          'no catch data, fish left in live box' ||
        values?.fishProcessedResult === 'no catch data, fish released'
      ) {
        return 'Trap Post-Processing'
      } else {
        return 'Fish Input'
      }
    case 'Fish Input':
      return 'Trap Post-Processing'
    case 'Trap Post-Processing':
      if (holdingForMarkRecap) {
        return 'Fish Holding'
      } else {
        return 'Incomplete Sections'
      }
    case 'Fish Holding':
      return 'Incomplete Sections'
    case 'Incomplete Sections':
      console.log('🚀 INCOMPLETE SECTIONS CASE HIT')
      return 'Start Mark Recapture'
    case 'High Flows':
      return 'End Trapping'
    case 'High Temperatures':
      return 'Fish Processing'
    case 'No Fish Caught':
      return 'Trap Post-Processing'
    case 'Paper Entry':
      return 'Trap Operations'
    case 'Started Trapping':
      navigation?.navigate('Home')
      break
    default:
      console.log('HIT DEFAULT, SHOULD NOT HAPPEN')
      navigation?.navigate('Home')
      break
  }
}

export const navigateFlowLeftButton = (
  activePage: string,
  holdingForMarkRecap: boolean,
  navigation: any,
  values?: any
) => {
  switch (activePage) {
    case 'Trap Operations':
      // if (isPaperEntryStore) navigateHelper('Paper Entry')
      return 'Visit Setup'
    case 'High Flows':
      return 'Trap Operations'
    case 'High Temperatures':
      return 'Trap Operations'
    case 'Non Functional Trap':
      return 'Trap Operations'
    case 'Fish Processing':
      return 'Trap Operations'
    case 'No Fish Caught':
      return 'Fish Processing'
    case 'Fish Input':
      return 'Fish Processing'
    case 'Paper Entry':
      return 'Visit Setup'
    case 'Started Trapping':
      return 'Trap Operations'
    case 'Trap Post-Processing':
      console.log('🚀 TRAP POST PROCESSING CASE HIT', values)
      if (values?.fishProcessedResult === 'no fish caught') {
        return 'Fish Processing'
      } else if (values?.fishProcessedResult?.includes('no catch data')) {
        return 'Fish Processing'
      } else {
        return 'Fish Input'
      }
    case 'Fish Holding':
      return 'Trap Post-Processing'
    case 'Incomplete Sections':
      if (holdingForMarkRecap) {
        return 'Fish Holding'
      } else {
        return 'Trap Post-Processing'
      }
    default:
      console.log('HIT DEFAULT, SHOULD NOT HAPPEN')
      navigation?.navigate('Home')
      break
  }
}

export const getRandomColor = () => {
  // Generate random values for red, green, and blue channels
  var red = Math.floor(Math.random() * 256)
  var green = Math.floor(Math.random() * 256)
  var blue = Math.floor(Math.random() * 256)

  // Convert decimal values to hexadecimal
  var redHex = red.toString(16).padStart(2, '0')
  var greenHex = green.toString(16).padStart(2, '0')
  var blueHex = blue.toString(16).padStart(2, '0')

  // Concatenate hexadecimal values to form the color code
  var color = '#' + redHex + greenHex + blueHex

  return color
}

export const capitalizeFirstLetterOfEachWord = (sentence: string) => {
  if (sentence === null || typeof sentence !== 'string') return `${sentence}` // Check if the sentence is not empty
  return sentence
    .split(' ') // Split the sentence into words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
    .join(' ') // Join the words back into a sentence
}

export const truncateAndTrimString = (str: string, length: number) => {
  if (!(str.length > 10)) return str
  return str.length > length ? str.substring(0, length).trim() : str
}

export const normalizeDate = (date: Date) => {
  date.setHours(0)
  date.setMinutes(0)
  date.setSeconds(0)
  date.setMilliseconds(0)

  return date.getTime()
}

export const groupArrayItems = (array: any, size: number) => {
  const groupedItems = []
  for (let i = 0; i < array.length; i += size) {
    groupedItems.push(array.slice(i, i + size))
  }
  return groupedItems
}
export const handleQCChartButtonClick = (
  allButtons: Array<string>,
  activeButtons: Array<string>,
  buttonName: string
) => {
  let activeButtonsCopy = [...activeButtons]
  if (activeButtons.includes(buttonName)) {
    activeButtonsCopy.splice(activeButtonsCopy.indexOf(buttonName), 1)
  } else {
    activeButtonsCopy.push(buttonName)
    activeButtonsCopy = sortBy(activeButtonsCopy, button => {
      return allButtons.indexOf(button)
    })
  }
  return activeButtonsCopy
}

export const combinePlusCounts = (arr: Array<any>) => {
  const map = new Map()
  const result = [] as Array<any>

  arr.forEach(item => {
    if (item.plusCount) {
      const key = `${item.taxonCode}_${item.lifeStage}_${item.captureRunClass}`
      if (!map.has(key)) {
        map.set(key, {
          ...item,
          numFishCaught: Number(item.numFishCaught),
        })
      } else {
        const existing = map.get(key)
        existing.numFishCaught += Number(item.numFishCaught)
      }
    } else {
      result.push({ ...item, numFishCaught: Number(item.numFishCaught) })
    }
  })

  return [...result, ...Array.from(map.values())]
}

export const legendColorList = [
  '#007C7C',
  '#F9A38C',
  '#D1E8F0',
  '#011936',
  '#564e58',
  '#846075',
  '#2b3a67',
  '#772E25',
  '#FBA72A',
  '#C0CAAD',
]

export const addFishErrorMessages = {
  species: { emptyError: 'Fish species required' },
  forkLength: {
    typeError: 'Value must be a number',
    emptyError: 'Fish fork length required',
  },
  weight: { typeError: 'Value must be a number' },
  lifeStage: { emptyError: 'Fish life stage required' },
  adiposeClipped: { emptyError: 'Fish adipose clipped status required' },
  dead: { emptyError: 'Fish mortality required' },
}

export const decodedRecentReleaseMarks = (
  dropdownValues: any,
  programId: number
) => {
  const releaseMarks = dropdownValues.releaseMarks
  const markTypeValues = returnDefinitionArray(dropdownValues.markType)
  const markColorValues = returnDefinitionArray(dropdownValues.markColor)
  const bodyPartValues = returnDefinitionArray(dropdownValues.bodyPart)

  const currentYear = new Date().getFullYear()

  return releaseMarks
    .filter(
      (mark: ReleaseMarkI) =>
        mark.programId === programId &&
        new Date(mark.releasedAt).getFullYear() === currentYear
    )
    .slice(0, 2)
    .map((mark: ReleaseMarkI) => {
      return {
        ...mark,
        markType: markTypeValues[mark.markType - 1],
        markColor: markColorValues[mark.markColor - 1],
        markPosition: bodyPartValues[mark.markPosition - 1],
      }
    })
}

export const renderRequiredOrOptionalLabel = ({
  fieldName,
  validationSchema,
}: {
  fieldName: string
  validationSchema: any
}) => {
  if (validationSchema?.fields?.[fieldName]?.exclusiveTests?.required) {
    return '*'
  } else {
    return ''
  }
}
export const createFormValueDefault = ({
  value,
  required = false,
  error = '',
  touched = false,
}: {
  value: Array<any> | string | boolean | null
  required?: boolean
  error?: string
  touched?: boolean
}) => {
  return { value, touched, error, required }
}

export const getCrewValue = ({
  visitSetupValues,
  visitSetupDefaultState,
  fieldCheckValue,
}: {
  visitSetupValues: {
    crew: string[]
    dataRecorder?: string
  }
  visitSetupDefaultState: { crewMembers: any[] }
  fieldCheckValue?: string | null
}) => {
  const selectedCrewNames: string[] = [...visitSetupValues.crew] // ['james', 'steve']

  const allCrewObjects = flatten(visitSetupDefaultState.crewMembers) // [{..., name: 'james', programId: 1},]

  const selectedCrewNamesMap: any = selectedCrewNames.reduce(
    (acc, name: string) => ({
      ...acc,
      [name]: true,
    }),
    {}
  )

  const filteredCrewIds = uniqBy(
    allCrewObjects
      .filter(
        (obj: any) => selectedCrewNamesMap[`${obj.firstName} ${obj.lastName}`]
      )
      .map((obj: any) => {
        let dataRecorder = null
        if (visitSetupValues.dataRecorder) {
          dataRecorder =
            `${obj.firstName} ${obj.lastName}` === visitSetupValues.dataRecorder
        }

        let fieldCheck = null
        if (fieldCheckValue) {
          fieldCheck = `${obj.firstName} ${obj.lastName}` === fieldCheckValue
        }

        return {
          personnelId: Number(obj.personnelId),
          dataRecorder,
          fieldCheck,
        }
      }),
    'personnelId'
  )
  return filteredCrewIds
}

export const calcAvgValue = (valuesArray: (string | null)[]) => {
  const validValues = valuesArray.filter(n => n)
  if (!validValues.length) {
    return null
  }
  const numericValues = validValues.map((str: any) => parseFloat(str))
  let counter = 0
  numericValues.forEach((num: number) => {
    counter += num
  })
  return counter / numericValues.length
}

export const groupBySpeciesForkLength = (data: Array<any>) => {
  const result = {} as any
  let totalCount = 0 as number

  Object.values(data).forEach((fish: any) => {
    const { species, forkLength, numFishCaught, run } = fish

    totalCount += Number(numFishCaught)

    if (fish.plusCount) {
      const key = `${species} - ${
        run && run !== 'not recorded' ? run : ''
      } Plus Count`
      if (!result[key]) {
        result[key] = Number(numFishCaught)
      } else {
        result[key] += Number(numFishCaught)
      }
      return
    }

    if (!result[species]) {
      result[species] = []
    }

    // Add `forkLength` repeated `numFishCaught` times
    for (let i = 0; i < numFishCaught; i++) {
      if (forkLength) {
        result[species].push(forkLength)
      }
    }
  })

  // Sort the result object by its keys alphabetically
  const sortedResult = Object.keys(result)
    .sort()
    .reduce((acc, key) => {
      acc[key] = result[key]
      return acc
    }, {} as any)

  Object.assign(result, sortedResult)

  sortedResult['totalCount'] = totalCount

  return sortedResult
}

export const mergePreserveNonNull = (...objects: Record<string, any>[]) => {
  return objects.reduce((acc, obj) => {
    for (const [key, value] of Object.entries(obj)) {
      if (value !== null || !(key in acc)) {
        acc[key] = value
      }
    }
    return acc
  }, {} as Record<string, any>)
}

export const getAddFishStateDefaults = () => {
  return {
    whenSpeciesChinook: {
      species: createFormValueDefault({ value: null, required: true }),
      count: createFormValueDefault({ value: null }),
      forkLength: createFormValueDefault({ value: null, required: true }),
      run: createFormValueDefault({ value: null }),
      weight: createFormValueDefault({ value: null }),
      lifeStage: createFormValueDefault({ value: null, required: true }),
      adiposeClipped: createFormValueDefault({
        value: false,
        touched: true,
        required: true,
      }),
      existingMarks: createFormValueDefault({ value: [] }),
      appliedMarks: createFormValueDefault({ value: [] }),
      geneticSamples: createFormValueDefault({ value: [] }),
      dead: createFormValueDefault({
        value: false,
        touched: true,
        required: true,
      }),
      milting: createFormValueDefault({
        value: false,
        touched: true,
        required: false,
      }),
      eggs: createFormValueDefault({
        value: false,
        touched: true,
        required: false,
      }),
      plusCountMethod: createFormValueDefault({ value: null }),
      fishConditions: createFormValueDefault({ value: [] }),
      comments: createFormValueDefault({ value: null }),
    },
    whenSpeciesSteelhead: {
      species: createFormValueDefault({ value: null, required: true }),
      count: createFormValueDefault({ value: null }),
      forkLength: createFormValueDefault({ value: null, required: true }),
      run: createFormValueDefault({ value: null }),
      weight: createFormValueDefault({ value: null }),
      lifeStage: createFormValueDefault({ value: null, required: true }),
      adiposeClipped: createFormValueDefault({
        value: null,
        touched: true,
      }),
      existingMarks: createFormValueDefault({ value: [] }),
      appliedMarks: createFormValueDefault({ value: [] }),
      geneticSamples: createFormValueDefault({ value: [] }),
      dead: createFormValueDefault({
        value: false,
        touched: true,
        required: true,
      }),
      milting: createFormValueDefault({
        value: false,
        touched: true,
        required: false,
      }),
      eggs: createFormValueDefault({
        value: false,
        touched: true,
        required: false,
      }),
      plusCountMethod: createFormValueDefault({ value: null }),
      fishConditions: createFormValueDefault({ value: [] }),
      comments: createFormValueDefault({ value: null }),
    },
    whenSpeciesOther: {
      species: createFormValueDefault({ value: null, required: true }),
      count: createFormValueDefault({ value: null }),
      forkLength: createFormValueDefault({ value: null, required: true }),
      run: createFormValueDefault({ value: null }),
      weight: createFormValueDefault({ value: null }),
      lifeStage: createFormValueDefault({ value: null }),
      adiposeClipped: createFormValueDefault({
        value: null,
        touched: true,
        required: false,
      }),
      existingMarks: createFormValueDefault({ value: [] }),
      appliedMarks: createFormValueDefault({ value: [] }),
      geneticSamples: createFormValueDefault({ value: [] }),
      dead: createFormValueDefault({
        value: false,
        touched: true,
        required: true,
      }),
      milting: createFormValueDefault({
        value: false,
        touched: true,
        required: false,
      }),
      eggs: createFormValueDefault({
        value: false,
        touched: true,
        required: false,
      }),
      plusCountMethod: createFormValueDefault({ value: null }),
      fishConditions: createFormValueDefault({ value: [] }),
      comments: createFormValueDefault({ value: null }),
    },
  }
}

export const checkFishMeasureProtocol = ({
  fishMeasureCounts,
  fishMeasureProtocol,
  speciesValue,
  runValue,
  lifeStageValue,
}: {
  fishMeasureCounts: any
  fishMeasureProtocol: Record<string, number>
  speciesValue: string
  runValue: string
  lifeStageValue: string
}) => {
  // This function is a placeholder for future implementation
  // It currently does nothing and returns undefined
  // You can add your logic here when needed
  const protocol = fishMeasureProtocol

  if (typeof speciesValue === 'string' && speciesValue && protocol) {
    // Sum all counts that match any protocol key beginning with the current species
    let protocolMet = false
    let protocolKeyMet = null as string | null

    for (const protoKey of Object.keys(protocol)) {
      if (protoKey.startsWith(speciesValue)) {
        if (protoKey.includes(' - ')) {
          if (!runValue && !lifeStageValue) {
            // protocol has run or lifestage but form values do not match. not met
            continue
          }
          // Extract the species part from the protocol key
          const protocolParts = protoKey.split(' - ')
          const protoRunOrLifestageName = protocolParts[1] || ''
          const protoLifeStageName = protocolParts[2] || ''

          if (
            protoRunOrLifestageName &&
            protoRunOrLifestageName !== lifeStageValue &&
            protoRunOrLifestageName !== runValue
          ) {
            // protocol has run or lifestage but form values do not match. not met
            continue
          } else if (
            protoRunOrLifestageName &&
            protoRunOrLifestageName !== runValue &&
            protoLifeStageName &&
            protoLifeStageName !== lifeStageValue
          ) {
            //protocol has run and life stage but form values do not match. not met
            continue
          }
        }

        const threshold = protocol[protoKey]

        // Sum individualCounts of all matching fishMeasureCounts keys
        const matchingSum = Object.entries(fishMeasureCounts).reduce(
          (sum, [key, count]) => {
            return key.startsWith(protoKey)
              ? sum +
                  ((count as { individualCount?: number }).individualCount || 0)
              : sum
          },
          0
        )

        if (matchingSum >= threshold) {
          protocolMet = true

          protocolKeyMet = protoKey
          break
        }
      }
    }
    return {
      protocolMet,
      protocolKeyMet,
    }
  }
}

export const calculateLastFish = (
  forkLengths: Record<string, any> | null | undefined
): any | null => {
  if (!forkLengths || !Object.values(forkLengths).length) return null

  const values = Object.values(forkLengths)
  const lastObject = values[values.length - 1] as any
  return lastObject || null
}

export const getProgramFormFieldsLookup = (
  visitSetupState: any,
  visitSetupDefaultState: any
) => {
  if (!visitSetupDefaultState || !visitSetupDefaultState.programs) return {}
  const programId = visitSetupState.programId
  const selectedProgramObj = find(
    visitSetupDefaultState.programs,
    (program: any) => program.id === programId
  )
  const programFormFields = selectedProgramObj.programFormFields
  const programFormFieldsObj = programFormFields?.length
    ? keyBy(programFormFields, 'fieldName')
    : {}
  return programFormFieldsObj
}

export const shouldRenderField = ({
  fieldName,
  programFormFields,
  sectionFields,
}: {
  fieldName: string
  programFormFields: Array<any> | null
  sectionFields: Array<any> | null
}) => {
  if (!programFormFields?.length) {
    return true
  }

  if (programFormFields?.length && sectionFields) {
    return sectionFields.some((field: any) => {
      return field.fieldName === fieldName
    })
  }

  return false
}

const getNextSampleSuffix = ({
  arr,
  taxonAbbreviation,
  suffixPadding = 3,
}: {
  arr: { sampleId?: string }[]
  taxonAbbreviation?: string
  suffixPadding?: number
}) => {
  let filtered = arr

  if (taxonAbbreviation) {
    filtered = arr.filter(item =>
      (item.sampleId ?? '').includes(taxonAbbreviation)
    )
  }

  if (filtered.length === 0) {
    return '001' // No existing samples for this taxon, start from 001
  }

  const currentHighestSampleSuffix = filtered.reduce((max, curr) => {
    const getSuffix = (sampleId: string | undefined) =>
      parseInt((sampleId ?? '').split('_').pop() ?? '', 10)

    return getSuffix(curr.sampleId) > getSuffix(max.sampleId) ? curr : max
  })

  const test = (currentHighestSampleSuffix.sampleId ?? '').split('_').pop()
  const nextSampleSuffixNumber = test ? parseInt(test, 10) + 1 : 1

  // Pad with leading zeros to at least 3 digits
  const nextSampleSuffix = nextSampleSuffixNumber
    .toString()
    .padStart(suffixPadding, '0')

  return nextSampleSuffix
}

export const formatGeneticsSampleId = ({
  programName,
  species,
  geneticSamplesArray,
  taxonArray = [],
}: {
  programName: string
  species: string
  geneticSamplesArray: any[]
  taxonArray?: any[]
}) => {
  let sampleId = ''

  const programNameLower = programName.toLowerCase()

  if (programNameLower.includes('yolo')) {
    const currentYear = new Date().getFullYear()

    if (species.toLowerCase().includes('chinook')) {
    } else {
      const taxonObj = taxonArray.find(
        (item: any) => item.commonname === species
      )
      const taxonAbbreviation = taxonObj?.abbreviationCode
      console.log('taxonAbbreviation', taxonAbbreviation)

      if (!taxonAbbreviation) {
        return sampleId
      }

      const sampleIdSuffix = getNextSampleSuffix({
        arr: geneticSamplesArray,
        taxonAbbreviation,
        suffixPadding: 3,
      })
      console.log('sampleIdSuffix', sampleIdSuffix)
      sampleId = `${currentYear}_${taxonAbbreviation}_${sampleIdSuffix}`
    }
  } else if (
    programNameLower.includes('battle') ||
    programNameLower.includes('clear')
  ) {
    // get last two digits of the current year
    const currentYear = new Date().getFullYear().toString().slice(-2)

    const sampleIdSuffix = getNextSampleSuffix({
      arr: geneticSamplesArray,
      suffixPadding: 4,
    })

    sampleId = `${currentYear}_${sampleIdSuffix}`
  }

  return sampleId
}

export const findTrapLocationIds = (visitSetupState: any) => {
  let container = [] as any
  for (let tabId in visitSetupState) {
    if (tabId === 'placeholderId' || tabId === '_persist') continue
    container.push(visitSetupState[tabId].values.trapLocationId)
  }
  return container
}
