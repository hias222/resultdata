module.exports = function loggerMiddleware(request, response, next) {
    console.log('<loggerMiddleware> /' + request.method + ' ' + request.baseUrl + request.path);
    next();
  }