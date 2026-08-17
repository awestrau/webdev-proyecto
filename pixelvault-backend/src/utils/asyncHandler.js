function asyncHandler(controller) {
  return function handleAsyncController(request, response, next) {
    return Promise.resolve(controller(request, response, next)).catch(next)
  }
}

module.exports = asyncHandler
