import * as yup from 'yup'

export const trapVisitSchema = yup.object().shape({
  stream: yup.string().required('Stream required'),
  trapSite: yup.string().required('Trap site required'),
  crew: yup.array().min(1).required('Crew cannot be blank.'),
})

export const trapStatusSchema = yup.object().shape({
  trapStatus: yup.string().required('Trap Status Required'),
  // reasonNotFunc: yup
  //   .string()
  //   .test('test', 'message', function (value: any) {
  //     const { trapStatus } = this.parent
  //     console.log('🚀 ~ trapStatus', trapStatus)
  //     return (
  //       trapStatus === 'trap functioning but not normally' ||
  //       trapStatus === 'trap not functioning'
  //     )
  //   })
  //   .required('test message'),

  // flowMeasure: yup
  //   .number()
  //   .required('Flow Measure Required')
  //   .typeError('Input must be a number'),
  flowMeasureUnit: yup.string(),
  waterTemperature: yup
    .number()
    .required('Water Temperature Required')
    .typeError('Input must be a number'),
  waterTemperatureUnit: yup.string(),
  waterTurbidity: yup
    .number()
    .required('Water Turbidity Required')
    .typeError('Input must be a number'),
  waterTurbidityUnit: yup.string(),
})

export const trapPreProcessingSchema = yup.object().shape({
  coneDepth: yup
    .number()
    .required('Cone depth required')
    .typeError('Input must be a number'),

  totalRevolutions: yup
    .number()
    .required('Total Revolutions Required')
    .typeError('Input must be a number'),
  rpm1: yup
    .number()
    .required('Measurement 1 required')
    .typeError('Input must be a number'),
  rpm2: yup
    .number()
    .required('Measurement 2 required')
    .typeError('Input must be a number'),
  rpm3: yup
    .number()
    .required('Measurement 3 required')
    .typeError('Input must be a number'),
})
export const trapPostProcessingSchema = yup.object().shape({
  debrisVolume: yup
    .number()
    .required('Stream required')
    .typeError('Input must be a number'),
  rpm1: yup
    .number()
    .required('Measurement 1 required')
    .typeError('Input must be a number'),
  rpm2: yup
    .number()
    .required('Measurement 2 required')
    .typeError('Input must be a number'),
  rpm3: yup
    .number()
    .required('Measurement 3 required')
    .typeError('Input must be a number'),
})

export const fishProcessingSchema = yup.object().shape({
  fishProcessedResult: yup.string().required('Fish Processed status required'),
  // reasonForNotProcessing: yup.string().required(),
  // .required('Reason for not processing required'),
})

export const addIndividualFishSchema = yup.object().shape({
  species: yup.string().required('Fish species required'),
  forkLength: yup
    .number()
    .required('Fish fork length required')
    .typeError('Input must be a number'),
  run: yup
    .number()
    .required('Fish fork length required')
    .typeError('Input must be a number'),
  weight: yup.number().typeError('Input must be a number'),
  lifeStage: yup.string().required('Fish life stage required'),
  adiposeClipped: yup
    .boolean()
    .required('Fish adipose clipped status required'),
  existingMark: yup.string(),
  dead: yup.boolean().required('Fish mortality required'),
  willBeUsedInRecapture: yup
    .boolean()
    .required('Marked for recapture required'),
})

export const releaseTrialSchema = yup.object().shape({
  wildCount: yup
    .number()
    .required('Wild count is required')
    .typeError('Input must be a number'),
  deadWildCount: yup
    .number()
    .required('Dead wild count is required')
    .typeError('Input must be a number'),
  willSupplement: yup.boolean().required('Field required'),
  hatcheryCount: yup
    .number()
    .required('Hatchery count is required')
    .typeError('Input must be a number'),
  runIDHatchery: yup.string().required('Hatchery Count is required'),
  runWeightHatchery: yup
    .number()
    .required('Hatchery run weight is required')
    .typeError('Input must be a number'),
  deadHatcheryCount: yup
    .number()
    .required('Hatchery dead count is required')
    .typeError('Input must be a number'),
})

export const addMarksOrTagsSchema = yup.object().shape({
  type: yup.string().required('Mark Type is required'),
  number: yup.string().required('Mark Number is required'),
  position: yup.string().required('Mark Position is required'),
  crewMemberTagging: yup.string().required('Crew Member is required'),
  comments: yup.string(),
})

export const addGeneticsSampleSchema = yup.object().shape({
  sampleIdNumber: yup.string().required('Sample ID Number required'),
  mucusSwabCollected: yup
    .boolean()
    .required('Mucus Swab collection status required'),
  finClipCollected: yup
    .boolean()
    .required('Fin Clip collection status required'),
  crewMemberCollectingSample: yup.string().required('Crew Member required'),
  comments: yup.string(),
})

export const addPlusCountsSchema = yup.object().shape({
  species: yup.string().required('Species required'),
  lifeStage: yup.string().required('Life stage required'),
  run: yup.string().required('Run required'),
  count: yup
    .number()
    .required('Fish fork length required')
    .typeError('Input must be a number'),
  plusCountMethod: yup.string().required('Plus count method required'),
})
