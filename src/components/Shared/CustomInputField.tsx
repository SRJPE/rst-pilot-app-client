import { FieldHookConfig, useField } from 'formik'
import { Input, Text } from 'native-base'

interface OtherProps {
  label: string
}

const CustomInputField = (props: FieldHookConfig<string>) => {
  const [field, meta, helpers] = useField(props)
  return (
    <>
      <Input
        w='1/2'
        height='50px'
        fontSize='16'
        placeholder='Numeric Value'
        keyboardType='numeric'
        {...field}
        // onChangeText={handleChange('coneDepth')}
        // onBlur={handleBlur('coneDepth')}
        // value={values.coneDepth}
      />

      {meta.touched && meta.error ? <Text>{meta.error}</Text> : null}
    </>
  )
}
export default CustomInputField
