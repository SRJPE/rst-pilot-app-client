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
  flowMeasure: number | null
  waterTemperature: number | null
  waterTurbidity: number | null
}
export interface TrapOperationsInitialValues {
  coneDepth: string
  coneSetting: string
  totalRevolutions: number | null
  checked: boolean
  rpm1: number | null
  rpm2: number | null
  rpm3: number | null
}

export interface FishProcessingInitialValues {
  fishProcessed: string
  reasonForNotProcessing: string
}
