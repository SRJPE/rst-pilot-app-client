//get the initials from a provided name: string
export const getInitials = (name: string) => {
  let rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu')

  let initials = [...name.matchAll(rgx)] || []

  const result = (
    (initials.shift()?.[1] || '') + (initials.pop()?.[1] || '')
  ).toUpperCase()

  return result
}

export const QARanges = {
  flowMeasure: { max: 3000, min: null },
  waterTemperature: { max: 100, min: null }, //need F/C
  waterTurbidity: { max: 1000, min: null },
  coneDepth: { max: 100, min: null }, //need values
  totalRevolutions: { max: 25000, min: null },
  RPM: { max: 30 },
  forkLength: { max: 1000, min: null }, //need juvenile
  weight: { max: 400, min: null }, //need juvenile
  markNumber: { max: 1000, min: null }, //need values
  plusCount: { max: 1000, min: null }, //need values
  debrisVolume: { max: 2000, min: null },
}
