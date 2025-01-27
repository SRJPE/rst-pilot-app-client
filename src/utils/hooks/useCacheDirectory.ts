import * as DocumentPicker from 'expo-document-picker'
import * as FileSystem from 'expo-file-system'
import * as SecureStore from 'expo-secure-store'
import { useEffect, useState } from 'react'
import api from '../../api/axiosConfig'
export interface FileDetails {
  mimeType: string
  name: string
  size: number
  uri: string
}

interface FileUploadResponseBody {
  clientRequestId: string
  contentMD5: {
    data: number[]
    type: string
  }
  date: string
  etag: string
  isServerEncrypted: boolean
  lastModified: string
  requestId: string
  version: string
}

const useCacheDirectory = (documentType: string) => {
  const [files, setFiles] = useState<FileDetails[]>([])
  const [activeFilePreview, setActiveFilePreview] =
    useState<FileDetails | null>(null)
  const cacheDirectory = FileSystem.cacheDirectory

  const handleFileRemoval = async (selectedFile: FileDetails) => {
    try {
      await FileSystem.deleteAsync(selectedFile.uri)
      setFiles(files.filter(file => file.uri !== selectedFile.uri))
    } catch (error) {
      console.error('Error deleting file:', error)
    }
  }

  const handleOpenPdfPreview = async (selectedFile: FileDetails) => {
    setActiveFilePreview(selectedFile)
  }

  const handleClosePdfPreview = () => {
    setActiveFilePreview(null)
  }

  const moveFileToCustomLocation = ({
    uri,
    name,
  }: {
    uri: string
    name: string
  }) => {
    const newPath = `${cacheDirectory}DocumentPicker/${documentType}/${name}`

    FileSystem.moveAsync({
      from: uri,
      to: newPath,
    })
      .then(() => {
        console.log(
          '🚀 ~ file: useCacheDirectory.ts:61 File moved to:',
          newPath
        )
      })
      .catch(error => {
        console.log(
          '🚀 ~ file: useCacheDirectory.ts:64 ~ moveFileToCustomLocation ~ error:',
          error
        )
      })

    return newPath
  }

  const handleFileSelection = async ({ files }: { files: FileDetails[] }) => {
    const movedFiles = files.map(file => {
      const newUriPath = moveFileToCustomLocation({
        name: file.name,
        uri: file.uri,
      })
      return { ...file, uri: newUriPath }
    })

    setFiles(movedFiles)
  }

  const openDocumentPicker = () => {
    DocumentPicker.getDocumentAsync().then(res => {
      if (!res.canceled) {
        const files = res.assets as FileDetails[]

        handleFileSelection({
          files,
        })
      }
    })
  }

  const readCacheDirectory = async () => {
    try {
      const fileNames = await FileSystem.readDirectoryAsync(
        `${cacheDirectory}/DocumentPicker/${documentType}`
      )
      fileNames.forEach(async (fileName: string) => {
        const fileInfo = (await FileSystem.getInfoAsync(
          `${cacheDirectory}/DocumentPicker/${documentType}/${fileName}`
        )) as FileSystem.FileInfo & { mimeType: string; size: number }

        const fileDetails = {
          mimeType: fileInfo.mimeType || '',
          name: fileName,
          size: fileInfo.size,
          uri: `${cacheDirectory}DocumentPicker/${documentType}/${fileName}`,
        }

        setFiles(prevFiles => [...prevFiles, fileDetails])
      })
    } catch (error) {
      console.error('Error reading cache directory:', error)
    }
  }

  const clearCacheDirectory = async (directoryName: string) => {
    try {
      await FileSystem.deleteAsync(
        `${cacheDirectory}/DocumentPicker/${directoryName}`,
        { idempotent: true }
      )
      setFiles([])

      console.log(
        `🚀 ~ file: useCacheDirectory.ts:124 ~ All files from ${directoryName} cache deleted`
      )
    } catch (error) {
      console.error('Error clearing cache directory:', error)
    }
  }

  useEffect(() => {
    ;(async () => {
      //Uncomment to clear cache directory on step change
      // clearCacheDirectory(documentType)

      try {
        await FileSystem.makeDirectoryAsync(
          `${cacheDirectory}/DocumentPicker/${documentType}`,
          { intermediates: true }
        )
      } catch (error) {
        console.error('Directory not created:', error)
      }
    })()

    readCacheDirectory()
  }, [cacheDirectory])

  return {
    files,
    activeFilePreview,
    handleFileRemoval,
    handleFileSelection,
    handleClosePdfPreview,
    handleOpenPdfPreview,
    clearCacheDirectory,
    openDocumentPicker,
  }
}

export const postMonitoringProgramFilesToDB = async ({
  createdProgramId,
  createdHatcheryInfoId,
  createdPermitInformationId,
}: {
  createdProgramId?: number
  createdHatcheryInfoId?: number
  createdPermitInformationId?: number
}) => {
  const cacheDirectoryUri = `${FileSystem.cacheDirectory}DocumentPicker`

  const cachedDirectories = await FileSystem.readDirectoryAsync(
    cacheDirectoryUri
  )

  const accessToken = await SecureStore.getItemAsync('userAccessToken')

  cachedDirectories.forEach(async (directory: string) => {
    const serverEndpoint = process.env.EXPO_PUBLIC_BASE_URL || '#'
    const directoryUri = `${cacheDirectoryUri}/${directory}`
    const fileNames = await FileSystem.readDirectoryAsync(directoryUri)

    try {
      fileNames.forEach(async (fileName: string, idx) => {
        const fileUploadResponse = await FileSystem.uploadAsync(
          `${serverEndpoint}/program/files`,
          `${directoryUri}/${fileName}`,
          {
            headers: { authorization: `Bearer ${accessToken}` },
            fieldName: 'file',
            httpMethod: 'POST',
            uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          }
        )

        if (fileUploadResponse.status !== 200) {
          throw new Error('File upload failed')
        }

        const fileUploadResponseBody: FileUploadResponseBody = JSON.parse(
          fileUploadResponse.body
        )

        // make api patch request to link file to program submission
        switch (directory) {
          case 'efficiencyTrialProtocols':
            const etpResponse = await api.put(`program/${createdProgramId}`, {
              efficiencyProtocolsDocumentLink: fileUploadResponseBody.etag,
            })

            break
          case 'rotaryScrewTrapProtocols':
            const rstResponse = await api.put(`program/${createdProgramId}`, {
              trappingProtocolsDocumentLink: fileUploadResponseBody.etag,
            })

            break
          case 'permitInformation':
            const piResponse = await api.put(
              `permit-info/${createdPermitInformationId}`,
              {
                permitFileLink: fileUploadResponseBody.etag,
              }
            )
            break
          case 'hatcheryInformation':
            const hiResponse = await api.put(
              `hatchery-info/${createdHatcheryInfoId}`,
              {
                hatcheryFileLink: fileUploadResponseBody.etag,
              }
            )

            break
          default:
            break
        }

        FileSystem.deleteAsync(`${directoryUri}/${fileName}`)
      })
    } catch (error) {
      console.error('Error posting file:', error)
    }
  })
}

export default useCacheDirectory
