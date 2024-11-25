export const generateErrorMessage = (errorCode: string) => {
  let errorMessage
  switch (errorCode) {
    case 'Network Error':
    case 'ERR_NETWORK':
      errorMessage =
        'A network error occurred, unable to reach server. Please try again.'
      break
    case 'ECONNABORTED':
      errorMessage =
        'The server took too long to respond. Your request could not be completed at this time.'
      break
    case 'ERR_BAD_REQUEST':
      errorMessage = 'Request failed with status code 400 (Bad Request)'

    default:
      return errorCode
    // errorMessage = 'An unknown error occurred. Please try again.'
  }
  return errorMessage
}
