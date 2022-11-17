//get the initials from a provided name: string
export const getInitials = (name: string) => {
  let rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu')

  let initials = [...name.matchAll(rgx)] || []

  const result = (
    (initials.shift()?.[1] || '') + (initials.pop()?.[1] || '')
  ).toUpperCase()

  return result
}

export const reorderTaxon = (taxon: Array<any>) => {
  //sort the taxon
  const alphabeticalTaxon = [...taxon].sort((a, b) => {
    if (a.commonname < b.commonname) return -1
    if (a.commonname > b.commonname) return 1
    return 0
  })
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
