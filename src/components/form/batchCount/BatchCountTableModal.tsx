import {
  Button,
  FormControl,
  Heading,
  HStack,
  Input,
  Modal,
  Text,
} from 'native-base'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { updateSingleForkLengthCount } from '../../../redux/reducers/formSlices/fishInputSlice'
import { AppDispatch } from '../../../redux/store'

const BatchCountTableModal = ({
  showTableModal,
  setShowTableModal,
  modalInitialData,
}: // setModalData,
{
  showTableModal: any
  setShowTableModal: any
  modalInitialData: any
  // setModalData: any
}) => {
  // console.log('🚀 ~ modalData', modalInitialData)
  const [modalDataTemp, setModalDataTemp] = useState({
    forkLength: '',
    count: '',
  } as any)
  const [currentCount, setCurrentCount] = useState(null as any)
  const [keyToChange, setKeyToChange] = useState('' as string)
  const [valueToChange, setValueToChange] = useState('' as string)
  const dispatch = useDispatch<AppDispatch>()
  // console.log('🚀 ~ modalDataTemp', modalDataTemp)

  // useEffect(() => {
  //   setModalData({ ...modalData, keyToChange: valueToChange })
  // }, [keyToChange])
  useEffect(() => {
    setModalDataTemp(modalInitialData)
    setCurrentCount(modalInitialData.count)
  }, [])
  useEffect(() => {
    // console.log(
    //   '🚀 ~ useEffect ~ Object.values(modalDataTemp)',
    //   Object.values(modalDataTemp)
    //     .slice(2)
    //     .reduce((a: any, b: any) => Number(a) + Number(b))
    // )
    console.log('LENGTH: ', Object.values(modalDataTemp))
    Object.values(modalDataTemp).length >= 3 &&
      setCurrentCount(
        Object.values(modalDataTemp)
          .slice(2)
          .reduce((a: any, b: any) => Number(a) + Number(b))
      )
  }, [modalDataTemp])

  const handleChangeModalText = (text: string) => {
    // console.log('🚀 ~ handleChangeModalText ~ text', text)
    // // console.log('TEST', arguments[0])
    // modalDataTemp({ ...modalInitialData, count: text })
  }
  const handleEditForkLengthCount = () => {
    dispatch(
      updateSingleForkLengthCount({ ...modalDataTemp, count: currentCount })
    )
    setModalDataTemp(modalInitialData)
    setCurrentCount(modalInitialData.count)
  }

  const renderLifeStageInputs = (modalDataTemp: any) => {
    return Object.keys(modalDataTemp).map((key: string) => {
      const keyTEST = key
      if (key !== 'forkLength' && key !== 'count') {
        // console.log('🚀 ~ returnObject.keys ~ key', keyTEST)
        // console.log('🚀 ~ returnObject.keys ~ val', modalDataTemp[key])
        return (
          <FormControl mt='3'>
            <FormControl.Label>
              <Text color='black' fontSize='xl'>
                {key}
              </Text>
            </FormControl.Label>
            <Input
              size='2xl'
              value={modalDataTemp[key]}
              isFocused
              keyboardType='numeric'
              onChangeText={
                (value: any) => {
                  setModalDataTemp({
                    ...modalDataTemp,
                    [keyTEST]: value,
                  })
                  // setKeyToChange(key)
                  // setValueToChange(modalData[key])
                }
                // handleChangeModalText
              }
            />
          </FormControl>
        )
      }
    })
  }

  return (
    <Modal isOpen={showTableModal} onClose={() => setShowTableModal(false)}>
      <Modal.Content maxWidth='400px'>
        <Modal.CloseButton />
        <Modal.Header>
          <Heading color='black' fontSize='2xl'>
            Edit Fork Length Count
          </Heading>
        </Modal.Header>
        <Modal.Body>
          <HStack alignItems='center' space={2}>
            <Text color='black' fontSize='xl'>
              Fork Length:
            </Text>
            <Text bold color='black' fontSize='2xl'>
              {modalInitialData.forkLength}
            </Text>
          </HStack>
          <HStack alignItems='center' space={2}>
            <Text color='black' fontSize='xl'>
              Count:
            </Text>
            <Text bold color='black' fontSize='2xl'>
              {currentCount}
            </Text>
          </HStack>
          {/* {renderLifeStageInputs(modalInitialData)} */}
          {Object.keys(modalInitialData).map((key: string) => {
            const keyTEST = key
            if (key !== 'forkLength' && key !== 'count') {
              // console.log('🚀 ~ returnObject.keys ~ key', keyTEST)
              // console.log('🚀 ~ returnObject.keys ~ val', modalDataTemp[key])
              return (
                <FormControl mt='3' key={key}>
                  <FormControl.Label>
                    <Text color='black' fontSize='xl'>
                      {key}
                    </Text>
                  </FormControl.Label>
                  <Input
                    size='2xl'
                    value={modalDataTemp[key]}
                    isFocused
                    keyboardType='numeric'
                    onChangeText={
                      (value: any) => {
                        setModalDataTemp({
                          ...modalDataTemp,
                          [keyTEST]: value,
                        })
                        // setKeyToChange(key)
                        // setValueToChange(modalData[key])
                      }
                      // handleChangeModalText
                    }
                  />
                </FormControl>
              )
            }
          })}
        </Modal.Body>
        <Modal.Footer>
          <Button.Group space={2}>
            <Button
              variant='ghost'
              colorScheme='blueGray'
              onPress={() => {
                console.log('🚀 ~ modalDataTemp', modalDataTemp)
              }}
            >
              Log
            </Button>
            <Button
              variant='ghost'
              colorScheme='blueGray'
              onPress={() => {
                setShowTableModal(false)
                setModalDataTemp(modalInitialData)
              }}
            >
              Cancel
            </Button>
            <Button
              bg='primary'
              onPress={() => {
                setShowTableModal(false)
                handleEditForkLengthCount()
              }}
            >
              Save
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  )
}

export default BatchCountTableModal
