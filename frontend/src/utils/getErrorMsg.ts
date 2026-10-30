export function getHttpErrorMessage(status: number): string {
  switch (status) {
    case 400:
      return 'Invalid request. Please check your input.'

    case 401:
      return 'Invalid username or password.'

    case 403:
      return "You don't have permission to perform this action."

    case 404:
      return 'The requested resource could not be found.'

    case 409:
      return 'This request conflicts with existing data.'

    case 422:
      return 'Some of the provided information is invalid.'

    case 429:
      return 'Too many requests. Please wait a moment and try again.'

    case 500:
      return 'Something went wrong on our server. Please try again later.'

    case 502:
    case 503:
    case 504:
      return 'The service is temporarily unavailable. Please try again later.'

    default:
      if (status >= 500) {
        return 'A server error occurred. Please try again later.'
      }

      if (status >= 400) {
        return 'The request failed. Please try again.'
      }

      return 'Something went wrong. Please try again.'
  }
}