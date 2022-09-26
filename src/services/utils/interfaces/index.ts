// INITIAL FORM VALUES

export interface TrapVisitInitialValues {
  stream: string
  trapSite: string
  trapSubSite: string
  crew: Array<string>
}
export interface TrapStatusInitialValues {
  trapStatus: string
  reasonNotFunc: string
  flowMeasure: string
  waterTemperature: string
  waterTurbidity: string
}
export interface TrapOperationsInitialValues {
  coneDepth: string
  coneSetting: string
  totalRevolutions: string
  checked: any
  rpm1: number
  rpm2: number
  rpm3: number
}
