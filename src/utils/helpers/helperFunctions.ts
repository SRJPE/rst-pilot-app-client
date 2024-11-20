export const generateErrorMessage = (errorCode: string) => {
  let errorMessage
  switch (errorCode) {
    case 'Network Error':
      errorMessage =
        'A network error occurred, unable to reach server. Please try again.'
      break
    case 'ECONNABORTED':
      errorMessage =
        'The server took too long to respond. Your request could not be completed at this time.'
      break
    default:
      errorMessage = 'An error occurred while updating the user'
  }
  return errorMessage
}
