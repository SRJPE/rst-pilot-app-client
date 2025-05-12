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
import FormInputComponent from '../../components/Shared/FormInputComponent'

const RPMBefore = ({
  touched,
  errors,
  values,
  setFieldValue,
  handleBlur,
  handleChange,
  validationSchema,
  trapRestart,
}: {
  touched: any
  errors: any
  values: any
  setFieldValue: any
  handleBlur: any
  handleChange: any
  validationSchema: any
  trapRestart: boolean
}) => {
  return (
    <FormControl>
      <HStack space={4} alignItems='center'>
        <FormControl.Label>
          <Text color='black' fontSize='xl'>
            RPM {trapRestart ? 'After' : 'Before'} Cleaning
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
            <Popover.Header>
              Take up to three measurements of cone rotations. The averages of
              the entered values will be saved to the database.
            </Popover.Header>
          </Popover.Content>
        </Popover>
      </HStack>
      <HStack space={8} flexWrap={'wrap'}>
        <Box
          flexBasis='30%' // Ensures 3 items per row (adjust for spacing)
          minWidth='30%' // Prevents shrinking too much
          maxWidth='30%' // Prevents growing beyond this size
        >
          <FormInputComponent
            label={'Measure 1'}
            placeholder='0'
            touched={touched}
            errors={errors}
            value={values.rpm1 ? `${values.rpm1}` : ''}
            camelName={'rpm1'}
            onChangeText={newValue => {
              setFieldValue('rpm1', newValue)
              if (!newValue) {
                setFieldValue('rpm2', null)
                setFieldValue('rpm3', null)
              }
            }}
            onBlur={handleBlur('rpm1')}
            validationSchema={validationSchema}
            keyboardType={'number-pad'}
          />
        </Box>
        <Box
          flexBasis='30%' // Ensures 3 items per row (adjust for spacing)
          minWidth='30%' // Prevents shrinking too much
          maxWidth='30%' // Prevents growing beyond this size
        >
          <FormInputComponent
            isDisabled={values.rpm1 ? false : true}
            label={'Measure 2'}
            placeholder='0'
            touched={touched}
            errors={errors}
            value={values.rpm2 ? `${values.rpm2}` : ''}
            camelName={'rpm2'}
            onChangeText={newValue => {
              setFieldValue('rpm2', newValue)
              if (!newValue) {
                setFieldValue('rpm3', null)
              }
            }}
            onBlur={handleBlur('rpm2')}
            validationSchema={validationSchema}
            keyboardType={'number-pad'}
          />
        </Box>
        <Box
          flexBasis='30%' // Ensures 3 items per row (adjust for spacing)
          minWidth='30%' // Prevents shrinking too much
          maxWidth='30%' // Prevents growing beyond this size
        >
          <FormInputComponent
            isDisabled={values.rpm1 && values.rpm2 ? false : true}
            label={'Measure 3'}
            placeholder='0'
            touched={touched}
            errors={errors}
            value={values.rpm3 ? `${values.rpm3}` : ''}
            camelName={'rpm3'}
            onChangeText={handleChange('rpm3')}
            onBlur={handleBlur('rpm3')}
            validationSchema={validationSchema}
            keyboardType={'number-pad'}
          />
        </Box>
      </HStack>
    </FormControl>
  )
}

export default RPMBefore
