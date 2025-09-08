import React, { act, useEffect, useState } from 'react'
import { Text, HStack, Box, Link, VStack, View, FormControl } from 'native-base'
import {
  Radio,
  RadioGroup,
  RadioIndicator,
  RadioLabel,
} from '@/components/ui/radio'
import { connect } from 'react-redux'
import { RootState } from '../../redux/store'
import FormInputComponent, {
  TextInputAdornment,
} from '../Shared/FormInputComponent'
import FastSelect from '../Shared/FastSelect'
import CustomSelect from '../Shared/CustomSelect'
import { renderRequiredOrOptionalLabel } from '../../utils/utils'

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

const defaultValues: { [key: string]: any } = {
  counterStart: '0',
  trapInThalweg: false,
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
  activeTabId,
  trapOperationsStore,
  validationSchema,
  inputRefs,
  onOpenCallback,
  visitSetupState,
  visitSetupDefaultsState,
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
  activeTabId: string | null
  trapOperationsStore?: any
  validationSchema?: any
  inputRefs?: any
  onOpenCallback?: () => void
  visitSetupState?: any
  visitSetupDefaultsState?: any
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
    const isLast = index === formFields.length - 1

    const { fieldName, displayName, unitDefinition, fieldType } = item
    const unitAbbrev = unitDefinition?.match(/\(([^)]+)\)/)?.[1] || undefined

    if (
      defaultValues[fieldName] !== undefined &&
      values[fieldName] === undefined
    ) {
      setFieldValue(fieldName, defaultValues[fieldName])
    }

    if (fieldName === 'dataRecorder') {
      return (
        <>
          <Box
            key={index} // Always add a key when mapping
            flexBasis='100%' // Ensures 3 items per row (adjust for spacing)
            minWidth='100%' // Prevents shrinking too much
            maxWidth='100%' // Prevents growing beyond this size>
            flexGrow={1}
            mr={8} // Removes right margin from every 3rd item
          >
            <CustomSelect
              camelName={fieldName}
              label={displayName}
              errors={errors}
              touched={touched}
              selectedValue={values.dataRecorder}
              placeholder='Select Data Recorder'
              onValueChange={(itemValue: string) => {
                setFieldValue('dataRecorder', itemValue)
                setFieldTouched('dataRecorder', true)
              }}
              setFieldTouched={() => setFieldTouched('dataRecorder')}
              selectOptions={values?.crew?.map((crewMember: any) => ({
                label: crewMember,
                value: crewMember,
              }))}
              validationSchema={validationSchema}
              onOpenCallback={onOpenCallback}
            />
          </Box>
        </>
      )
    }
    if (fieldType === 'input') {
      let inputWidth = '28%'
      if (fieldName.toLowerCase().includes('flow')) {
        inputWidth = '20%'
      }
      return (
        <Box
          key={index} // Always add a key when mapping
          flexBasis={inputWidth} // Ensures 3 items per row (adjust for spacing)
          minWidth={inputWidth} // Prevents shrinking too much
          maxWidth={inputWidth} // Prevents growing beyond this size>
          mr={8}
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
            validationSchema={validationSchema}
            keyboardType={'number-pad'}
            inputRefs={inputRefs}
            isLast={isLast}
            formFields={sortedFormFields}
            orderIndex={item.orderIndex}
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
          <FastSelect
            selectedValue={values[fieldName]}
            placeholder={`Select Value for ${displayName}`}
            camelName={fieldName}
            label={displayName}
            errors={errors}
            touched={touched}
            onValueChange={handleChange(fieldName)}
            setFieldTouched={() => setFieldTouched(fieldName)}
            selectOptions={dropdownValues[fieldName]}
            validationSchema={validationSchema}
          />
        </Box>
      )
    } else if (fieldType === 'radio') {
      return (
        <Box
          key={index} // Always add a key when mapping
          flexBasis='100%' // Ensures 3 items per row (adjust for spacing)
          minWidth='100%' // Prevents shrinking too much
          maxWidth='100%' // Prevents growing beyond this size>
          flexGrow={1}
          mr={8} // Removes right margin from every 3rd item
        >
          <FormControl>
            <FormControl.Label>
              <Text color='black' fontSize='xl'>
                {displayName}{' '}
                {validationSchema
                  ? renderRequiredOrOptionalLabel({
                      fieldName: fieldName,
                      validationSchema,
                    })
                  : ''}
              </Text>
            </FormControl.Label>
            <RadioGroup
              // name={fieldName}
              accessibilityLabel={fieldName}
              value={`${values[fieldName]}`}
              onChange={(value: any) => {
                setFieldTouched(fieldName, true)
                if (value === 'true') {
                  setFieldValue(fieldName, true)
                } else {
                  setFieldValue(fieldName, false)
                }
              }}
            >
              <HStack space={4} marginBottom={5}>
                <Radio value='true'>
                  <RadioIndicator style={{ width: 25, height: 25 }}>
                    <View
                      style={{
                        width: 13,
                        height: 13,
                        borderRadius: 9999,
                        backgroundColor:
                          values[fieldName] === true
                            ? '#007C7C'
                            : 'transparent',
                      }}
                    />
                  </RadioIndicator>
                  <RadioLabel selectionColor='primary' size='lg'>
                    Yes
                  </RadioLabel>
                </Radio>
                <Radio value='false'>
                  <RadioIndicator style={{ width: 25, height: 25 }}>
                    <View
                      style={{
                        width: 13,
                        height: 13,
                        borderRadius: 9999,
                        backgroundColor:
                          values[fieldName] === false
                            ? '#007C7C'
                            : 'transparent',
                      }}
                    />
                  </RadioIndicator>
                  <RadioLabel selectionColor='primary' size='lg'>
                    No
                  </RadioLabel>
                </Radio>
              </HStack>
            </RadioGroup>
          </FormControl>
        </Box>
      )
    } else {
      return undefined
    }
  }

  return (
    <>
      {formFields?.length > 0 && (
        <HStack flexWrap={'wrap'}>
          {sortedFormFields.map((item, index) =>
            renderFieldComponent(item, index)
          )}
        </HStack>
      )}
    </>
  )
}

const mapStateToProps = (state: RootState) => {
  return {
    visitSetupState: state.visitSetup,
    visitSetupDefaultsState: state.visitSetupDefaults,
  }
}

export default connect(mapStateToProps)(ConditionalTrapVisitFields)
