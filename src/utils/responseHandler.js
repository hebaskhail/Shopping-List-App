class ResponseHandler {
    /**
     * Send a standardized success response.
     * @param {object} res        Express response object
     * @param {string} message    Success message
     * @param {object} data       Payload data
     * @param {number} statusCode HTTP status code (default 200)
     */
    static success(res, message = 'Success', data, statusCode = 200) {
      res.status(statusCode).json({ 
        success: true, 
        statusCode, 
        message, 
        data 
      });
    }
  
    /**
     * Send a standardized error response.
     * @param {object} res        Express response object
     * @param {string} message    Error message
     * @param {number} statusCode HTTP status code (default 500)
     * @param {object|null} data  Optional error data (default null)
     */
    static error(res, message, statusCode = 500, data = null) {
      res.status(statusCode).json({ 
        success: false, 
        statusCode, 
        message, 
        data 
      });
    }
  }
  
  module.exports = ResponseHandler;
  