import React, { useCallback, memo, useMemo } from 'react'
import { Box, Icon, IconButton, Popover } from 'native-base'
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from '@/components/ui/form-control'
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectItem,
  SelectScrollView,
} from '@/components/ui/select'
import { ChevronDownIcon } from '@/components/ui/icon'
import { capitalize } from 'lodash'
import { StyleProp, ViewStyle } from 'react-native'
import RenderErrorMessage from './RenderErrorMessage'
import { FormikErrors, FormikTouched } from 'formik'
import { MaterialIcons } from '@expo/vector-icons'
import { renderRequiredOrOptionalLabel } from '../../utils/utils'

interface CustomSelectI {
  selectedValue: string
  placeholder: string
  setFieldTouched?: any
  onValueChange: any
  selectOptions: any[]
  style?: StyleProp<ViewStyle>
  dataType?: string
  disabled?: boolean
  errors?: FormikErrors<any>
  label?: string
  camelName?: string
  touched?: FormikTouched<any>
  tooltip?: React.ReactNode
  validationSchema?: any
  onOpenCallback?: () => void
}

const itemStyle = { style: { fontSize: 16, height: 24, color: 'black' } }

const CustomSelect: React.FC<CustomSelectI> = ({
  selectOptions,
  selectedValue,
  placeholder,
  setFieldTouched,
  onValueChange,
  style,
  dataType,
  disabled,
  errors = {},
  camelName = '',
  touched = {},
  label = 'No label provided',
  tooltip,
  validationSchema,
  onOpenCallback,
}) => {
  const handleOnChange = useCallback(
    (itemValue: any) => {
      onValueChange(itemValue)
    },
    [selectedValue]
  )

  const hasError = errors[camelName]
  const isTouched = touched[camelName]

  const showError = hasError && isTouched

  const itemLabelModifier = (label: string) => {
    if (typeof label !== 'string') return ''
    if (
      placeholder === 'Species' ||
      [
        'dataRecorder',
        'fieldCheck',
        'crewMember',
        'fundingAgency',
        'agency',
      ].includes(camelName || '')
    ) {
      return label
    } else if (placeholder === 'Funding Agency' && label !== 'not recorded') {
      return label.toLocaleUpperCase()
    } else if (camelName === 'trapSite') {
      return label
    } else return label.replace(/\w+/g, capitalize)
  }

  const sortedOptions = useMemo(() => {
    return selectOptions
      ? [...selectOptions].sort((a: any, b: any) => {
          const aValue = a.definition || a.code || ''
          const bValue = b.definition || b.code || ''

          if (aValue === 'processed fish') return -1
          if (bValue === 'processed fish') return 1

          if (aValue === 'not recorded') return 1
          if (bValue === 'not recorded') return -1

          if (aValue < bValue) return -1
          if (aValue > bValue) return 1
          return 0
        })
      : []
  }, [selectOptions])

  return (
    <Box minH={100}>
      <FormControl>
        <FormControlLabel
          style={{
            flexDirection: 'row',
            display: 'flex',
            alignContent: 'center',
            gap: 5,
          }}
        >
          <FormControlLabelText
            style={{ color: showError ? 'red.700' : 'black', fontSize: 16 }}
          >
            {label}{' '}
            {validationSchema
              ? renderRequiredOrOptionalLabel({
                  fieldName: camelName,
                  validationSchema,
                })
              : ''}
          </FormControlLabelText>
          {tooltip && (
            <Popover
              placement='bottom right'
              trigger={triggerProps => {
                return (
                  <IconButton
                    p={0}
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
              <Popover.Content ml='10' accessibilityLabel='Life Stage Info'>
                <Popover.Arrow />
                <Popover.CloseButton />
                <Popover.Body p={0}>{tooltip}</Popover.Body>
              </Popover.Content>
            </Popover>
          )}
        </FormControlLabel>
        <Select
          style={[
            {
              borderColor: showError ? 'darkred' : '#d4d4d4d4',
              borderWidth: 0,
              minWidth: 100,
              marginTop: 1,
              borderRadius: 4,
              height: 50,
            },
          ]}
          selectedValue={selectedValue ?? ''}
          accessibilityLabel={placeholder}
          placeholder={placeholder}
          onValueChange={handleOnChange}
          onClose={() => {
            if (setFieldTouched) setFieldTouched()
          }}
          onOpen={onOpenCallback}
          isDisabled={disabled}
        >
          <SelectTrigger
            variant='outline'
            size='lg'
            style={[
              {
                height: '100%',
                // borderWidth: 0,
              },
            ]}
          >
            <SelectInput
              placeholder='Select option'
              className='flex-1'
              // selectedValue=
              value={itemLabelModifier(selectedValue ?? '')}
            />
            <SelectIcon className='mr-3' as={ChevronDownIcon} />
          </SelectTrigger>
          <SelectPortal>
            <SelectBackdrop />
            <SelectContent style={{ maxHeight: 400, overflow: 'scroll' }}>
              <SelectDragIndicatorWrapper>
                <SelectDragIndicator />
              </SelectDragIndicatorWrapper>
              <SelectScrollView>
                {sortedOptions ? (
                  sortedOptions.map((item, idx) => {
                    if (dataType === 'fundingAgency') {
                      return (
                        <SelectItem
                          key={item.id ?? idx}
                          label={itemLabelModifier(item.definition)}
                          value={item.definition}
                          textStyle={itemStyle}
                        />
                      )
                    } else if (item.value) {
                      return (
                        <SelectItem
                          key={item.id ?? idx}
                          label={itemLabelModifier(item.label)}
                          value={item.value}
                          textStyle={itemStyle}
                        />
                      )
                    } else if (item.definition) {
                      return (
                        <SelectItem
                          key={item.id}
                          label={itemLabelModifier(item.definition)}
                          value={item.definition}
                          textStyle={itemStyle}
                        />
                      )
                    }
                  })
                ) : (
                  <SelectItem
                    key={'not received from api'}
                    label={'No options found... connect to wifi!'}
                    value={'No options found... connect to wifi!'}
                  />
                )}
              </SelectScrollView>
            </SelectContent>
          </SelectPortal>
        </Select>
        {showError && (
          <Box mt={2} h={25}>
            {showError && (
              <RenderErrorMessage errors={errors} inputName={camelName} />
            )}
          </Box>
        )}
      </FormControl>
      {/* <FormControl flex={1}>
        <FormControl.Label
          style={{
            flexDirection: 'row',
            display: 'flex',
            alignContent: 'center',
            gap: 5,
          }}
        >
          <Text color={showError ? 'red.700' : 'black'} fontSize='md'>
            {label}{' '}
            {validationSchema
              ? renderRequiredOrOptionalLabel({
                  fieldName: camelName,
                  validationSchema,
                })
              : ''}
          </Text>
          {tooltip && (
            <Popover
              placement='bottom right'
              trigger={triggerProps => {
                return (
                  <IconButton
                    p={0}
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
              <Popover.Content
                ml='10'
                accessibilityLabel='Life Stage Info'
                w='720'
                h='600'
              >
                <Popover.Arrow />
                <Popover.CloseButton />
                <Popover.Body p={0}>{tooltip}</Popover.Body>
              </Popover.Content>
            </Popover>
          )}
        </FormControl.Label>
        <Select
          borderColor={showError ? 'red.700' : 'muted.300'}
          height='50px'
          fontSize='16'
          selectedValue={selectedValue ?? ''}
          minWidth='100'
          style={style}
          onOpen={onOpenCallback}
          accessibilityLabel={placeholder}
          placeholder={placeholder}
          _selectedItem={{
            bg: 'secondary',
            endIcon: <CheckIcon size='6' />,
          }}
          mt={1}
          onValueChange={handleOnChange}
          onClose={() => {
            if (setFieldTouched) setFieldTouched()
          }}
          isDisabled={disabled}
        >
          {sortedOptions ? (
            sortedOptions.map((item, idx) => {
              if (dataType === 'fundingAgency') {
                return (
                  <Select.Item
                    key={item.id ?? idx}
                    label={itemLabelModifier(item.definition)}
                    value={item.definition}
                  />
                )
              } else if (item.value) {
                return (
                  <Select.Item
                    key={item.id ?? idx}
                    label={itemLabelModifier(item.label)}
                    value={item.value}
                  />
                )
              } else if (item.definition) {
                return (
                  <Select.Item
                    key={item.id}
                    label={itemLabelModifier(item.definition)}
                    value={item.definition}
                  />
                )
              } else if (item.code) {
                return (
                  <Select.Item
                    key={item.id}
                    label={`${item.code.toUpperCase()} - ${item.description}`}
                    value={item.code}
                  />
                )
              }
            })
          ) : (
            <Select.Item
              key={'not received from api'}
              label={'No options found... connect to wifi!'}
              value={'No options found... connect to wifi!'}
            />
          )}
        </Select>
        {showError && (
          <Box mt={2} h={25}>
            {showError && (
              <RenderErrorMessage errors={errors} inputName={camelName} />
            )}
          </Box>
        )}
      </FormControl> */}
    </Box>
  )
}
export default memo(CustomSelect)
