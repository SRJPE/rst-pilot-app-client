import * as yup from 'yup'

export const trapVisitSchema = yup.object().shape({
  stream: yup.string().required('Stream Required'),
  trapSite: yup.string().required('Trap Site Required'),
  trapSubSite: yup.string(),
  crew: yup.array().min(1).required(),
})
export const trapStatusSchema = yup.object().shape({
  trapStatus: yup.string().required('Trap Status Required'),
  reasonNotFunc: yup.string().required('Reason Not Functioning Required'),
  flowMeasure: yup.number().required('Flow Measure Required'),
  WaterTemperature: yup.number().required('Water Temperature Required'),
  waterTurbidity: yup.number().required('Water Turbidity Required'),
})
