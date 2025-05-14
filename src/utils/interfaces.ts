export interface CrewMember {
  agencyId: number
  email: string
  firstName: string
  id: number
  lastName: string
  role: 'lead' | 'non-lead'
}

export interface FishMeasureProtocol {
  commonname: string
  id: number
  lifeStage: number
  lifeStageName: string
  numberMeasured: number | null
  programId: number
  run: number
  runName: string
  species: string
}

export interface TrappingSite {
  comments: string | null
  coneSizeFt: string
  coordinateSystem: string | null
  createdAt: string
  dataRecorderAgencyId: number
  dataRecorderId: number
  datum: string | null
  gageAgency: number
  gageNumber: string
  id: number
  programId: number
  projection: string | null
  siteName: string
  trapName: string
  updatedAt: string
  xCoord: string
  yCoord: string
}

export interface HatcheryInformation {
  id: number
  hatcheryName?: string
  streamName?: string
  agreementId?: string
  programId?: number
  agreementStartDate?: Date
  agreementEndDate?: Date
  renewalDate?: Date
  frequencyOfFishCollection?: number
  quantityOfFish?: number
  hatcheryFileLink?: string
}

export interface MonitoringProgram {
  createdAt: string
  crewMembers: CrewMember[]
  efficiencyProtocolsDocumentLink: string | null
  fishMeasureProtocol: FishMeasureProtocol[]
  fundingAgency: number
  hatcheryInformation: HatcheryInformation
  id: number
  personnelId: number
  personnelLead: number
  programId: number
  programName: string
  streamName: string
  trappingProtocolsDocumentLink: string | null
  trappingSites: TrappingSite[]
  updatedAt: string
}

export interface ReleaseMarkI {
  id?: number
  releaseId?: number
  markPosition: number
  markType: number
  markColor: number
  programId?: number
  releasedAt?: any
}

export interface FormValueI {
  value: Array<any> | string | boolean | null
  touched: boolean
  error: string
  required: boolean
}

export interface Taxon {
  code: string
  commonname: string
  latinname: string
  kingdomcommon: string
  phylumcommon: string
  classcommon: string
  ordercommon: string
  familycommon: string
  genuscommon: string | null
  speciescommon: string
  subspeciescommon: string | null
  kingdomlatin: string
  phylumlatin: string
  classlatin: string
  orderlatin: string
  familylatin: string
  genuslatin: string
  specieslatin: string
  subspecieslatin: string | null
  createdAt: string // ISO date string
  updatedAt: string // ISO date string
  taxonAbbreviations: string[] // Array of abbreviations
  label: string
  value: string
}

export type TrapVisitResponse = {
  createdTrapVisitResponse: {
    id: number
    programId: number
    visitTypeId: number | null
    trapLocationId: number
    isPaperEntry: boolean
    trapVisitTimeStart: string // ISO date string
    trapVisitTimeEnd: string // ISO date string
    fishProcessed: number | null
    whyFishNotProcessed: number | null
    sampleGearId: number | null
    coneDepth: number | null
    trapInThalweg: boolean | null
    trapFunctioning: number | null
    whyTrapNotFunctioning: number | null
    trapStatusAtEnd: number | null
    totalRevolutions: number | null
    rpmAtStart: string | null
    rpmAtEnd: string | null
    inHalfConeConfiguration: boolean
    debrisVolumeGal: string | null
    createdAt: string // ISO date string
    updatedAt: string // ISO date string
    qcCompleted: boolean | null
    qcCompletedAt: string | null // ISO date string
    comments: string | null
    trapVisitUid: string
    createdBy: number
    qcCompletedBy: number | null
    vegetationCode: string | null
    conditionCode: string | null
    gearStatus: string | null
    ysiNum: string | null
    revCounter: string | null
    tideCode: string | null
    flowDirection: string | null
    weatherCode: string | null
    samplingAltered: boolean | null
    length: number | null
    width: number | null
    depth: number | null
    substrate: string | null
  }
  createdTrapVisitCrewResponse: number[] // Array of crew member IDs
  createdTrapCoordinatesResponse: {
    id: number
    trapVisitId: number
    trapLocationsId: number
    xCoord: number | null
    yCoord: number | null
    datum: string | null
    projection: string | null
  }
  createdTrapVisitEnvironmentalResponse: {
    id: number
    trapVisitId: number
    measureName: string
    measureValueNumeric: string | null
    measureValueText: string | null
    measureUnit: number
  }[]
}
