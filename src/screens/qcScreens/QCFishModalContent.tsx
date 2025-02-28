import {
  Button,
  Text,
  HStack,
  VStack,
  FormControl,
  Input,
  View,
  Radio,
  Spacer,
  AlertDialog,
} from 'native-base'
import React, { useMemo, useState } from 'react'
import CustomModalHeader from '../../components/Shared/CustomModalHeader'
import { FormValueI } from '../../utils/interfaces'

import {
  addFishErrorMessages,
  QARanges,
  reorderTaxon,
  alphabeticalSort,
} from '../../utils/utils'
import RenderWarningMessage from '../../components/Shared/RenderWarningMessage'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../redux/store'
import CustomSelect from '../../components/Shared/CustomSelect'
import {
  catchRawQCDeletion,
  catchRawQCSubmission,
} from '../../redux/reducers/postSlices/trapVisitFormPostBundler'
import { convertUTCToLocalTime } from '../../utils/helpers/helperFunctions'

const createFormValueDefault = ({
  value,
  required = false,
  error = '',
  touched = false,
}: {
  value: Array<any> | string | boolean | null
  required?: boolean
  error?: string
  touched?: boolean
}) => {
  return { value, touched, error, required }
}

const QCFishModalContent = ({
  closeModal,
  qcFishData,
  userCredentialsStore,
}: {
  closeModal: () => void
  qcFishData: any
  userCredentialsStore: any
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const [deleteConfirmIsOpen, setDeleteConfirmIsOpen] = useState(false)
  const onDeleteConfirmClose = () => setDeleteConfirmIsOpen(false)
  const cancelRef = React.useRef(null)

  const { createdCatchRawResponse } = qcFishData

  const dropdownValues = useSelector(
    (state: RootState) => state.dropdowns.values
  )

  const reorderedTaxon = reorderTaxon(dropdownValues.taxon)

  const alphabeticalLifeStage = alphabeticalSort(
    dropdownValues.lifeStage,
    'definition'
  )

  const [species, setSpecies] = useState<FormValueI>(
    createFormValueDefault({
      value: createdCatchRawResponse.taxonCode,
      touched: true,
      required: false,
    })
  )
  const [count, setCount] = useState<FormValueI>(
    createFormValueDefault({
      value: createdCatchRawResponse.numFishCaught,
      touched: true,
      required: false,
    })
  )
  const [forkLength, setForkLength] = useState<FormValueI>(
    createFormValueDefault({
      value: createdCatchRawResponse?.forkLength?.toString() || null,
      touched: true,
      required: false,
    })
  )
  const [run, setRun] = useState<FormValueI>(
    createFormValueDefault({
      value: createdCatchRawResponse.captureRunClass,
      touched: true,
      required: false,
    })
  )

  const [weight, setWeight] = useState<FormValueI>(
    createFormValueDefault({
      value: createdCatchRawResponse.weight,
      touched: true,
      required: false,
    })
  )
  const [lifeStage, setLifeStage] = useState<FormValueI>(
    createFormValueDefault({
      value: createdCatchRawResponse.lifeStage,
      touched: true,
      required: false,
    })
  )
  const [adiposeClipped, setAdiposeClipped] = useState<FormValueI>(
    createFormValueDefault({
      value: createdCatchRawResponse.adiposeClipped,
      touched: true,
      required: false,
    })
  )

  const [dead, setDead] = useState<FormValueI>(
    createFormValueDefault({
      value: createdCatchRawResponse.dead,
      touched: true,
      required: false,
    })
  )

  const handleSave = () => {
    try {
      const updatedCatchRawResponse = {
        taxonCode: species?.value,
        forkLength: forkLength?.value,
        weight: weight?.value,
        numFishCaught: count?.value,
        lifeStage: lifeStage?.value,
        captureRunClass: run?.value,
        dead: dead?.value,
        adiposeClipped: adiposeClipped?.value,
      }

      dispatch(
        catchRawQCSubmission({
          catchRawId: createdCatchRawResponse.id,
          userId: userCredentialsStore.id,
          submissions: [
            {
              isFullObject: true,
              value: updatedCatchRawResponse,
            },
          ],
        })
      )
      closeModal()
    } catch (error) {
      console.log('error', error)
    }
  }

  const handleDelete = () => {
    try {
      dispatch(
        catchRawQCDeletion({
          catchRawId: createdCatchRawResponse.id,
          userId: userCredentialsStore.id,
        })
      )
      closeModal()
    } catch (error) {
      console.log('error', error)
    }
  }

  return (
    <>
      <CustomModalHeader
        headerText={`QC Fish Edit - ${new Date(
          createdCatchRawResponse.trapVisitTimeEnd
        ).toLocaleDateString()}`}
        showHeaderButton={true}
        closeModal={closeModal}
      />
      {/* //TODO: Form state is being managed manually, need to refactor to ge error messages for form */}
      <View
        flex={1}
        bg='#fff'
        borderWidth='10'
        borderBottomWidth='0'
        borderColor='themeGrey'
      >
        <VStack paddingX='10' paddingBottom='3' space={3}>
          <HStack alignItems='center'>
            <View width={'100%'} mt={10}>
              <CustomSelect
                label='Species'
                // set selectedValue to using nestedModalInputValue.value as taxonCode to find commonname
                selectedValue={createdCatchRawResponse.taxonCode as string}
                placeholder={'Species'}
                onValueChange={(value: string) => {
                  const filteredTaxon = reorderedTaxon.filter(
                    (taxon: any) => taxon.code === value
                  )
                  const taxonCode = filteredTaxon[0]?.code

                  let payload: FormValueI = {
                    ...species,
                    value: taxonCode,
                    touched: true,
                    error: '',
                  }

                  setSpecies(payload)
                }}
                selectOptions={reorderedTaxon.map((taxon: any) => ({
                  label: taxon?.commonname,
                  value: taxon?.code,
                }))}
              />
            </View>
          </HStack>

          <HStack mt={5} space={4}>
            <FormControl w={'1/3'} pr='5'>
              <HStack space={4} alignItems='center'>
                <FormControl.Label>
                  <Text color='black' fontSize='md'>
                    Fork Length
                  </Text>
                </FormControl.Label>
                {/* {renderForkLengthWarning(
                  Number(forkLength.value),
                  lifeStage.value as string
                )} */}
              </HStack>
              <Input
                height='50px'
                fontSize='16'
                placeholder='Numeric Value'
                keyboardType='numeric'
                onChangeText={value => {
                  let payload: FormValueI = {
                    ...forkLength,
                    value,
                    touched: true,
                    error: '',
                  }
                  if (value === '') {
                    payload.error = addFishErrorMessages.forkLength.emptyError
                  } else if (!Number(value)) {
                    payload.error = addFishErrorMessages.forkLength.typeError
                  }
                  setForkLength(payload)
                }}
                // TODO - onBlur logic?
                // onBlur={handleBlur('forkLength')}
                value={forkLength.value as string}
              />
              {/* //TODO: Need to refactor to properly render error and warning message */}
              <Text
                color='#A1A1A1'
                position='absolute'
                top={50}
                right={8}
                fontSize={16}
              >
                {'mm'}
              </Text>
            </FormControl>
            <FormControl w={'1/3'} paddingRight='9'>
              <HStack space={4} alignItems='center'>
                <FormControl.Label>
                  <Text color='black' fontSize='md'>
                    Weight (optional)
                  </Text>
                </FormControl.Label>
              </HStack>
              <Input
                height='50px'
                fontSize='16'
                placeholder='Numeric Value'
                keyboardType='numeric'
                onChangeText={value => {
                  let payload: FormValueI = {
                    ...weight,
                    value,
                    touched: true,
                    error: '',
                  }
                  if (value === '') {
                    payload.error = ''
                  } else if (!Number(value)) {
                    payload.error = addFishErrorMessages.weight.typeError
                  }
                  setWeight(payload)
                }}
                // TODO - onBlur logic?
                // onBlur={handleBlur('weight')}
                value={weight.value as string}
              />
              <Text
                color='#A1A1A1'
                position='absolute'
                top={50}
                right={12}
                fontSize={16}
              >
                {'g'}
              </Text>
            </FormControl>

            <FormControl w='1/3' pr='5'>
              <FormControl.Label>
                <Text color='black' fontSize='md'>
                  Count
                </Text>
              </FormControl.Label>
              <Input
                height='50px'
                fontSize='16'
                placeholder='Numeric Value'
                keyboardType='numeric'
                onChangeText={value => setCount({ ...count, value })}
                // TODO - onBlur logic?
                // onBlur={handleBlur('numFishCaught')}
                value={`${count.value}`}
              />
            </FormControl>
          </HStack>

          <HStack mt={5} space={4} alignItems='center'>
            {/*chinook or steelhead*/}
            {(species.value === '161980' || species.value === '161989') && (
              <FormControl w='1/2' paddingRight='5'>
                <CustomSelect
                  label='Life Stage'
                  selectedValue={lifeStage.value as string}
                  placeholder={'Life Stage'}
                  onValueChange={(value: string) => {
                    let payload: FormValueI = {
                      ...lifeStage,
                      value,
                      error: '',
                    }
                    setLifeStage(payload)
                  }}
                  setFieldTouched={() => {
                    let payload = { ...lifeStage, touched: true }
                    if (!lifeStage.value)
                      payload.error = addFishErrorMessages.lifeStage.emptyError
                    setLifeStage(payload)
                  }}
                  selectOptions={alphabeticalLifeStage
                    .filter((item: any) => {
                      if (
                        item?.definition?.includes('juvenile') ||
                        item?.definition?.includes('adult')
                      ) {
                        return item
                      } else if (species.value == '161980') {
                        //chinook
                        return item
                      }
                    })
                    .map((item: any) => ({
                      label: item?.definition,
                      value: item?.id,
                    }))}
                />
              </FormControl>
            )}
            {species.value === '161980' && (
              <FormControl w='1/2' paddingRight='9'>
                <CustomSelect
                  label='Run'
                  errors={{ run: run.error }}
                  selectedValue={run.value as string}
                  placeholder={'Run'}
                  onValueChange={(value: string) => setRun({ ...run, value })}
                  setFieldTouched={() => setRun({ ...run, touched: true })}
                  selectOptions={dropdownValues.run.map((run: any) => ({
                    label: run?.definition,
                    value: run?.id,
                  }))}
                />
              </FormControl>
            )}
          </HStack>
          <HStack mt={5} space={4}>
            <FormControl w='1/3'>
              <HStack space={4} alignItems='center'>
                <FormControl.Label>
                  <Text color='black' fontSize='xl'>
                    Dead
                  </Text>
                </FormControl.Label>

                <Radio.Group
                  name='dead'
                  accessibilityLabel='dead'
                  value={`${dead.value}`}
                  onChange={(value: any) => {
                    if (value === 'true') {
                      setDead({ ...dead, value: true })
                    } else {
                      setDead({ ...dead, value: false })
                    }
                  }}
                >
                  <HStack space={4}>
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
                  </HStack>
                </Radio.Group>
              </HStack>
            </FormControl>

            {species.value === '161980' && (
              <FormControl w='1/3'>
                <HStack space={4} alignItems='center'>
                  <FormControl.Label>
                    <Text color='black' fontSize='xl'>
                      Adipose Clipped
                    </Text>
                  </FormControl.Label>

                  <Radio.Group
                    name='adiposeClipped'
                    accessibilityLabel='adipose clipped'
                    value={`${adiposeClipped.value}`}
                    onChange={(value: any) => {
                      if (value === 'true') {
                        setAdiposeClipped({
                          ...adiposeClipped,
                          value: true,
                        })
                      } else {
                        setAdiposeClipped({
                          ...adiposeClipped,
                          value: false,
                        })
                      }
                    }}
                  >
                    <HStack space={4}>
                      <Radio
                        colorScheme='primary'
                        value='true'
                        my={1}
                        _icon={{ color: 'primary' }}
                      >
                        True
                      </Radio>
                      <Radio
                        colorScheme='primary'
                        value='false'
                        my={1}
                        _icon={{ color: 'primary' }}
                      >
                        False
                      </Radio>
                    </HStack>
                  </Radio.Group>
                </HStack>
              </FormControl>
            )}
          </HStack>
        </VStack>
        <Spacer />
        <HStack justifyContent='center' style={{ marginBottom: 20 }}>
          <Button
            m={5}
            alignSelf='center'
            borderRadius={10}
            bg='themeOrange'
            h='60px'
            w='200px'
            shadow='5'
            _disabled={{
              opacity: '75',
            }}
            onPress={() => {
              closeModal()
            }}
          >
            <Text fontSize='lg' fontWeight='bold' color='white'>
              Cancel
            </Text>
          </Button>
          <Button
            m={5}
            alignSelf='center'
            borderRadius={10}
            bg='#b71c1c'
            h='60px'
            w='200px'
            shadow='5'
            _disabled={{
              opacity: '75',
            }}
            onPress={() => setDeleteConfirmIsOpen(true)}
          >
            <Text fontSize='lg' fontWeight='bold' color='white'>
              Delete
            </Text>
          </Button>
          <Button
            m={5}
            alignSelf='center'
            borderRadius={10}
            bg='primary'
            h='60px'
            w='200px'
            shadow='5'
            _disabled={{
              opacity: '75',
            }}
            onPress={handleSave}
          >
            <Text fontSize='lg' fontWeight='bold' color='white'>
              Confirm
            </Text>
          </Button>
        </HStack>
      </View>
      {deleteConfirmIsOpen && (
        <AlertDialog
          leastDestructiveRef={cancelRef}
          isOpen={deleteConfirmIsOpen}
          onClose={onDeleteConfirmClose}
        >
          <AlertDialog.Content>
            <AlertDialog.CloseButton />
            <AlertDialog.Header>Delete Confirmation</AlertDialog.Header>
            <AlertDialog.Body>
              Are you sure you want to delete this fish record? This action
              cannot be undone.
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button.Group space={2}>
                <Button
                  variant='unstyled'
                  colorScheme='coolGray'
                  onPress={onDeleteConfirmClose}
                  ref={cancelRef}
                >
                  Cancel
                </Button>
                <Button colorScheme='danger' onPress={handleDelete}>
                  Delete
                </Button>
              </Button.Group>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog>
      )}
    </>
  )
}

export default QCFishModalContent
