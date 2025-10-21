import React, { useMemo } from 'react'
import {
  Text,
  HStack,
  Box,
  FormControl,
  Popover,
  IconButton,
  Icon,
} from 'native-base'
import { MaterialIcons } from '@expo/vector-icons'
import FormInputComponent, {
  TextInputAdornment,
} from '../Shared/FormInputComponent'

const RiverDepth = ({
  touched,
  errors,
  values,
  handleChange,
  handleBlur,
  setFieldValue,
  validationSchema,
  inputRefs,
  unitAbbrev,
}: {
  touched: any
  errors: any
  values: any
  handleChange: any
  handleBlur: any
  setFieldValue: any
  validationSchema: any
  inputRefs: any
  unitAbbrev: string | undefined
}) => {
  return (
    <FormControl>
      <HStack space={4} alignItems='center'>
        <FormControl.Label>
          <Text color='black' fontSize='xl'>
            River Depth
          </Text>
        </FormControl.Label>
      </HStack>
      <HStack flexWrap={'wrap'}>
        <Box
          flexBasis='28%' // Ensures 3 items per row (adjust for spacing)
          minWidth='28%' // Prevents shrinking too much
          maxWidth='28%' // Prevents growing beyond this size
          mr={8}
        >
          <FormInputComponent
            label={'River Left'}
            placeholder='0'
            touched={touched}
            errors={errors}
            value={values.riverLeft ? `${values.riverLeft}` : ''}
            camelName={'riverLeft'}
            onChangeText={newValue => {
              setFieldValue('riverLeft', newValue)
            }}
            onBlur={handleBlur('riverLeft')}
            validationSchema={validationSchema}
            keyboardType={'number-pad'}
            inputRefs={inputRefs}
            RightElement={
              unitAbbrev ? <TextInputAdornment text={unitAbbrev} /> : undefined
            }
          />
        </Box>
        <Box
          flexBasis='28%' // Ensures 3 items per row (adjust for spacing)
          minWidth='28%' // Prevents shrinking too much
          maxWidth='28%' // Prevents growing beyond this size
          mr={8}
        >
          <FormInputComponent
            label={'River Center'}
            placeholder='0'
            touched={touched}
            errors={errors}
            value={values.riverCenter ? `${values.riverCenter}` : ''}
            camelName={'riverCenter'}
            onChangeText={newValue => {
              setFieldValue('riverCenter', newValue)
            }}
            onBlur={handleBlur('riverCenter')}
            validationSchema={validationSchema}
            keyboardType={'number-pad'}
            inputRefs={inputRefs}
            RightElement={
              unitAbbrev ? <TextInputAdornment text={unitAbbrev} /> : undefined
            }
          />
        </Box>
        <Box
          flexBasis='28%' // Ensures 3 items per row (adjust for spacing)
          minWidth='28%' // Prevents shrinking too much
          maxWidth='28%' // Prevents growing beyond this size
          mr={8}
        >
          <FormInputComponent
            label={'River Right'}
            placeholder='0'
            touched={touched}
            errors={errors}
            value={values.riverRight ? `${values.riverRight}` : ''}
            camelName={'riverRight'}
            onChangeText={handleChange('riverRight')}
            onBlur={handleBlur('riverRight')}
            validationSchema={validationSchema}
            keyboardType={'number-pad'}
            inputRefs={inputRefs}
            RightElement={
              unitAbbrev ? <TextInputAdornment text={unitAbbrev} /> : undefined
            }
          />
        </Box>
      </HStack>
    </FormControl>
  )
}

export default RiverDepth
