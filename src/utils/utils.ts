import { useEffect, useState } from 'react'
import { sortBy } from 'lodash'

export const alphabeticalSort = (arrayToSort: Array<any>, name: string) => {
  //returns an alphabetically sorted copy of the original array
  const alphabeticalArray = [...arrayToSort].sort((a, b) => {
    if (a[name] < b[name]) return -1
    if (a[name] > b[name]) return 1
    return 0
  })
  return alphabeticalArray
}

export const reorderTaxon = (taxon: Array<any>) => {
  //sort the taxon
  const alphabeticalTaxon = alphabeticalSort(taxon, 'commonname')
  //move chinook and steelhead to the front
  let chinook, steelhead
  for (var i = 0; i < alphabeticalTaxon.length; i++) {
    if (alphabeticalTaxon[i].commonname === 'Chinook salmon') {
      chinook = alphabeticalTaxon[i]
      alphabeticalTaxon.splice(i, 1)
    }
    if (alphabeticalTaxon[i].commonname === 'Steelhead / rainbow trout') {
      steelhead = alphabeticalTaxon[i]
      alphabeticalTaxon.splice(i, 1)
    }
  }
  alphabeticalTaxon.unshift(chinook, steelhead)
  return alphabeticalTaxon
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
  '90-105': { firstButton: 90, additionalButtons: 15, lifeStage: 'Smolt' },
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
  destination: string,
  navigationState: any,
  navigation: any,
  dispatch: any,
  updateActiveStep: any
) => {
  const formSteps = Object.values(navigationState?.steps) as any
  let payload = null
  for (let i = 0; i < formSteps.length; i++) {
    if (formSteps[i].name === destination) {
      payload = i + 1
    }
  }

  navigation.navigate('Trap Visit Form', { screen: destination })
  dispatch({
    type: updateActiveStep,
    payload: payload,
  })
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
  if (!sentence || typeof sentence === 'number') return sentence // Check if the sentence is not empty
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
