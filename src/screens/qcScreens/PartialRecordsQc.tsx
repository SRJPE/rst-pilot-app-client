import { MaterialIcons } from '@expo/vector-icons'
import {
  Button,
  HStack,
  View,
  VStack,
  Text,
  Pressable,
  Icon,
} from 'native-base'
import { DataTable } from 'react-native-paper'
import CustomModalHeader from '../../components/Shared/CustomModalHeader'

export default function PartialRecordsQC({ navigation }: { navigation: any }) {
  const AddCommentButton = ({name}: {name: string}) => {
    return (
      <Pressable alignSelf='flex-end' onPress={() => {
        console.log(`add comment for ${name} pressed`)
      }}>
        <Icon
          as={MaterialIcons}
          name={'add-circle'}
          size='8'
          color='primary'
        />
      </Pressable>
    )
  }

  return (
    <>
      <View
        flex={1}
        bg='#fff'
        px='5%'
        py='3%'
        borderColor='themeGrey'
        borderWidth='15'
      >
        <VStack alignItems={'center'} flex={1}>
          <CustomModalHeader
            headerText={'QC Partial Records'}
            showHeaderButton={false}
            closeModal={() => navigation.goBack()}
          />
          <Text fontSize={'2xl'} fontWeight={300} mb={25} textAlign='center'>
            The chart below shows the % not recorded for each variable. To edit
            or add a comment click on a variable.
          </Text>

          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Variable</DataTable.Title>
              <DataTable.Title numeric>Percent Not Recorded</DataTable.Title>
              <DataTable.Title numeric>Comments</DataTable.Title>
            </DataTable.Header>

            <DataTable.Row>
              <DataTable.Cell>Fork Length</DataTable.Cell>
              <DataTable.Cell numeric>0%</DataTable.Cell>
              <DataTable.Cell numeric>
                <AddCommentButton name={'Fork Length'}/>
              </DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row>
              <DataTable.Cell>Weight</DataTable.Cell>
              <DataTable.Cell numeric>100%</DataTable.Cell>
              <DataTable.Cell numeric>
                <AddCommentButton name='Weight'/>
              </DataTable.Cell>
            </DataTable.Row>
          </DataTable>

          <View flex={1}></View>

          <HStack width={'full'} justifyContent={'space-between'}>
            <Button
              marginBottom={5}
              width='49%'
              height='20'
              shadow='5'
              bg='secondary'
              onPress={() => {
                navigation.goBack()
              }}
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
              onPress={() => {
                console.log('approve')
              }}
            >
              <Text fontSize='xl' color='white' fontWeight={'bold'}>
                Approve
              </Text>
            </Button>
          </HStack>
        </VStack>
      </View>
    </>
  )
}
