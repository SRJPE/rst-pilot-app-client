/**
 * Pure numeric helpers with no React Native / navigation dependencies, so
 * data-shaping modules can import them without dragging in the whole app.
 *
 * Re-exported from utils.ts so existing call sites keep working unchanged.
 */

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
