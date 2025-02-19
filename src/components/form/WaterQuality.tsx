import React, { useEffect, useState } from 'react'
import { View, Text, Heading, Input, VStack, HStack, Box } from 'native-base'
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
  fieldId: number
  required: boolean
  fieldName: string
  displayName: string
  units: string | null
  fieldType: string
}

export default function WaterQuality({
  touched,
  errors,
  values,
  handleChange,
  handleBlur,
  setFieldTouched,
  dropdownValues,
}: {
  touched: any
  errors: any
  values: any
  handleChange: any
  handleBlur: any
  setFieldTouched: any
  dropdownValues: any
}) {
  const testFields: Array<FieldInterface> = [
    {
      fieldName: 'secchi',
      displayName: 'Secchi',
      required: true,
      id: 3,
      programId: 6,
      fieldId: 3,
      units: 'm',
      fieldType: 'numeric',
    },
    {
      fieldName: 'dissolvedOxygen',
      displayName: 'Dissolved Oxygen',
      required: true,
      id: 2,
      programId: 6,
      fieldId: 2,
      units: 'mg/L',
      fieldType: 'numeric',
    },
    {
      fieldName: 'specificConductivity',
      displayName: 'Specific Conductivity',
      required: true,
      id: 4,
      programId: 6,
      fieldId: 4,
      units: 'µS/cm',
      fieldType: 'numeric',
    },
    {
      fieldName: 'electricalConductivity',
      displayName: 'Electrical Conductivity',
      required: true,
      id: 5,
      programId: 6,
      fieldId: 5,
      units: 'µS/cm',
      fieldType: 'numeric',
    },
    {
      fieldName: 'ph',
      displayName: 'pH',
      required: true,
      id: 1,
      programId: 6,
      fieldId: 1,
      units: null,
      fieldType: 'numeric',
    },
    {
      fieldName: 'weatherCode',
      displayName: 'Weather',
      required: true,
      id: 6,
      programId: 6,
      fieldId: 6,
      units: null,
      fieldType: 'dropdown',
    },
  ]

  const renderFieldComponent = (item: FieldInterface, index: number) => {
    const { fieldName, displayName, units, fieldType } = item
    if (fieldType === 'numeric') {
      return (
        <Box
          key={index} // Always add a key when mapping
          flexBasis='30%' // Ensures 3 items per row (adjust for spacing)
          minWidth='30%' // Prevents shrinking too much
          maxWidth='30%' // Prevents growing beyond this size>
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
              units ? <TextInputAdornment text={units} /> : undefined
            }
          />
        </Box>
      )
    } else if (fieldType === 'dropdown') {
      return (
        <Box
          key={index} // Always add a key when mapping
          flexBasis='30%' // Ensures 3 items per row (adjust for spacing)
          minWidth='45%' // Prevents shrinking too much
          maxWidth='45%' // Prevents growing beyond this size>
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

  console.log('WaterQuality.tsx: dropdownValues', dropdownValues)

  return (
    <>
      <Heading>Water Quality</Heading>
      <HStack space={5} mt={5} flexWrap={'wrap'}>
        {testFields.map((item, index) => renderFieldComponent(item, index))}
      </HStack>
    </>
  )
}
