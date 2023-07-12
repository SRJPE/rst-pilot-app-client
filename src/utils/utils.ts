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
    'Mill Creek': { max: 2000, min: null },
    'Deer Creek': { max: 2000, min: null },
    'Feather River': { max: 5000, min: 800 },
    'Yuba River': { max: 3500, min: 50 },
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

export const getSubstring = (str: string, start: string, end: string): string => {
  let char1 = str.indexOf(start) + 1
  let char2 = str.lastIndexOf(end)
  return str.substring(char1, char2)
}
