import React, { useEffect, useState } from 'react'
import { Text, HStack, Box, Link, VStack } from 'native-base'
import FormInputComponent, {
  TextInputAdornment,
} from '../Shared/FormInputComponent'
import FastSelect from '../Shared/FastSelect'
import YSITurbidity from './YSITurbidity'
import CustomModal from '../Shared/CustomModal'
import RSTRLogSheet from './RSTRLogSheet'

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
  activeTabId,
  trapOperationsStore,
  validationSchema,
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
}) => {
  const [sortedFormFields, setSortedFormFields] = useState<
    Array<FieldInterface>
  >([])
  const [showLogSheet, setShowLogSheet] = useState(false)

  const handleLogSheetState = () => {
    setShowLogSheet(!showLogSheet)
  }

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

    if (fieldName === 'conditionCode') {
      return (
        <>
          <Box
            key={index} // Always add a key when mapping
            flexBasis='45%' // Ensures 3 items per row (adjust for spacing)
            minWidth='45%' // Prevents shrinking too much
            maxWidth='45%' // Prevents growing beyond this size>
            flexGrow={1}
            mr={8} // Removes right margin from every 3rd item
          >
            <VStack>
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
                tooltip={
                  activeTabId ? (
                    <>
                      <Text fontSize='md'>
                        Selected Vegetation Code Value:{' '}
                        {
                          trapOperationsStore?.[activeTabId]?.values
                            ?.vegetationCode
                        }
                      </Text>
                    </>
                  ) : (
                    false
                  )
                }
              />
              <Link
                mb={5}
                onPress={handleLogSheetState}
                isUnderlined={true}
                _text={{
                  fontSize: 'lg',
                  color: 'primary',
                }}
              >
                View Log Sheet
              </Link>
            </VStack>
          </Box>
          {showLogSheet && (
            <CustomModal isOpen={showLogSheet} closeModal={handleLogSheetState}>
              <RSTRLogSheet handleLogSheetState={handleLogSheetState} />
            </CustomModal>
          )}
        </>
      )
    }

    if (fieldName === 'ysiTurbidity') {
      return (
        <YSITurbidity
          {...{
            touched,
            errors,
            values,
            handleChange,
            handleBlur,
            setFieldValue,
            validationSchema,
          }}
        />
      )
    }
    if (fieldType === 'input') {
      const unitAbbrev = unitDefinition?.match(/\(([^)]+)\)/)?.[1] || undefined
      return (
        <Box
          key={index} // Always add a key when mapping
          flexBasis='28%' // Ensures 3 items per row (adjust for spacing)
          minWidth='28%' // Prevents shrinking too much
          maxWidth='28%' // Prevents growing beyond this size>
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
            validationSchema={validationSchema}
            keyboardType={'number-pad'}
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

export default ConditionalTrapVisitFields
