import React, { useCallback, memo } from 'react'
import {
  Box,
  CheckIcon,
  FormControl,
  Icon,
  IconButton,
  Popover,
  Select,
  Text,
} from 'native-base'
import { capitalize } from 'lodash'
import { StyleProp, ViewStyle } from 'react-native'
import RenderErrorMessage from './RenderErrorMessage'
import { FormikErrors, FormikTouched, FastField } from 'formik'
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
}

const itemLabelModifier = (label: string, placeholder: string) => {
  if (placeholder === 'Species') {
    return label
  } else if (placeholder === 'Funding Agency' && label !== 'not recorded') {
    return label.toLocaleUpperCase()
  } else return label.replace(/\w+/g, capitalize)
}

const FastSelect = ({
  field,
  form,
  placeholder,
  selectOptions,
  dataType,
  onValueChange,
}: {
  field: any
  form: any
  placeholder: any
  selectOptions: any
  dataType: any
  onValueChange: any
}) => {
  return (
    <Select
      height={50}
      fontSize={16}
      selectedValue={field.value}
      onValueChange={onValueChange}
      placeholder='Choose an option'
      _selectedItem={{
        bg: 'teal.600',
        endIcon: <CheckIcon size='5' />,
      }}
    >
      {selectOptions ? (
        selectOptions.map((item: any, idx: number) => {
          if (dataType === 'fundingAgency') {
            return (
              <Select.Item
                key={item.id ?? idx}
                label={itemLabelModifier(item.definition, placeholder)}
                value={item.definition}
              />
            )
          } else if (item.value) {
            return (
              <Select.Item
                key={item.id ?? idx}
                label={itemLabelModifier(item.label, placeholder)}
                value={item.value}
              />
            )
          } else if (item.definition) {
            return (
              <Select.Item
                key={item.id}
                label={itemLabelModifier(item.definition, placeholder)}
                value={item.definition}
              />
            )
          } else if (item.code) {
            return (
              <Select.Item
                key={item.id}
                label={`${item.code.toUpperCase()} ${
                  item.description ? `- ${item.description}` : ''
                }`}
                value={item.code}
              />
            )
          } else {
            return <Select.Item key={`item-${idx}`} label={item} value={item} />
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
  )
}

const CustomFastSelect: React.FC<CustomSelectI> = ({
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
}) => {
  const hasError = errors[camelName]
  const isTouched = touched[camelName]

  const showError = hasError && isTouched

  return (
    <Box minH={100}>
      <FormControl flex={1}>
        <FormControl.Label
          style={{
            flexDirection: 'row',
            display: 'flex',
            alignContent: 'center',
            gap: 5,
          }}
        >
          <Text color={showError ? 'red.700' : 'black'} fontSize='md'>
            {label}
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
                accessibilityLabel='tooltip'
                // w='720'
                // h='600'
              >
                <Popover.Arrow />
                <Popover.Body padding={5}>{tooltip}</Popover.Body>
              </Popover.Content>
            </Popover>
          )}
        </FormControl.Label>
        <FastField
          name={camelName}
          component={FastSelect}
          placeholder={placeholder}
          selectOptions={selectOptions}
          dataType={dataType}
          onValueChange={onValueChange}
        />
        {showError && (
          <Box mt={2} h={25}>
            {showError && (
              <RenderErrorMessage errors={errors} inputName={camelName} />
            )}
          </Box>
        )}
      </FormControl>
    </Box>
  )
}
export default memo(CustomFastSelect)
