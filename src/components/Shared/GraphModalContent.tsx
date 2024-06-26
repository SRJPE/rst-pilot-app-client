import {
  View,
  Text,
  Button,
  Divider,
  Input,
  HStack,
  VStack,
  FormControl,
} from 'native-base'
import { useEffect, useState, FC } from 'react'
import { DataTable } from 'react-native-paper'
import { connect, useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '../../redux/store'
import CustomModalHeader from '../Shared/CustomModalHeader'

const GraphModalContent = ({
  closeModal,
  onSubmit,
  modalData,
  headerText,
  pointClicked,
  children,
  showHeaderButton,
  dataFormatter,
}: {
  closeModal: any
  onSubmit: any
  modalData: any
  headerText: string
  pointClicked: any
  children?: JSX.Element
  showHeaderButton?: boolean
  dataFormatter?: (header: string, dataAtId: any) => any
}) => {
  const [payload, setPayload] = useState<any>({})

  const handleSubmit = () => {
    onSubmit(payload)
    closeModal()
  }

  const handleChange = (header: string, value: string) => {
    if (Number(value)) {
      setPayload({
        ...payload,
        [header]: { ...payload[header], y: Number(value) },
      })
    } else if (value === '') {
      setPayload({
        ...payload,
        [header]: { ...payload[header], y: 0 },
      })
    }
  }

  useEffect(() => {
    let modalDataAtPointClicked: any = {}
    Object.keys(modalData).forEach((header) => {
      let dataAtId = modalData[header].filter((obj: any) => {
        return obj.id == pointClicked.id
      })[0]
      if (dataAtId) {
        modalDataAtPointClicked[header] = dataFormatter
          ? { ...dataAtId, y: dataFormatter(header, dataAtId) }
          : dataAtId
      } else {
        modalDataAtPointClicked[header] = { y: 'NA' }
      }
    })
    setPayload(modalDataAtPointClicked)
  }, [modalData, pointClicked])

  return (
    <VStack flex={1}>
      <CustomModalHeader
        headerText={headerText}
        headerFontSize={23}
        showHeaderButton={showHeaderButton ? showHeaderButton : false}
        closeModal={closeModal}
        headerButton={
          <Button
            bg='primary'
            mx='2'
            px='10'
            shadow='3'
            onPress={() => {
              handleSubmit()
              closeModal()
            }}
          >
            <Text fontSize='xl' color='white'>
              Save
            </Text>
          </Button>
        }
      />
      <VStack justifyContent={'space-between'} h={'85%'}>
        {children ? (
          children
        ) : (
          <DataTable>
            <DataTable.Header style={[{ paddingLeft: 0 }]}>
              {Object.keys(modalData).map((header: string, idx: number) => (
                <DataTable.Title
                  key={idx}
                  numeric
                  style={[{ justifyContent: 'space-evenly', flexWrap: 'wrap' }]}
                >
                  {header}
                </DataTable.Title>
              ))}
            </DataTable.Header>

            <DataTable.Row style={[{ height: 55 }]}>
              <HStack justifyContent={'space-evenly'} w='100%'>
                {Object.keys(modalData).map((header: any, idx: number) => {
                  return (
                    <View
                      key={`${header}-${idx}`}
                      style={[
                        {
                          justifyContent: 'center',
                          marginTop: 10,
                          marginBottom: 10,
                        },
                      ]}
                    >
                      <Input
                        height='50px'
                        width='100px'
                        textAlign={'center'}
                        fontSize='16'
                        keyboardType='numeric'
                        onChangeText={(value) => {
                          if (value != payload[header].y) {
                            handleChange(header, value)
                          }
                        }}
                        onBlur={() => {}}
                        value={payload[header] ? `${payload[header].y}` : 'NA'}
                      />
                    </View>
                  )
                })}
              </HStack>
            </DataTable.Row>
          </DataTable>
        )}

        <HStack width={'full'} justifyContent={'space-between'}>
          <Button
            marginBottom={5}
            width='49%'
            height='20'
            shadow='5'
            bg='secondary'
            onPress={() => closeModal()}
          >
            <Text fontSize='xl' color='primary' fontWeight={'bold'}>
              Back
            </Text>
          </Button>
          <Button
            marginBottom={5}
            width='49%'
            height='20'
            shadow='5'
            bg='primary'
            onPress={() => handleSubmit()}
          >
            <Text fontSize='xl' color='white' fontWeight={'bold'}>
              Approve
            </Text>
          </Button>
        </HStack>
      </VStack>
    </VStack>
  )
}

export default GraphModalContent
