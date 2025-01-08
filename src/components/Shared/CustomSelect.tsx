import React, { useCallback, memo } from 'react'
import { Box, CheckIcon, FormControl, Select, Text } from 'native-base'
import { capitalize } from 'lodash'
import { StyleProp, ViewStyle } from 'react-native'
import RenderErrorMessage from './RenderErrorMessage'
import { FormikErrors, FormikTouched } from 'formik'

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
}

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

  return (
    <FormControl flex={1}>
      <FormControl.Label>
        <Text color={showError ? 'red.700' : 'black'} fontSize='md'>
          {label}
        </Text>
      </FormControl.Label>
      <Select
        borderColor={showError ? 'red.700' : 'muted.300'}
        height='50px'
        fontSize='16'
        selectedValue={selectedValue ?? ''}
        minWidth='100'
        style={style}
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
        {selectOptions ? (
          selectOptions.map((item, idx) => {
            if (dataType === 'fundingAgency') {
              return (
                <Select.Item
                  key={item.id ?? idx}
                  label={item.definition}
                  value={item.definition}
                />
              )
            } else if (item.value) {
              return (
                <Select.Item
                  key={item.id ?? idx}
                  label={
                    placeholder === 'Species'
                      ? item.label
                      : item.label.replace(/\w+/g, capitalize)
                  }
                  value={item.value}
                />
              )
            } else if (item.definition) {
              return (
                <Select.Item
                  key={item.id}
                  label={
                    placeholder === 'Species'
                      ? item.definition
                      : item.definition.replace(/\w+/g, capitalize)
                  }
                  value={item.definition}
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
      <Box mt={2} h={25}>
        {showError && (
          <RenderErrorMessage errors={errors} inputName={camelName} />
        )}
      </Box>
    </FormControl>
  )
}
export default memo(CustomSelect)
