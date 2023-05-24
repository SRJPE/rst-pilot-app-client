import * as yup from 'yup'

/*----------------------------------------------------------------
  TRAP VISIT SCHEMAS
----------------------------------------------------------------*/

export const trapVisitSchema = yup.object().shape({
  stream: yup.string().required('Stream required'),
  // trapSite: yup.string().required('Trap site required'),
  // crew: yup.array().min(1).required('Crew cannot be blank.'),
})

export const trapOperationsSchema = yup.object().shape({
  trapStatus: yup.string(),
  reasonNotFunc: yup.string().when('trapStatus', {
    is: 'trap functioning but not normally' || 'trap not functioning',
    then: yup.string().required('Reason for not functioning required'),
  }),
  flowMeasure: yup
    .number()
    // .required('Flow Measure Required')
    .nullable()
    .typeError('Input must be a number'),
  flowMeasureUnit: yup.string(),
  waterTemperature: yup
    .number()
    .required('Water Temperature Required')
    .typeError('Input must be a number'),
  waterTemperatureUnit: yup.string(),
  waterTurbidity: yup
    .number()
    .nullable()
    .required('Water Turbidity Required')
    .typeError('Input must be a number'),
  waterTurbidityUnit: yup.string(),

  totalRevolutions: yup
    .number()
    // .transform(value => (isNaN(value) ? undefined : value))
    // .transform((value, originalValue) => {
    //   return originalValue === '' ? undefined : value
    // })
    .nullable()
    .required('Total Revolutions Required')
    .typeError('Input must be a number'),
  rpm1: yup
    .number()
    .required('Measurement 1 required')
    .typeError('Input must be a number'),
  rpm2: yup
    .number()
    .nullable()
    // .required('Measurement 2 required')
    .typeError('Input must be a number'),
  rpm3: yup
    .number()
    .nullable()
    // .required('Measurement 3 required')
    .typeError('Input must be a number'),
})

export const trapPostProcessingSchema = yup.object().shape({
  debrisVolume: yup
    .number()
    .required('Debris volume required')
    .typeError('Input must be a number'),
  rpm1: yup
    .number()
    .required('Measurement 1 required')
    .typeError('Input must be a number'),
  rpm2: yup
    .number()
    .nullable()
    // .required('Measurement 2 required')
    .typeError('Input must be a number'),
  rpm3: yup
    .number()
    .nullable()
    // .required('Measurement 3 required'),
    .typeError('Input must be a number'),
})

export const fishProcessingSchema = yup.object().shape({
  fishProcessedResult: yup.string().required('Fish Processed status required'),
  reasonForNotProcessing: yup.string().when('fishProcessedResult', {
    is:
      'no catch data, fish left in live box' || 'no catch data, fish released',
    then: yup.string().required('Reason for not processing required'),
  }),
  // willBeHoldingFishForMarkRecapture:
})

export const addIndividualFishSchema = yup.object().shape({
  species: yup.string().required('Fish species required'),
  forkLength: yup
    .number()
    .required('Fish fork length required')
    .typeError('Input must be a number'),
  run: yup
    .string()
    // .required('Run required')
    .nullable()
    .typeError('Input must be a number'),
  weight: yup.number().nullable().typeError('Input must be a number'),
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

export const addIndividualFishSchemaOptionalLifeStage = yup.object().shape({
  species: yup.string().required('Fish species required'),
  forkLength: yup
    .number()
    .required('Fish fork length required')
    .typeError('Input must be a number'),
  run: yup
    .string()
    // .required('Run required')
    .nullable()
    .typeError('Input must be a number'),
  weight: yup.number().nullable().typeError('Input must be a number'),
  lifeStage: yup.string(),
  adiposeClipped: yup
    .boolean()
    .required('Fish adipose clipped status required'),
  existingMark: yup.string(),
  dead: yup.boolean().required('Fish mortality required'),
  willBeUsedInRecapture: yup
    .boolean()
    .required('Marked for recapture required'),
})

export const addIndividualFishSchemaOtherSpecies = yup.object().shape({
  species: yup.string().required('Fish species required'),
  forkLength: yup
    .number()
    .required('Fish fork length required')
    .typeError('Input must be a number'),
  run: yup
    .string()
    // .required('Run required')
    .nullable()
    .typeError('Input must be a number'),
  weight: yup.number().nullable().typeError('Input must be a number'),
  lifeStage: yup.string(),
  adiposeClipped: yup.boolean(),
  existingMark: yup.string(),
  dead: yup.boolean().required('Fish mortality required'),
  willBeUsedInRecapture: yup.boolean(),
})

export const addMarksOrTagsSchema = yup.object().shape({
  markType: yup.string().required('Mark Type is required'),
  markCode: yup.number().typeError('Input must be a number'),
  // position: yup.string()
  crewMember: yup.string().required('Crew Member is required'),
  // comments: yup.string(),
})

export const addGeneticsSampleSchema = yup.object().shape({
  sampleId: yup.string().required('Sample ID Number required'),
  mucusSwab: yup.boolean().required('Mucus Swab collection status required'),
  finClip: yup.boolean().required('Fin Clip collection status required'),
  crewMember: yup.string().required('Crew Member required'),
  // comments: yup.string(),
})

export const addPlusCountsSchema = yup.object().shape({
  species: yup.string().required('Species required'),
  // lifeStage: yup.string().required('Life stage required'),
  // run: yup.string().required('Run required'),
  count: yup
    .number()
    .required('Count is required')
    .typeError('Input must be a number'),
  plusCountMethod: yup.string().required('Plus count method required'),
})

/*----------------------------------------------------------------
  MARK RECAPTURE SCHEMAS
----------------------------------------------------------------*/

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
  hatcheryCount: yup.number().when('willSupplement', {
    is: true,
    then: yup
      .number()
      .required('Hatchery count is required')
      .typeError('Input must be a number'),
    otherwise: yup
      .number()
      .transform((value) => (isNaN(value) ? 0 : value))
      .typeError('Input must be a number')
      .notRequired(),
  }),
  runIDHatchery: yup.string().when('willSupplement', {
    is: true,
    then: yup.string().required('Hatchery Run ID is required'),
  }),
  runWeightHatchery: yup.number().when('willSupplement', {
    is: true,
    then: yup
      .number()
      .required('Hatchery run weight is required')
      .typeError('Input must be a number'),
    otherwise: yup
      .number()
      .transform((value) => (isNaN(value) ? 0 : value))
      .typeError('Input must be a number')
      .notRequired(),
  }),
  deadHatcheryCount: yup.number().when('willSupplement', {
    is: true,
    then: yup
      .number()
      .required('Hatchery dead count is required')
      .typeError('Input must be a number'),
    otherwise: yup
      .number()
      .transform((value) => (isNaN(value) ? 0 : value))
      .typeError('Input must be a number')
      .notRequired(),
  }),
})

export const releaseTrialDataEntrySchema = yup.object().shape({
  // markType: yup.string().required('Mark type required'),
  // markColor: yup.string().when('markType', {
  //   is: 'Bismark Brown',
  //   then: yup.string().nullable(),
  //   otherwise: yup.string().required('Mark color required'),
  // }),
  // markPosition: yup.string().when('markType', {
  //   is: 'Bismark Brown',
  //   then: yup.string().nullable(),
  //   otherwise: yup.string().required('Mark position required'),
  // }),
  appliedMarks: yup.array().min(1).required('Must Add at lest one mark.'),
  releaseLocation: yup.string().required('Release location required'),
  // releaseTime: yup.
})

export const addAnotherMarkSchema = yup.object().shape({
  markType: yup.string().required('Mark type required'),
  markColor: yup.string().required('Mark color required'),
  markPosition: yup.string().required('Mark position required'),
})

/*----------------------------------------------------------------
  CREATE NEW PROGRAM SCHEMAS
  ----------------------------------------------------------------*/
//needs to be completed:
export const trappingSitesSchema = yup.object().shape({
  trapName: yup.string().required('Trap name required'),
  trapLatitude: yup
    .number()
    // .nullable()
    .required('Trap latitude required')
    .typeError('Input must be a number'),
  trapLongitude: yup
    .number()
    // .nullable()
    .required('Trap Longitude required')
    .typeError('Input must be a number'),
  coneSize: yup
    .number()
    // .nullable()
    .required('Cone Size required')
    .typeError('Input must be a number'),
  USGSStationNumber: yup
    .number()
    // .nullable()
    .required('Trap latitude required')
    .typeError('Input must be a number'),
  releaseSiteName: yup.string().required('Release site name required'),
  releaseSiteLatitude: yup
    .number()
    // .nullable()
    .required('Trap latitude required')
    .typeError('Input must be a number'),
  releaseSiteLongitude: yup
    .number()
    // .nullable()
    .required('Trap latitude required')
    .typeError('Input must be a number'),
})
export const crewMembersSchema = yup.object().shape({
  firstName: yup.string().required('First name required'),
  lastName: yup.string().required('Last name required'),
  phoneNumber: yup
    .string()
    .required('Phone number required')
    .matches(
      /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/,
      'Phone number is not valid'
    ),
  email: yup
    .string()
    .required('Email required')
    .email('Email format is not valid'),
  agency: yup.string().required('Agency required'),
  orchidID: yup.string().nullable(),
})
export const hatcheryInformationSchema = yup.object().shape({
  hatchery: yup.string().required('Hatchery required'),
  frequencyOfReceivingFish: yup.string().required('Frequency required'),
  expectedNumberOfFishReceivedAtEachPickup: yup
    .number()
    .required('Number of fish required')
    .typeError('Input must be a number'),
})
export const trappingProtocolsSchema = yup.object().shape({
  species: yup.string().required('Species required'),
  run: yup.string().required('Run required'),
  lifeStage: yup.string().required('Life Stage required'),
  numberMeasured: yup
    .number()
    .required('Number Measured required')
    .typeError('Input must be a number'),
})
export const permittingInformationSchema = yup.object().shape({
  waterTemperatureThreshold: yup
    .number()
    .required('Temperature threshold required')
    .typeError('Input must be a number'),
  flowThreshold: yup
    .number()
    .required('Flow threshold required')
    .typeError('Input must be a number'),
  trapCheckFrequency: yup
    .number()
    .required('Trap check frequency required')
    .typeError('Input must be a number'),
})
export const takeAndMortalitySchema = yup.object().shape({
  species: yup.string().required('Species required'),
  listingUnitOrStock: yup.string().required('Required value'),
  lifeStage: yup.string().required('Species required'),
  expectedTake: yup
    .number()
    .required('Expected Take required')
    .typeError('Input must be a number'),
  indirectMortality: yup
    .number()
    .required('Indirect Mortality required')
    .typeError('Input must be a number'),
})
export const setUpNewProgramSchema = yup.object().shape({
  monitoringProgramName: yup.string().required('Program name required'),
  streamName: yup.string().required('Stream name required'),
  fundingAgency: yup.string().required('Funding agency required'),
  program: yup.string(),
})
