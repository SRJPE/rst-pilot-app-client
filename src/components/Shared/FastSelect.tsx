import React, { useCallback, memo } from 'react'
import {
  Box,
  FormControl,
  Icon,
  IconButton,
  Popover,
  Select as NBSelect,
  Text,
} from 'native-base'
import { capitalize, find } from 'lodash'
import { StyleProp, ViewStyle } from 'react-native'
import RenderErrorMessage from './RenderErrorMessage'
import { FormikErrors, FormikTouched, FastField } from 'formik'
import { MaterialIcons } from '@expo/vector-icons'
import { renderRequiredOrOptionalLabel } from '../../utils/utils'
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
const itemStyle = { style: { fontSize: 16, height: 24, color: 'black' } }

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
  let selectInputValue = itemLabelModifier(field.value ?? '', placeholder)

  if (selectOptions?.[0]?.code && field.value) {
    const item = find(
      selectOptions,
      (item: any) => item?.code?.toUpperCase() === field?.value?.toUpperCase()
    )

    if (item) {
      selectInputValue = `${item.code.toUpperCase()}`
    }
  }
  return (
    <Select
      style={[
        {
          borderColor: '#d4d4d4d4',
          borderWidth: 1,
          minWidth: 100,
          marginTop: 1,
          borderRadius: 4,
          height: 50,
        },
      ]}
      selectedValue={field.value}
      accessibilityLabel={placeholder}
      placeholder={placeholder}
      onValueChange={onValueChange}
    >
      <SelectTrigger
        variant='outline'
        size='lg'
        style={[
          {
            height: '100%',
          },
        ]}
      >
        <SelectInput
          placeholder='Select option'
          className='flex-1'
          // selectedValue=
          value={selectInputValue}
          multiline={false}
          style={{
            overflow: 'hidden',
          }}
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
            {selectOptions ? (
              selectOptions.map((item: any, idx: number) => {
                if (dataType === 'fundingAgency') {
                  return (
                    <SelectItem
                      key={item.id ?? idx}
                      label={itemLabelModifier(item.definition, placeholder)}
                      value={item.definition}
                      textStyle={itemStyle}
                    />
                  )
                } else if (item.value) {
                  return (
                    <SelectItem
                      key={item.id ?? idx}
                      label={itemLabelModifier(item.label, placeholder)}
                      value={item.value}
                      textStyle={itemStyle}
                    />
                  )
                } else if (item.definition) {
                  return (
                    <SelectItem
                      key={item.id}
                      label={itemLabelModifier(item.definition, placeholder)}
                      value={item.definition}
                      textStyle={itemStyle}
                    />
                  )
                } else if (item.code) {
                  return (
                    <SelectItem
                      key={item.id}
                      label={`${item.code.toUpperCase()} ${
                        item.description ? `- ${item.description}` : ''
                      }`}
                      value={item.code}
                      textStyle={itemStyle}
                    />
                  )
                } else {
                  return (
                    <SelectItem
                      key={`item-${idx}`}
                      label={item}
                      value={item}
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
  )
  // return (
  //   <NBSelect
  //     height={50}
  //     fontSize={16}
  //     selectedValue={field.value}
  //     onValueChange={onValueChange}
  //     placeholder='Choose an option'
  //     _selectedItem={{
  //       bg: 'teal.600',
  //       endIcon: <CheckIcon size='5' />,
  //     }}
  //   >
  //     {selectOptions ? (
  //       selectOptions.map((item: any, idx: number) => {
  //         if (dataType === 'fundingAgency') {
  //           return (
  //             <NBSelect.Item
  //               key={item.id ?? idx}
  //               label={itemLabelModifier(item.definition, placeholder)}
  //               value={item.definition}
  //             />
  //           )
  //         } else if (item.value) {
  //           return (
  //             <NBSelect.Item
  //               key={item.id ?? idx}
  //               label={itemLabelModifier(item.label, placeholder)}
  //               value={item.value}
  //             />
  //           )
  //         } else if (item.definition) {
  //           return (
  //             <NBSelect.Item
  //               key={item.id}
  //               label={itemLabelModifier(item.definition, placeholder)}
  //               value={item.definition}
  //             />
  //           )
  //         } else if (item.code) {
  //           return (
  //             <NBSelect.Item
  //               key={item.id}
  //               label={`${item.code.toUpperCase()} ${
  //                 item.description ? `- ${item.description}` : ''
  //               }`}
  //               value={item.code}
  //             />
  //           )
  //         } else {
  //           return (
  //             <NBSelect.Item key={`item-${idx}`} label={item} value={item} />
  //           )
  //         }
  //       })
  //     ) : (
  //       <NBSelect.Item
  //         key={'not received from api'}
  //         label={'No options found... connect to wifi!'}
  //         value={'No options found... connect to wifi!'}
  //       />
  //     )}
  //   </NBSelect>
  // )
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
