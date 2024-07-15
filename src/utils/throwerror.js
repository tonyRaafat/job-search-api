export function throwError(errorMessage, statusCode = 500) {
    let error = new Error(errorMessage)
    error.statusCode = statusCode
    return error
}