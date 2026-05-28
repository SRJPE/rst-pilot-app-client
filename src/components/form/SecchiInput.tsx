import React, { useState } from 'react'
import {
  Box,
  FormControl,
  Icon,
  IconButton,
  Input,
  Pressable,
  Text,
} from 'native-base'
import { MaterialIcons } from '@expo/vector-icons'
import RenderErrorMessage from '../Shared/RenderErrorMessage'
import { renderRequiredOrOptionalLabel } from '../../utils/utils'

const TOO_CLEAR = 'Too Clear for Secchi'

const SecchiInput = ({
  value,
  onChangeValue,
  onBlur,
  touched,
  errors,
  displayName,
  unitAbbrev,
  validationSchema,
  camelName,
}: {
  value: any
  onChangeValue: (val: string) => void
  onBlur: () => void
  touched: any
  errors: any
  displayName: string
  unitAbbrev?: string
  validationSchema?: any
  camelName: string
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const tooClear = value === TOO_CLEAR
  const hasError = errors[camelName] && touched[camelName]

  return (
    <Box minH={100} flex={1}>
      <FormControl flex={1} isInvalid={!!hasError}>
        <FormControl.Label>
          <Text color={hasError ? 'red.700' : 'black'} fontSize='16'>
            {displayName}
            {validationSchema
              ? renderRequiredOrOptionalLabel({
                  fieldName: camelName,
                  validationSchema,
                })
              : ''}
          </Text>
        </FormControl.Label>
        <Box position='relative'>
          <Input
            value={tooClear ? TOO_CLEAR : value ?? ''}
            readOnly={tooClear}
            height={50}
            fontSize='16'
            keyboardType={tooClear ? 'default' : 'decimal-pad'}
            placeholder='0'
            onChangeText={text => {
              if (!tooClear) onChangeValue(text)
            }}
            onBlur={onBlur}
            borderColor={hasError ? 'red.700' : 'muted.300'}
            _focus={{ borderColor: hasError ? 'red.700' : 'muted.300' }}
            _invalid={{ borderColor: 'red.700' }}
            rightElement={
              <Box flexDir='row' alignItems='center'>
                {unitAbbrev && !tooClear && (
                  <Text px={2} color='warmGray.400'>
                    {unitAbbrev}
                  </Text>
                )}
                {tooClear ? (
                  <IconButton
                    mr={1}
                    size='sm'
                    icon={
                      <Icon
                        as={MaterialIcons}
                        name='close'
                        size='sm'
                        color='gray.500'
                      />
                    }
                    onPress={() => onChangeValue('')}
                  />
                ) : (
                  <IconButton
                    mr={1}
                    size='sm'
                    icon={
                      <Icon
                        as={MaterialIcons}
                        name='arrow-drop-down'
                        size='md'
                        color='gray.500'
                      />
                    }
                    onPress={() => setIsOpen(prev => !prev)}
                  />
                )}
              </Box>
            }
          />
          {isOpen && (
            <Box
              position='absolute'
              top={50}
              left={0}
              right={0}
              bg='white'
              borderWidth={1}
              borderColor='muted.300'
              shadow={3}
              zIndex={999}
            >
              <Pressable
                px={4}
                py={3}
                onPress={() => {
                  onChangeValue(TOO_CLEAR)
                  setIsOpen(false)
                }}
                _pressed={{ bg: 'gray.100' }}
              >
                <Text fontSize='md'>{TOO_CLEAR}</Text>
              </Pressable>
            </Box>
          )}
        </Box>
        <Box mt={2} h={25} mb={hasError ? 2 : 0}>
          {hasError && (
            <RenderErrorMessage errors={errors} inputName={camelName} />
          )}
        </Box>
      </FormControl>
    </Box>
  )
}

export default SecchiInput
