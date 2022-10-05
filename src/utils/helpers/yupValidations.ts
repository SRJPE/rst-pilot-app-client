import * as yup from 'yup'

export const trapVisitSchema = yup.object().shape({
  stream: yup.string().required('Stream required'),
  trapSite: yup.string().required('Trap site required'),
  trapSubSite: yup.string(),
  crew: yup.array(),
  // .min(1).required('Crew cannot be blank.'),
})

export const trapStatusSchema = yup.object().shape({
  trapStatus: yup.string().required('Trap Status Required'),
  reasonNotFunc: yup.string(),
  // .required('Reason Not Functioning Required'),
  flowMeasure: yup
    .number()
    .required('Flow Measure Required')
    .typeError('Input must be a number'),
  waterTemperature: yup
    .number()
    .required('Water Temperature Required')
    .typeError('Input must be a number'),
  waterTurbidity: yup
    .number()
    .required('Water Turbidity Required')
    .typeError('Input must be a number'),
})

export const trapOperationsSchema = yup.object().shape({
  coneDepth: yup
    .number()
    .required('Stream required')
    .typeError('Input must be a number'),

  // coneSetting: yup.string().required('Trap site required'),
  // checked: yup.string(),
  // totalRevolutions: yup
  //   .number()
  //   .required('Water Turbidity Required')
  //   .typeError('Input must be a number'),
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

export const fishInputSchema = yup.object().shape({
  fishProcessed: yup.string().required('Fish Processed status required'),
  // reasonForNotProcessing: yup.string().required(),
  // .required('Reason for not processing required'),
})
