import * as yup from 'yup'

export const trapStatusSchema = yup.object().shape({
  trapStatus: yup.string().required('Trap Status Required'),
  reasonNotFunc: yup.string().required('Reason Not Functioning Required'),
  flowMeasure: yup.number().required('Flow Measure Required'),
  WaterTemperature: yup.number().required('Water Temperature Required'),
  waterTurbidity: yup.number().required('Water Turbidity Required'),
})
