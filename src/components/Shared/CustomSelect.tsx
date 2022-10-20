import React from 'react'
import { CheckIcon, Select } from 'native-base'

interface CustomSelectI {
  selectedValue: string
  placeholder: string
  setFieldTouched?: any
  onValueChange: any
  selectOptions: any[]
}

const CustomSelect: React.FC<CustomSelectI> = props => {
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
      onValueChange={itemValue => {
        props.setFieldTouched(props.selectedValue, true)
        props.onValueChange(itemValue)
      }}
    >
      {props.selectOptions.map((item, idx) =>
        item.value ? (
          <Select.Item key={idx} label={item.label} value={item.value} />
        ) : (
          <Select.Item
            key={item.id}
            label={item.definition}
            value={item.definition}
          />
        )
      )}
    </Select>
  )
}
export default CustomSelect
