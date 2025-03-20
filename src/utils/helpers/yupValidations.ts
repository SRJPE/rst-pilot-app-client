import * as yup from 'yup'

/*----------------------------------------------------------------
  TRAP VISIT SCHEMAS
----------------------------------------------------------------*/

export const trapVisitSchema = yup.object().shape({
  stream: yup.string().required('Stream required'),
  trapSite: yup.string().when('stream', {
    is: (val: string) => val !== null,
    then: yup.string().required('Trap site required'),
  }),
  crew: yup.array().min(1, 'At least 1 crew member is required').required(),
  trapName: yup.array().min(1, 'At least 1 trap name is required').required(),
})

export const generateDynamicTrapOpsSchema = (fields: Array<any>) => {
  const sectionFields = fields.filter(
    (field: any) => field.formSection === 'Trap Operations'
  )
  // always required
  let schema: { [key: string]: any } = {
    trapStatus: yup.string().required('Trap status required'),
    reasonNotFunc: yup.string().when('trapStatus', {
      is: (val: string) =>
        ['trap functioning but not normally', 'trap not functioning'].includes(
          val
        ),
      then: yup.string().required('Reason for trap malfunction required'),
    }),
    flowMeasure: yup
      .number()
      .nullable()
      // .required('Flow measure is required')
      .typeError('Value must be a number'),
    waterTemperature: yup
      .number()
      .nullable()
      .typeError('Value must be a number')
      .required('Water temperature is required'),
  }

  sectionFields.forEach(field => {
    let validator = yup.string() as any // Default to string validation

    if (field.fieldName === 'ysiTurbidity') {
      validator = yup.number().typeError('Must be a number')
      validator = validator.required(`Measurement required`)
      schema.turbidity1 = validator
      schema.turbidity2 = validator
      schema.turbidity3 = validator
      return
    }

    if (field.fieldType === 'email') {
      validator = yup.string().email('Invalid email format')
    } else if (field.fieldType === 'input') {
      validator = yup.number().typeError('Must be a number')
      validator = validator.positive(`Measurement required`)
      if (field.minThreshold) {
        validator = validator.min(
          field.minThreshold,
          `${field.displayName} must be >= ${field.minThreshold}`
        )
      }
      if (field.maxThreshold) {
        validator = validator.max(
          field.maxThreshold,
          `${field.displayName} must be at <= ${field.maxThreshold}`
        )
      }
    } else if (field.fieldType === 'boolean') {
      validator = yup.boolean()
    }

    if (field.required) {
      validator = validator.required(`${field.displayName} is required`)
    }

    if (field.minLength) {
      validator = validator.min(
        field.minLength,
        `${field.displayName} must be at least ${field.minLength} characters`
      )
    }

    if (field.maxLength) {
      validator = validator.max(
        field.maxLength,
        `${field.displayName} must be at most ${field.maxLength} characters`
      )
    }

    schema[field.fieldName] = validator
  })

  return yup.object().shape(schema)
}

export const trapOperationsSchema = yup.object().shape({
  trapStatus: yup.string().required('Trap status required'),
  reasonNotFunc: yup.string().when('trapStatus', {
    is: (val: string) =>
      ['trap functioning but not normally', 'trap not functioning'].includes(
        val
      ),
    then: yup.string().required('Reason for trap malfunction required'),
  }),
  flowMeasure: yup
    .number()
    .nullable()

    .required('Flow measure is required')
    .typeError('Value must be a number'),
  waterTemperature: yup
    .number()
    .nullable()
    .typeError('Value must be a number')
    .required('Water temperature is required'),

  flowMeasureUnit: yup.string(),
  waterTemperatureUnit: yup.string(),
  waterTurbidity: yup
    .number()
    .nullable()
    // .required('Water Turbidity Required')
    .typeError('Value must be a number'),
  waterTurbidityUnit: yup.string(),
  rpm1: yup
    .number()
    .positive('Measurement must be > 0')
    .nullable()
    .max(30, 'Measurement must be ≤ 30')
    .typeError('Value must be a number')
    .required('Enter at least one measurement'),
  rpm2: yup
    .number()
    .positive('Measurement must be > 0')
    .max(30, 'Measurement must be ≤ 30')
    .nullable()
    .typeError('Value must be a number'),
  rpm3: yup
    .number()
    .positive('Measurement must be > 0')
    .max(30, 'Measurement must be ≤ 30')
    .nullable()
    .typeError('Value must be a number'),
})

export const trapPostProcessingSchema = yup.object().shape({
  debrisVolume: yup.number().nullable().typeError('Value must be a number'),
  // .required('Debris volume required'),
  totalRevolutions: yup.number().nullable().typeError('Value must be a number'),
  // .required('Total revolutions required'),
  isWaterTurbidityPresent: yup.boolean(),
  waterTurbidity: yup.number().when('isWaterTurbidityPresent', {
    is: true,
    then: yup
      .number()
      .typeError('Value must be a number')
      .required('Water Turbidity Required'),
    otherwise: yup.number().nullable(),
  }),
  comments: yup.string(),
  rpm1: yup
    .number()
    .positive('Measurement must be > 0')
    .nullable()
    .max(30, 'Measurement must be ≤ 30')
    .typeError('Value must be a number')
    .required('Enter at least one measurement'),
  rpm2: yup
    .number()
    .positive('Measurement must be > 0')
    .max(30, 'Measurement must be ≤ 30')
    .nullable()
    .typeError('Value must be a number'),
  rpm3: yup
    .number()
    .positive('Measurement must be > 0')
    .max(30, 'Measurement must be ≤ 30')
    .nullable()
    .typeError('Value must be a number'),
  trapLongitude: yup.number().nullable().typeError('Value must be a number'),
  trapLatitude: yup.number().nullable().typeError('Value must be a number'),
})

export const generateDynamicTrapPostProcessingSchema = (fields: Array<any>) => {
  const sectionFields = fields.filter(
    (field: any) => field.formSection === 'Trap Post-Processing'
  )
  // always required
  let schema: { [key: string]: any } = {
    rpm1: yup
      .number()
      .positive('Measurement must be > 0')
      .nullable()
      .max(30, 'Measurement must be ≤ 30')
      .typeError('Value must be a number'),
    rpm2: yup
      .number()
      .positive('Measurement must be > 0')
      .max(30, 'Measurement must be ≤ 30')
      .nullable()
      .typeError('Value must be a number'),
    rpm3: yup
      .number()
      .positive('Measurement must be > 0')
      .max(30, 'Measurement must be ≤ 30')
      .nullable()
      .typeError('Value must be a number'),
  }

  sectionFields.forEach(field => {
    let validator = yup.string() as any // Default to string validation

    if (field.fieldType === 'email') {
      validator = yup.string().email('Invalid email format')
    } else if (field.fieldType === 'input') {
      validator = yup.number().typeError('Must be > 0')
      validator = validator.positive(`Measurement required`)
      if (field.minThreshold) {
        validator = validator.min(
          field.minThreshold,
          `${field.displayName} must be >= ${field.minThreshold}`
        )
      }
      if (field.maxThreshold) {
        validator = validator.max(
          field.maxThreshold,
          `${field.displayName} must be at <= ${field.maxThreshold}`
        )
      }
    } else if (field.fieldType === 'boolean') {
      validator = yup.boolean()
    }

    if (field.required) {
      validator = validator.required(`${field.displayName} is required`)
    } else {
      validator = validator.nullable()
    }

    if (field.minLength) {
      validator = validator.min(
        field.minLength,
        `${field.displayName} must be at least ${field.minLength} characters`
      )
    }

    if (field.maxLength) {
      validator = validator.max(
        field.maxLength,
        `${field.displayName} must be at most ${field.maxLength} characters`
      )
    }

    schema[field.fieldName] = validator
  })

  return yup.object().shape(schema)
}

export const fishProcessingSchema = yup.object().shape({
  fishProcessedResult: yup.string().required('Fish Processed status required'),
  reasonForNotProcessing: yup.string().when('fishProcessedResult', {
    is: (val: string) => val?.includes('no catch data'),
    then: schema => schema.required('Reason for not processing required'),
    otherwise: schema => schema.optional(),
  }),
  // willBeHoldingFishForMarkRecapture:
})

export const addIndividualFishSchema = yup.object().shape({
  species: yup.string().required('Fish species required'),
  forkLength: yup
    .number()
    .required('Fish fork length required')
    .typeError('Value must be a number'),
  run: yup
    .string()
    // .required('Run required')
    .nullable()
    .typeError('Value must be a number'),
  weight: yup.number().nullable().typeError('Value must be a number'),
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
    .typeError('Value must be a number'),
  run: yup
    .string()
    // .required('Run required')
    .nullable()
    .typeError('Value must be a number'),
  weight: yup.number().nullable().typeError('Value must be a number'),
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
    .typeError('Value must be a number'),
  run: yup
    .string()
    // .required('Run required')
    .nullable()
    .typeError('Value must be a number'),
  weight: yup.number().nullable().typeError('Value must be a number'),
  lifeStage: yup.string(),
  adiposeClipped: yup.boolean(),
  existingMark: yup.string(),
  dead: yup.boolean().required('Fish mortality required'),
  willBeUsedInRecapture: yup.boolean(),
})

export const addMarksOrTagsSchema = yup.object().shape({
  markType: yup.string().required('Mark Type is required'),
  markCode: yup.string().required('Mark Code is required'),
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
    .typeError('Value must be a number'),
  plusCountMethod: yup.string().required('Plus count method required'),
  dead: yup.boolean().required('Fish mortality required'),
})

/*----------------------------------------------------------------
  MARK RECAPTURE SCHEMAS
----------------------------------------------------------------*/

export const releaseTrialSchema = yup.object().shape({
  wildCount: yup
    .number()
    .required('Wild count is required')
    .typeError('Value must be a number'),
  deadWildCount: yup
    .number()
    .required('Dead wild count is required')
    .typeError('Value must be a number'),
  willSupplement: yup.boolean().required('Field required'),
  hatcheryCount: yup.number().when('willSupplement', {
    is: true,
    then: yup
      .number()
      .required('Hatchery count is required')
      .typeError('Value must be a number'),
    otherwise: yup
      .number()
      .transform(value => (isNaN(value) ? 0 : value))
      .typeError('Value must be a number')
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

      .nullable()
      .typeError('Value must be a number'),
    otherwise: yup
      .number()
      .transform(value => (isNaN(value) ? 0 : value))
      .typeError('Value must be a number')
      .notRequired(),
  }),
  runForkLengthHatchery: yup.number().when('willSupplement', {
    is: true,
    then: yup
      .number()

      .nullable()
      .typeError('Value must be a number'),
    otherwise: yup
      .number()
      .transform(value => (isNaN(value) ? 0 : value))
      .typeError('Value must be a number')
      .notRequired(),
  }),
  deadHatcheryCount: yup.number().when('willSupplement', {
    is: true,
    then: yup
      .number()
      .required('Hatchery dead count is required')
      .typeError('Value must be a number'),
    otherwise: yup
      .number()
      .transform(value => (isNaN(value) ? 0 : value))
      .typeError('Value must be a number')
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
  appliedMarks: yup.array(),
  releaseLocation: yup.string().required('Release location required'),
  // releaseTime: yup.
})

export const addAnotherMarkSchema = yup.object().shape({
  markType: yup.string().required('Mark type required'),
  markColor: yup.string().required('Mark color required'),
  markPosition: yup.string().required('Mark position required'),
})
export const batchCharacteristicsSchema = yup.object().shape({
  species: yup.string().required('Species required'),
  // fishConditions: yup.any().required('Fish Condition required'),
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
    .typeError('Value must be a number'),
  trapLongitude: yup
    .number()
    // .nullable()
    .required('Trap Longitude required')
    .typeError('Value must be a number'),
  coneSize: yup
    .number()
    // .nullable()
    .required('Cone Size required')
    .typeError('Value must be a number'),
  USGSStationNumber: yup
    .number()
    // .nullable()
    .required('USGS Station Number required')
    .typeError('Value must be a number')
    .test(
      'length',
      'USGS Station Number must be between 8 and 15 digits',
      value => {
        const safeValue = value?.toString() || 0
        return (
          safeValue.toString().length >= 8 && safeValue.toString().length <= 15
        )
      }
    ),
  releaseSiteName: yup.string().required('Release site name required'),
  releaseSiteLatitude: yup
    .number()
    // .nullable()
    .required('Trap latitude required')
    .typeError('Value must be a number'),
  releaseSiteLongitude: yup
    .number()
    // .nullable()
    .required('Trap latitude required')
    .typeError('Value must be a number'),
})

export const crewMembersLeadSchema = yup.object().shape({
  agency: yup.string().required('Agency required'),
  orcidId: yup.string().nullable(),
})
export const crewMembersSchema = yup.object().shape({
  firstName: yup.string().required('First name required'),
  lastName: yup.string().required('Last name required'),
  phoneNumber: yup
    .string()
    // .required('Phone number required')
    .matches(/^\d{3}-\d{3}-\d{4}$/, 'Phone number is not valid'),
  email: yup
    .string()
    .required('Email required')
    .email('Email format is not valid'),
  agency: yup.string().required('Agency required'),
  orcidId: yup.string().nullable(),
})
export const hatcheryInformationSchema = yup.object().shape({
  hatchery: yup.string().required('Hatchery required'),
  frequencyOfReceivingFish: yup.string().required('Frequency required'),
  expectedNumberOfFishReceivedAtEachPickup: yup
    .number()
    .required('Number of fish required')
    .typeError('Value must be a number'),
})
export const trappingProtocolsSchema = yup.object().shape({
  species: yup.string().required('Species required'),
  run: yup.string().required('Run required'),
  lifeStage: yup.string().required('Life Stage required'),
  numberMeasured: yup
    .number()
    .required('Number Measured required')
    .typeError('Value must be a number'),
})
export const permittingInformationSchema = yup.object().shape({
  waterTemperatureThreshold: yup
    .number()
    .nullable()
    .required('Temperature threshold required')
    .typeError('Value must be a number'),
  flowThreshold: yup
    .number()
    .nullable()
    .required('Flow threshold required')
    .typeError('Value must be a number'),
  trapCheckFrequency: yup
    .string()
    .nullable()
    .required('Trap check frequency required'),
})
export const takeAndMortalitySchema = yup.object().shape({
  species: yup.string().required('Species required'),
  listingUnitOrStock: yup.string().required('Required value'),
  lifeStage: yup.string().required('Species required'),
  expectedTake: yup
    .number()
    .nullable()
    .required('Expected Take required')
    .typeError('Value must be a number'),
  indirectMortality: yup
    .number()
    .nullable()
    .required('Indirect Mortality required')
    .typeError('Value must be a number'),
})
export const setUpNewProgramSchema = yup.object().shape({
  monitoringProgramName: yup.string().required('Program name required'),
  streamName: yup.string().required('Stream name required'),
  fundingAgency: yup.string().required('Funding agency required'),
  copyExistingProgram: yup
    .string()
    .is(['true', 'false'])
    .required('Existing program required'),
  program: yup
    .string()
    .nullable()
    .when('copyExistingProgram', {
      is: 'true',
      then: yup.string().required('Program required'),
      otherwise: yup.string().nullable(),
    }),
})

export const groupTrapSitesSchema = yup.object().shape({
  numberOfTrapSites: yup
    .number()
    .min(2)
    .required('Number of trap sites required'),

  orcidId: yup.string().nullable(),
})
