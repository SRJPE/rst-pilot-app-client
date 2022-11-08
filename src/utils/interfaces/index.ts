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

export interface FishProcessingInitialValues {
  fishProcessed: string
  reasonForNotProcessing: string
}
