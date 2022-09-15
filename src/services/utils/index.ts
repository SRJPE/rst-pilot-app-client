/*
  Standard Form Flow Steps **current source of truth**
*/
const formSteps = [
  { name: 'Visit Setup', completed: false },
  { name: 'Trap Status', completed: false },
  { name: 'Trap Operations', completed: false },
  { name: 'Fish Processing', completed: false },
  { name: 'Fish Input', completed: false },
] as Array<any>

// the number of steps in the form
export const formStepLength = formSteps.length

//return the current position in the standard form flow
export const getPosition = (name: string) => {
  for (let i = 0; i < formSteps.length; i++) {
    if (formSteps[i].name === name) {
      return i + 1
    }
  }
}

//return the string of the next step in the standard form flow
export const goForward = (name: string) => {
  let index = 0
  for (let i = 0; i < formSteps.length; i++) {
    if (formSteps[i].name === name) {
      index = i
    }
  }
  return formSteps[index + 1]?.name || formSteps[formSteps.length - 1]?.name
}

//return the string of the previous step in the standard form flow
export const goBack = (name: string) => {
  let index = 0
  for (let i = 0; i < formSteps.length; i++) {
    if (formSteps[i].name === name) {
      index = i
    }
  }
  return formSteps[index - 1]?.name || formSteps[0]?.name
}

//get the initials from a provided name: string
export const getInitials = (name: string) => {
  let rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu')

  let initials = [...name.matchAll(rgx)] || []

  const result = (
    (initials.shift()?.[1] || '') + (initials.pop()?.[1] || '')
  ).toUpperCase()

  return result
}
