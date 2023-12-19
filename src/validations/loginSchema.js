const joi = require('joi');

const schemaLogin = joi.object({
    email: joi.string().email().required().messages({
        'any.required': 'The email field is required.',
        'string.empty': 'The email field cannot be empty.',
        'string.email': 'Please enter a valid email address.',
    }),

    password: joi.string().required().messages({
        'any.required': 'The password field is required.',
        'string.empty': 'The password field cannot be empty.', 
    }),
});

module.exports = schemaLogin;