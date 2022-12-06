import React, { memo } from 'react'
import { CheckIcon, Select } from 'native-base'
import { startCase } from 'lodash'

interface CustomSelectI {
  selectedValue: string
  placeholder: string
  setFieldTouched: any
  onValueChange: any
  selectOptions: any[]
}

const CustomSelect: React.FC<CustomSelectI> = (props) => {
  return (
    <Select
      height='50px'
      fontSize='16'
      selectedValue={props.selectedValue}
      minWidth='100'
      accessibilityLabel={props.placeholder}
      placeholder={props.placeholder}
      _selectedItem={{
        bg: 'secondary',
        endIcon: <CheckIcon size='6' />,
      }}
      mt={1}
      onValueChange={(itemValue) => {
        props.setFieldTouched(props.selectedValue, true)
        props.onValueChange(itemValue)
      }}
    >
      {props.selectOptions ? (
        props?.selectOptions.map((item, idx) => {
          if (item.value) {
            return (
              <Select.Item
                key={item.id ?? idx}
                label={
                  props.placeholder === 'Species'
                    ? item.label
                    : startCase(item.label)
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
                    : startCase(item.definition)
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
