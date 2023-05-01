export interface Permit {
  id: number
  category: string
  title: string
  lifeStage: string
  remainingTake: number
  remainingMortality: number
}
export const SAMPLE_PERMITS: { permitted: Permit[]; remaining: Permit[] } = {
  permitted: [
    {
      id: 1,
      category: 'chinook',
      title: 'central valley spring run',
      lifeStage: 'juvenile',
      remainingTake: 300,
      remainingMortality: 3,
    },
    {
      id: 2,
      category: 'chinook',
      title: 'central valley spring run',
      lifeStage: 'adult',
      remainingTake: 200,
      remainingMortality: 10,
    },
    {
      id: 3,
      category: 'huchen',
      title: 'central valley spring run',
      lifeStage: 'adult',
      remainingTake: 200,
      remainingMortality: 10,
    },
    {
      id: 4,
      category: 'pink',
      title: 'central valley spring run',
      lifeStage: 'adult',
      remainingTake: 200,
      remainingMortality: 10,
    },
  ],
  remaining: [
    {
      id: 1,
      category: 'chinook',
      title: 'central valley spring run',
      lifeStage: 'juvenile',
      remainingTake: 12_000,
      remainingMortality: 50,
    },
    {
      id: 2,
      category: 'chinook',
      title: 'central valley spring run',
      lifeStage: 'adult',
      remainingTake: 2_700,
      remainingMortality: 25,
    },
  ],
}
