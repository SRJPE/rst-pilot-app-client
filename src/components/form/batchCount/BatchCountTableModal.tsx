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
import { connect, useDispatch } from 'react-redux'
import { updateSingleForkLengthCount } from '../../../redux/reducers/formSlices/fishInputSlice'
import { TabStateI } from '../../../redux/reducers/formSlices/tabSlice'
import { AppDispatch, RootState } from '../../../redux/store'

const BatchCountTableModal = ({
  showTableModal,
  setShowTableModal,
  modalInitialData,
  tabSlice,
}: {
  showTableModal: any
  setShowTableModal: any
  modalInitialData: any
  tabSlice: TabStateI
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const [modalDataTemp, setModalDataTemp] = useState({} as any)
  const [currentCount, setCurrentCount] = useState(0 as any)

  useEffect(() => {
    setModalDataTemp(modalInitialData)
  }, [modalInitialData])

  useEffect(() => {
    Object.values(modalDataTemp).length >= 3 &&
      setCurrentCount(
        Object.values(modalDataTemp) &&
          (Object.values(modalDataTemp)
            .slice(2)
            .reduce((a: any, b: any) => Number(a) + Number(b)) as any)
      )
  }, [modalDataTemp])

  const handleEditForkLengthCountSave = () => {
    const activeTabId = tabSlice.activeTabId
    if (activeTabId) {
      const tabGroupId = tabSlice.tabs[activeTabId].groupId
      dispatch(
        updateSingleForkLengthCount({
          tabGroupId,
          ...modalDataTemp,
          count: currentCount,
        })
      )
    }
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
          {Object.keys(modalInitialData).map((key: string) => {
            if (key !== 'forkLength' && key !== 'count') {
              return (
                <FormControl mt='3' key={key}>
                  <FormControl.Label>
                    <Text color='black' fontSize='xl'>
                      {key === 'not recorded' ? 'Count' : key}
                    </Text>
                  </FormControl.Label>
                  <Input
                    size='2xl'
                    value={modalDataTemp[key]}
                    isFocused
                    keyboardType='numeric'
                    onChangeText={(value: any) => {
                      setModalDataTemp({
                        ...modalDataTemp,
                        [key]: value,
                      })
                    }}
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
                setModalDataTemp(modalInitialData)
                setShowTableModal(false)
              }}
            >
              Cancel
            </Button>
            <Button
              bg='primary'
              onPress={() => {
                handleEditForkLengthCountSave()
                setShowTableModal(false)
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

const mapStateToProps = (state: RootState) => {
  return {
    tabSlice: state.tabSlice,
  }
}
export default connect(mapStateToProps)(BatchCountTableModal)
