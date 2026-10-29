export function getHttpErrorMessage(status: number): string {
  switch (status) {
    case 400:
      return 'Invalid request. Please check your input.'

    case 401:
      return 'Please log in to continue.'

    case 403:
      return "You don't have permission to perform this action."

    case 404:
      return 'The requested resource could not be found.'

    case 409:
      return 'This request conflicts with existing data.'

    case 500:
      return 'Something went wrong on our server. Please try again later.'

    case 503:
      return 'The service is temporarily unavailable. Please try again later.'

    default:
      if (status > 500) {
        return 'A server error occurred. Please try again later.'
      }

      if (status > 400) {
        return 'The request failed. Please try again.'
      }

      return 'Something went wrong. Please try again.'
  }
}