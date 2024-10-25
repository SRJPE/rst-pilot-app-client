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
