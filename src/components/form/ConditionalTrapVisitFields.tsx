import React, { useMemo, useState } from 'react'
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
import YSITurbidity from './YSITurbidity'
import CustomModal from '../Shared/CustomModal'
import RSTRLogSheet from './RSTRLogSheet'
import CustomSelect from '../Shared/CustomSelect'
import {
  renderRequiredOrOptionalLabel,
  resolveSelectOptions,
} from '../../utils/utils'
import RiverDepth from './RiverDepth'
import SecchiInput from './SecchiInput'
import {
  mergeOrderedFields,
  isLastInput,
  FieldSlot,
  OrderedEntry,
} from '../../utils/helpers/mergeOrderedFields'

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
  inputType?: string | null
  isEnvironmentalField?: boolean
  formSection: string
  orderIndex: number
  /** User-authored choices from form_field_option. Empty for built-in
   *  selects, which fall back to the fixed dropdown store by fieldName. */
  options?: Array<{ id: number; definition: string }>
}

const defaultValues: { [key: string]: any } = {
  counterStart: '0',
  trapInThalweg: false,
  samplingAltered: false,
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
  slots = [],
  suppressedFieldNames = [],
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
  /**
   * Fields the screen renders with its own bespoke widget. Passing them in
   * (rather than the screen rendering them itself, above this block) is what
   * lets a hardcoded field take its admin-configured position. The screen
   * builds these so each renderer keeps closing over its own local state.
   */
  slots?: FieldSlot[]
  /**
   * Field names the screen still renders itself OUTSIDE this grid (e.g. above
   * a section heading). They have no slot, so without this they'd render
   * twice — once in their hardcoded spot, once via the generic branch below.
   * Prefer converting a field to a slot; this is for ones whose position
   * can't move yet.
   */
  suppressedFieldNames?: string[]
}) => {
  const [showLogSheet, setShowLogSheet] = useState(false)

  const handleLogSheetState = () => {
    setShowLogSheet(!showLogSheet)
  }

  const merged = useMemo(
    () => mergeOrderedFields({ configured: formFields ?? [], slots }),
    [formFields, slots]
  )

  /**
   * FormInputComponent finds the next field to focus with
   * `formFields.find(f => f.orderIndex === orderIndex + 1 && f.fieldType === 'input')`.
   * Feed it the merged list re-keyed onto dense positions so "next" walks
   * slots too, instead of skipping straight past them.
   */
  const focusList = useMemo(
    () =>
      merged.map(e => ({
        fieldName: e.fieldName,
        fieldType: e.fieldType,
        orderIndex: e.position,
      })),
    [merged]
  )

  const renderEntry = (entry: OrderedEntry) => {
    const isLast = isLastInput(merged, entry.position)

    // A field the screen renders itself. The walker owns the grid wrapper so
    // slot and config fields flow through the same layout; the slot returns
    // only its inner control.
    if (entry.kind === 'slot' && entry.slot) {
      const { width, fieldName: slotName } = entry.slot
      return (
        <Box
          key={slotName}
          flexBasis={width}
          minWidth={width}
          maxWidth={width}
          mr={8}
        >
          {entry.slot.render()}
        </Box>
      )
    }

    const item = entry.field as FieldInterface
    if (!item) return null

    const { fieldName, displayName, unitDefinition, fieldType } = item
    const unitAbbrev = unitDefinition?.match(/\(([^)]+)\)/)?.[1] || undefined

    if (suppressedFieldNames.includes(fieldName)) return null

    if (
      defaultValues[fieldName] !== undefined &&
      values[fieldName] === undefined
    ) {
      setFieldValue(fieldName, defaultValues[fieldName])
    }

    if (fieldName === 'conditionCode') {
      return (
        <>
          <Box
            key={fieldName} // Stable across reorders; index would remount inputs
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
                selectOptions={resolveSelectOptions(item, dropdownValues)}
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
      if (
        !values.coneSetting &&
        activeTabId &&
        visitSetupState &&
        visitSetupState[activeTabId] &&
        visitSetupState[activeTabId].values
      ) {
        const { stream } = visitSetupState[activeTabId].values
        if (stream && stream.toLowerCase().includes('battle')) {
          setFieldValue('coneSetting', 'full')
        } else if (stream && stream.toLowerCase().includes('clear')) {
          setFieldValue('coneSetting', 'half')
        } else {
          setFieldValue('coneSetting', 'full')
        }
      }
      return (
        <FormControl w='100%'>
          <FormControl.Label>
            <Text color='black' fontSize='xl'>
              Cone Setting
            </Text>
          </FormControl.Label>
          <RadioGroup
            // name='coneSetting'
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
            <HStack space={4} marginBottom={5}>
              <Radio value='full'>
                <RadioIndicator style={{ width: 25, height: 25 }}>
                  <View
                    style={{
                      width: 13,
                      height: 13,
                      borderRadius: 9999,
                      backgroundColor:
                        values[fieldName] === 'full'
                          ? '#007C7C'
                          : 'transparent',
                    }}
                  />
                </RadioIndicator>
                <RadioLabel selectionColor='primary' size='lg'>
                  Full
                </RadioLabel>
              </Radio>
              <Radio value='half'>
                <RadioIndicator style={{ width: 25, height: 25 }}>
                  <View
                    style={{
                      width: 13,
                      height: 13,
                      borderRadius: 9999,
                      backgroundColor:
                        values[fieldName] === 'half'
                          ? '#007C7C'
                          : 'transparent',
                    }}
                  />
                </RadioIndicator>
                <RadioLabel selectionColor='primary' size='lg'>
                  Half
                </RadioLabel>
              </Radio>
            </HStack>
          </RadioGroup>
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

    if (fieldName === 'riverDepth') {
      return (
        <RiverDepth
          {...{
            touched,
            errors,
            values,
            handleChange,
            handleBlur,
            setFieldValue,
            validationSchema,
            inputRefs,
            unitAbbrev,
          }}
        />
      )
    }

    if (fieldName === 'dataRecorder') {
      return (
        <>
          <Box
            key={fieldName} // Stable across reorders; index would remount inputs
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
                setFieldValue('dataRecorder', itemValue).then(() => {
                  setFieldTouched('dataRecorder', true)
                })
              }}
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
    if (fieldName === 'secchi' && fieldType === 'input') {
      return (
        <Box key={fieldName} flexBasis='28%' minWidth='28%' maxWidth='28%' mr={8}>
          <SecchiInput
            value={values[fieldName]}
            onChangeValue={val => {
              setFieldTouched(fieldName, true)
              setFieldValue(fieldName, val)
            }}
            onBlur={() => handleBlur(fieldName)}
            touched={touched}
            errors={errors}
            displayName={displayName}
            unitAbbrev={unitAbbrev}
            validationSchema={validationSchema}
            camelName={fieldName}
          />
        </Box>
      )
    }

    if (fieldType === 'input') {
      let inputWidth = '28%'
      if (fieldName.toLowerCase().includes('flow')) {
        inputWidth = '20%'
      }
      return (
        <Box
          key={fieldName} // Stable across reorders; index would remount inputs
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
            formFields={focusList}
            orderIndex={entry.position}
            RightElement={
              unitAbbrev ? <TextInputAdornment text={unitAbbrev} /> : undefined
            }
          />
        </Box>
      )
    } else if (fieldType === 'select') {
      return (
        <Box
          key={fieldName} // Stable across reorders; index would remount inputs
          flexBasis='45%' // Ensures 3 items per row (adjust for spacing)
          minWidth='45%' // Prevents shrinking too much
          maxWidth='45%' // Prevents growing beyond this size>
          flexGrow={1}
          mr={8} // Removes right margin from every 3rd item
        >
          <FastSelect
            selectedValue={values[fieldName]}
            placeholder={`${displayName}`}
            camelName={fieldName}
            label={displayName}
            errors={errors}
            touched={touched}
            onValueChange={handleChange(fieldName)}
            setFieldTouched={() => setFieldTouched(fieldName)}
            selectOptions={resolveSelectOptions(item, dropdownValues)}
            validationSchema={validationSchema}
          />
        </Box>
      )
    } else if (fieldType === 'radio') {
      return (
        <Box
          key={fieldName} // Stable across reorders; index would remount inputs
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
      {/* Gate on the MERGED list, not formFields. A program with zero
          program_fields rows (Mill, Deer, Feather, Yuba) has an empty
          formFields but a full set of slots — gating on formFields here would
          render nothing at all for them. */}
      {merged.length > 0 && (
        <HStack flexWrap={'wrap'}>{merged.map(renderEntry)}</HStack>
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
