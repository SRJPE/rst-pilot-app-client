import {
  Text,
  View,
  Box,
  Button as NativeButton,
  IButtonProps,
  IBoxProps,
} from 'native-base'
import { MaterialIcons } from '@expo/vector-icons'
import PermitInfoDataTable from '../components/permitInfo/PermitInfoDataTable'
import useSavePdf from '../components/permitInfo/useSavePdf'
import { SAMPLE_PERMITS, Permit } from '../components/permitInfo/samplePermits'

export default function PermitInfo({ navigation }: { navigation: any }) {
  const { scpContent, _4DContent, createAndSavePDF } = useSavePdf()
  return (
    <View flex={1} padding={50}>
      <SectionHeader title='4D Permit' />
      <PermitInfoDataTable
        header='Permitted expected take and indirect morality for RST'
        permits={SAMPLE_PERMITS.remaining}
      />
      <PermitInfoDataTable
        header='Remaining expected take and mortalities'
        permits={SAMPLE_PERMITS.remaining}
      />

      <Box>
        <Text fontSize='xl'>4D Trap will be stopped when:</Text>
        <Text fontSize='lg'>Flow exceeds: {'1,000 cfs'} </Text>
        <Text fontSize='lg'>Time exceeds: {'30c'} </Text>
      </Box>

      <SectionHeader
        title='Scientific Collection Permit (SCP)'
        boxProps={{ mt: 5 }}
      />

      <Box alignItems='flex-start' mt={5}>
        <Button onPress={async () => await createAndSavePDF(_4DContent)}>
          View 4d PDF
        </Button>
        <Button onPress={async () => await createAndSavePDF(scpContent)}>
          View SCP PDF
        </Button>
      </Box>
    </View>
  )
}

function Button({ children, ...props }: IButtonProps) {
  return (
    <NativeButton
      bgColor='transparent'
      leftIcon={
        <MaterialIcons name='picture-as-pdf' size={32} color='#026D63' />
      }
      _text={{ color: 'black', fontSize: 'lg' }}
      {...props}
    >
      {children}
    </NativeButton>
  )
}

function SectionHeader({
  title,
  subheader,
  boxProps,
}: {
  title: string
  subheader?: string
  boxProps?: IBoxProps
}) {
  return (
    <Box {...boxProps}>
      <Text fontSize='2xl' bold>
        {title}
      </Text>
      {subheader && <Text fontSize='xl'>{subheader}</Text>}
    </Box>
  )
}
