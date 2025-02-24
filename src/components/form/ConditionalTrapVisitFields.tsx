import React, { useEffect, useState, useMemo, memo, useCallback } from 'react'
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
  orderIndex: number
}

const ConditionalTrapVisitFields = ({
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
}) => {
  const [sortedFormFields, setSortedFormFields] = useState<
    Array<FieldInterface>
  >([])

  useEffect(() => {
    if (formFields) {
      const sortedFields = [...formFields].sort(
        (a, b) => a.orderIndex - b.orderIndex
      )
      setSortedFormFields(sortedFields)
    }
  }, [formFields])

  const renderFieldComponent = (item: FieldInterface, index: number) => {
    if (item.formSection !== activePage) {
      return undefined
    }

    const { fieldName, displayName, unitDefinition, fieldType } = item
    if (fieldType === 'input') {
      const unitAbbrev = unitDefinition?.match(/\(([^)]+)\)/)?.[1] || undefined
      return (
        <Box
          key={index} // Always add a key when mapping
          flexBasis='25%' // Ensures 3 items per row (adjust for spacing)
          minWidth='25%' // Prevents shrinking too much
          maxWidth='25%' // Prevents growing beyond this size>
          mr={8} // Removes right margin from every 3rd item
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
    if (values.turbidity1 && values.turbidity2 && values.turbidity3) {
      const sum =
        Number(values.turbidity1) +
        Number(values.turbidity2) +
        Number(values.turbidity3)
      return (sum / 3).toFixed(2)
    } else return undefined
  }, [values.turbidity1, values.turbidity2, values.turbidity3])

  return (
    <>
      {formFields?.length > 0 && (
        <HStack flexWrap={'wrap'}>
          {sortedFormFields.map((item, index) =>
            renderFieldComponent(item, index)
          )}
        </HStack>
      )}
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
    </>
  )
}

export default ConditionalTrapVisitFields
