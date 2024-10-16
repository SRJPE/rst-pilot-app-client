import React, { useCallback, memo } from 'react'
import { CheckIcon, Select } from 'native-base'
import { capitalize } from 'lodash'
import { StyleProp, ViewStyle } from 'react-native'

interface CustomSelectI {
  selectedValue: string
  placeholder: string
  setFieldTouched: any
  onValueChange: any
  selectOptions: any[]
  style?: StyleProp<ViewStyle>
  dataType?: string
  disabled?: boolean
}

const CustomSelect: React.FC<CustomSelectI> = props => {
  const handleOnChange = useCallback(
    (itemValue: any) => {
      props.onValueChange(itemValue)
    },
    [props.selectedValue]
  )

  return (
    <Select
      height='50px'
      fontSize='16'
      selectedValue={props.selectedValue ?? ''}
      minWidth='100'
      style={props.style}
      accessibilityLabel={props.placeholder}
      placeholder={props.placeholder}
      _selectedItem={{
        bg: 'secondary',
        endIcon: <CheckIcon size='6' />,
      }}
      mt={1}
      onValueChange={handleOnChange}
      onClose={() => props.setFieldTouched()}
      isDisabled={props?.disabled}
    >
      {props.selectOptions ? (
        props?.selectOptions.map((item, idx) => {
          if (props.dataType === 'fundingAgency') {
            return (
              <Select.Item
                key={item.id ?? idx}
                label={item.definition}
                value={item.id.toString()}
              />
            )
          } else if (item.value) {
            return (
              <Select.Item
                key={item.id ?? idx}
                label={
                  props.placeholder === 'Species'
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
                  props.placeholder === 'Species'
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
  )
}
export default memo(CustomSelect)
