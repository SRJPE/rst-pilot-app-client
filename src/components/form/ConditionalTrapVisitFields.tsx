import React, { useEffect, useState } from 'react'
import {
  Text,
  HStack,
  Box,
  Link,
  VStack,
  Radio,
  FormControl,
} from 'native-base'
import { connect } from 'react-redux'
import { RootState } from '../../redux/store'
import FormInputComponent, {
  TextInputAdornment,
} from '../Shared/FormInputComponent'
import FastSelect from '../Shared/FastSelect'
import YSITurbidity from './YSITurbidity'
import CustomModal from '../Shared/CustomModal'
import RSTRLogSheet from './RSTRLogSheet'
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
    const isLast = index === formFields.length - 1

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

    if (fieldName === 'coneSetting') {
      return (
        <FormControl w='100%'>
          <HStack space={4} alignItems='center'>
            <FormControl.Label>
              <Text color='black' fontSize='xl'>
                Cone Setting
              </Text>
            </FormControl.Label>
            <Radio.Group
              name='coneSetting'
              accessibilityLabel='cone setting'
              value={`${values.coneSetting}`}
              onChange={(value: any) => {
                setFieldTouched('coneSetting', true)
                if (value === 'full') {
                  setFieldValue('coneSetting', 'full')
                } else {
                  setFieldValue('coneSetting', 'half')
                }
              }}
            >
              <HStack space={4}>
                <Radio
                  colorScheme='primary'
                  value='full'
                  my={1}
                  _icon={{ color: 'primary' }}
                >
                  Full
                </Radio>
                <Radio
                  colorScheme='primary'
                  value='half'
                  my={1}
                  _icon={{ color: 'primary' }}
                >
                  Half
                </Radio>
              </HStack>
            </Radio.Group>
          </HStack>
        </FormControl>
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
            inputRefs,
          }}
        />
      )
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
            <Radio.Group
              name={fieldName}
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
              <Radio
                colorScheme='primary'
                value='true'
                my={1}
                _icon={{ color: 'primary' }}
              >
                Yes
              </Radio>
              <Radio
                colorScheme='primary'
                value='false'
                my={1}
                _icon={{ color: 'primary' }}
              >
                No
              </Radio>
            </Radio.Group>
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
