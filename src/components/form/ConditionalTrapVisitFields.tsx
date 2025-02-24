import React, { useEffect, useState, useMemo } from 'react'
import {
  View,
  Text,
  Heading,
  Input,
  VStack,
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
import DropDownPicker from 'react-native-dropdown-picker'
import { TabStateI } from '../../redux/reducers/formSlices/tabSlice'
import { useFormikContext } from 'formik'
import CustomSelect from '../Shared/CustomSelect'

interface FieldInterface {
  id: number
  programId: number
  formFieldId: number
  required: boolean
  fieldName: string
  displayName: string
  unitId: number | null
  unitDefinition: string | null
  fieldType: string
  formSection: string
}

export default function ConditionalTrapVisitFields({
  touched,
  errors,
  values,
  handleChange,
  handleBlur,
  setFieldTouched,
  dropdownValues,
  activePage,
  formFields,
  setFieldValue,
}: {
  touched: any
  errors: any
  values: any
  handleChange: any
  handleBlur: any
  setFieldTouched: any
  dropdownValues: any
  activePage: string
  formFields: Array<FieldInterface>
  setFieldValue: any
}) {
  const renderFieldComponent = (item: FieldInterface, index: number) => {
    if (item.formSection !== activePage) {
      return undefined
    }

    const { fieldName, displayName, unitDefinition, fieldType } = item
    const isLastInRow = (index + 1) % 3 === 0 // Every 3rd item in a row
    if (fieldType === 'input') {
      const unitAbbrev = unitDefinition?.match(/\(([^)]+)\)/)?.[1] || undefined
      return (
        <Box
          key={index} // Always add a key when mapping
          flexBasis='30%' // Ensures 3 items per row (adjust for spacing)
          minWidth='30%' // Prevents shrinking too much
          // maxWidth='30%' // Prevents growing beyond this size>
          mr={isLastInRow ? 0 : 8} // Removes right margin from every 3rd item
        >
          <FormInputComponent
            label={displayName}
            placeholder='0'
            touched={touched}
            errors={errors}
            value={values[fieldName]}
            camelName={fieldName}
            onChangeText={handleChange(fieldName)}
            onBlur={handleBlur(fieldName)}
            RightElement={
              unitAbbrev ? <TextInputAdornment text={unitAbbrev} /> : undefined
            }
          />
        </Box>
      )
    } else if (fieldType === 'select') {
      return (
        <Box
          key={index} // Always add a key when mapping
          flexBasis='45%' // Ensures 3 items per row (adjust for spacing)
          minWidth='45%' // Prevents shrinking too much
          maxWidth='45%' // Prevents growing beyond this size>
          flexGrow={1}
          mr={8} // Removes right margin from every 3rd item
        >
          <CustomSelect
            selectedValue={values[fieldName]}
            placeholder={`Select Value for ${displayName}`}
            camelName={fieldName}
            label={displayName}
            errors={errors}
            touched={touched}
            onValueChange={handleChange(fieldName)}
            setFieldTouched={() => setFieldTouched(fieldName)}
            selectOptions={dropdownValues[fieldName]}
          />
        </Box>
      )
    } else {
      return undefined
    }
  }

  const calcMeanFNU = useMemo(() => {
    let valueCounter = 0
    let dividedCounter = 0
    if (values.turbidity1) {
      valueCounter += parseFloat(values.turbidity1)
      dividedCounter++
    }
    if (values.turbidity2) {
      valueCounter += parseFloat(values.turbidity2)
      dividedCounter++
    }
    if (values.turbidity3) {
      valueCounter += parseFloat(values.turbidity3)
      dividedCounter++
    }
    if (dividedCounter === 0) {
      return 0
    }
    return (valueCounter / dividedCounter).toFixed(2)
  }, [values.turbidity1, values.turbidity2, values.turbidity3])

  return (
    <>
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
              <Popover.Header>
                Take up to three measurements of cone rotations. The averages of
                the entered values will be saved to the database.
              </Popover.Header>
            </Popover.Content>
          </Popover>
        </HStack>
        <HStack space={8} flexWrap={'wrap'}>
          <Box
            flexBasis='20%' // Ensures 3 items per row (adjust for spacing)
            minWidth='20%' // Prevents shrinking too much
            maxWidth='20%' // Prevents growing beyond this size
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
            />
          </Box>
          <Box
            flexBasis='20%' // Ensures 3 items per row (adjust for spacing)
            minWidth='20%' // Prevents shrinking too much
            maxWidth='20%' // Prevents growing beyond this size
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
            />
          </Box>
          <Box
            flexBasis='20%' // Ensures 3 items per row (adjust for spacing)
            minWidth='20%' // Prevents shrinking too much
            maxWidth='20%' // Prevents growing beyond this size
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
      {formFields?.length > 0 && (
        <HStack flexWrap={'wrap'}>
          {formFields.map((item, index) => renderFieldComponent(item, index))}
        </HStack>
      )}
    </>
  )
}
