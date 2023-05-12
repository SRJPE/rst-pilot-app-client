export type TrapGroup = { title: string; groupItems: any[] }
export type GroupTrapKey = `trapSiteGroup-${number}`
// | 'trapSiteGroup-0' | 'trapSiteGroup-1'| 'trapSiteGroup-2' | 'trapSiteGroup-3' | 'trapSiteGroup-4' | 'trapSiteGroup-5'
export interface GroupTrapSiteValues {
  numberOfTrapSites: number
  [key: GroupTrapKey]: TrapGroup
}
