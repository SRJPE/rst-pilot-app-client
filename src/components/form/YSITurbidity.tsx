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
import FormInputComponent from '../Shared/FormInputComponent'

const YSITurbidity = ({
  touched,
  errors,
  values,
  handleChange,
  handleBlur,
  setFieldValue,
  validationSchema,
  inputRefs,
}: {
  touched: any
  errors: any
  values: any
  handleChange: any
  handleBlur: any
  setFieldValue: any
  validationSchema: any
  inputRefs: any
}) => {
  const calcMeanFNU = useMemo(() => {
    if (values.turbidity1 && values.turbidity2 && values.turbidity3) {
      const sum =
        Number(values.turbidity1) +
        Number(values.turbidity2) +
        Number(values.turbidity3)
      return (sum / 3).toFixed(2)
    } else return undefined
  }, [values.turbidity1, values.turbidity2, values.turbidity3])

  return (
    <FormControl>
      <HStack space={4} alignItems='center'>
        <FormControl.Label>
          <Text color='black' fontSize='xl'>
            YSI Turbidity
          </Text>
        </FormControl.Label>
        <Popover
          placement='bottom left'
          trigger={triggerProps => {
            return (
              <IconButton
                {...triggerProps}
                icon={
                  <Icon
                    as={MaterialIcons}
                    color='black'
                    name='info-outline'
                    size='lg'
                  />
                }
              ></IconButton>
            )
          }}
        >
          <Popover.Content accessibilityLabel='RPM Info' w='600' mr='10'>
            <Popover.Arrow />
            <Popover.Header>Take reading every 30 seconds</Popover.Header>
          </Popover.Content>
        </Popover>
      </HStack>
      <HStack space={8} flexWrap={'wrap'}>
        <Box
          flexBasis='21%' // Ensures 3 items per row (adjust for spacing)
          minWidth='21%' // Prevents shrinking too much
          maxWidth='21%' // Prevents growing beyond this size
        >
          <FormInputComponent
            label={'Measure 1'}
            placeholder='0'
            touched={touched}
            errors={errors}
            value={values.turbidity1 ? `${values.turbidity1}` : ''}
            camelName={'turbidity1'}
            onChangeText={newValue => {
              setFieldValue('turbidity1', newValue)
            }}
            onBlur={handleBlur('turbidity1')}
            validationSchema={validationSchema}
            keyboardType={'number-pad'}
            inputRefs={inputRefs}
          />
        </Box>
        <Box
          flexBasis='21%' // Ensures 3 items per row (adjust for spacing)
          minWidth='21%' // Prevents shrinking too much
          maxWidth='21%' // Prevents growing beyond this size
        >
          <FormInputComponent
            label={'Measure 2'}
            placeholder='0'
            touched={touched}
            errors={errors}
            value={values.turbidity2 ? `${values.turbidity2}` : ''}
            camelName={'turbidity2'}
            onChangeText={newValue => {
              setFieldValue('turbidity2', newValue)
            }}
            onBlur={handleBlur('turbidity2')}
            validationSchema={validationSchema}
            keyboardType={'number-pad'}
            inputRefs={inputRefs}
          />
        </Box>
        <Box
          flexBasis='21%' // Ensures 3 items per row (adjust for spacing)
          minWidth='21%' // Prevents shrinking too much
          maxWidth='21%' // Prevents growing beyond this size
        >
          <FormInputComponent
            label={'Measure 3'}
            placeholder='0'
            touched={touched}
            errors={errors}
            value={values.turbidity3 ? `${values.turbidity3}` : ''}
            camelName={'turbidity3'}
            onChangeText={handleChange('turbidity3')}
            onBlur={handleBlur('turbidity3')}
            validationSchema={validationSchema}
            keyboardType={'number-pad'}
            inputRefs={inputRefs}
          />
        </Box>
        <Box
          flexBasis='20%' // Ensures 3 items per row (adjust for spacing)
          minWidth='20%' // Prevents shrinking too much
          maxWidth='20%' // Prevents growing beyond this size
        >
          <FormControl.Label>
            <Text fontSize='16'>Mean FNU</Text>
          </FormControl.Label>
          <Text color='black' fontSize='2xl'>
            {calcMeanFNU}
          </Text>
        </Box>
      </HStack>
    </FormControl>
  )
}

export default YSITurbidity
