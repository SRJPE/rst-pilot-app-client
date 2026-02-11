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
  const cacheDirectory = (FileSystem as any).cacheDirectory

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

  const moveFileToCustomLocation = async ({
    uri,
    name,
  }: {
    uri: string
    name: string
  }) => {
    const newPath = `${cacheDirectory}DocumentPicker/${documentType}/${name}`

    try {
      await FileSystem.moveAsync({ from: uri, to: newPath })
      console.log('🚀 ~ file: useCacheDirectory.ts:61 File moved to:', newPath)
    } catch (error) {
      console.log(
        '🚀 ~ file: useCacheDirectory.ts:64 ~ moveFileToCustomLocation ~ error:',
        error
      )
      // If move fails, return the original uri so caller still has a usable path
      return uri
    }

    return newPath
  }

  const handleFileSelection = async ({ files }: { files: FileDetails[] }) => {
    const movedFiles: FileDetails[] = []
    for (const file of files) {
      try {
        const newUriPath = await moveFileToCustomLocation({
          name: file.name,
          uri: file.uri,
        })
        movedFiles.push({ ...file, uri: newUriPath })
      } catch (err) {
        console.error('Error moving selected file:', err)
        movedFiles.push(file)
      }
    }

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
      for (const fileName of fileNames) {
        try {
          const fileInfo = (await FileSystem.getInfoAsync(
            `${cacheDirectory}/DocumentPicker/${documentType}/${fileName}`
          )) as any

          const fileDetails = {
            mimeType: fileInfo.mimeType || '',
            name: fileName,
            size: fileInfo.size || 0,
            uri: `${cacheDirectory}DocumentPicker/${documentType}/${fileName}`,
          }

          setFiles(prevFiles => [...prevFiles, fileDetails])
        } catch (err) {
          console.error('Error getting info for cached file:', fileName, err)
        }
      }
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
  const cacheDirectoryUri = `${(FileSystem as any).cacheDirectory}DocumentPicker`

  let cachedDirectories: string[] = []
  try {
    cachedDirectories = await FileSystem.readDirectoryAsync(cacheDirectoryUri)
  } catch (error) {
    console.error('Error reading cache directory root:', error)
    return
  }

  const accessToken = await SecureStore.getItemAsync('userAccessToken')

  const serverEndpoint = process.env.EXPO_PUBLIC_BASE_URL || ''
  if (!serverEndpoint) {
    console.log('No server endpoint configured; skipping cached file uploads')
    return
  }

  for (const directory of cachedDirectories) {
    const directoryUri = `${cacheDirectoryUri}/${directory}`
    let fileNames: string[] = []
    try {
      fileNames = await FileSystem.readDirectoryAsync(directoryUri)
    } catch (error) {
      console.error(`Error reading directory ${directoryUri}:`, error)
      continue
    }

    for (const fileName of fileNames) {
      try {
        const filePath = `${directoryUri}/${fileName}`
        const fileUploadResponse = await FileSystem.uploadAsync(
          `${serverEndpoint}/program/files`,
          filePath,
          {
            headers: { authorization: `Bearer ${accessToken}` },
            fieldName: 'file',
            httpMethod: 'POST',
            uploadType: (FileSystem as any).FileSystemUploadType.MULTIPART,
          }
        )

        if (fileUploadResponse.status !== 200) {
          console.error('File upload failed for', filePath)
          continue
        }

        const fileUploadResponseBody: FileUploadResponseBody = JSON.parse(
          fileUploadResponse.body
        )

        // make api patch request to link file to program submission
        switch (directory) {
          case 'efficiencyTrialProtocols':
            await api.put(`program/${createdProgramId}`, {
              efficiencyProtocolsDocumentLink: fileUploadResponseBody.etag,
            })
            break
          case 'rotaryScrewTrapProtocols':
            await api.put(`program/${createdProgramId}`, {
              trappingProtocolsDocumentLink: fileUploadResponseBody.etag,
            })
            break
          case 'permitInformation':
            await api.put(`permit-info/${createdPermitInformationId}`, {
              permitFileLink: fileUploadResponseBody.etag,
            })
            break
          case 'hatcheryInformation':
            await api.put(`hatchery-info/${createdHatcheryInfoId}`, {
              hatcheryFileLink: fileUploadResponseBody.etag,
            })
            break
          default:
            break
        }

        try {
          await FileSystem.deleteAsync(`${directoryUri}/${fileName}`)
        } catch (err) {
          console.error('Failed to delete cached file after upload:', err)
        }
      } catch (error) {
        console.error('Error posting file:', error)
        // Continue with next file
      }
    }
  }
}

export default useCacheDirectory
