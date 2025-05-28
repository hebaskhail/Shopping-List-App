const { checkSchema } = require('express-validator');

const loginSchema = checkSchema({
  email: {
    in: ['body'],
    isEmail: {
      errorMessage: 'Invalid email'
    }
  },
  password: {
    in: ['body'],
    isLength: {
      options: { min: 6 },
      errorMessage: 'Password must be at least 6 characters'
    }
  }
});

module.exports = loginSchema;
