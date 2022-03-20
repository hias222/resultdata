module.exports = function loggerMiddleware(request, response, next) {
    console.log('/' + request.method + ' ' + request.baseUrl + request.path);
    next();
  }