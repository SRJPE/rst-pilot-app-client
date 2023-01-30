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

export const createArray = (start: number) => {
  var result = []
  for (var i = start; i <= start + 19; i++) {
    result.push(i)
  }
  return result
}

export const buttonLookup: any = {
  '< 20': 0,
  '20-39': 20,
  '40-59': 40,
  '60-79': 60,
  '80-99': 80,
  '100-119': 100,
  '120-139': 120,
  '140-159': 140,
  '> 160': 160,
}

export const QARanges = {
  flowMeasure: { max: 3000, min: null },
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
