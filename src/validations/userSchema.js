const { default: validator } = require('cpf-cnpj-validator');
const joi = require('joi').extend(validator);

const schemaUpdate = joi.object({
    name: joi.string().required().min(3).max(100).messages({
        "any.required": "The name field is required.",
        "string.empty": "The name field can not be empty.",
        "string.min": "The name field must contain at least 3 characters.",
        "string.max": "The name field must contain a maximum of 100 characters.",
    }),

    email: joi.string().email().required().messages({
        'any.required': 'The email field is required.',
        'string.empty': 'The email field cannot be empty.',
        'string.email': 'Please enter a valid email address.',
    }),

    password: joi.string().min(6).pattern(/^(?=.*[a-zA-Z])(?=.*[0-9])/).messages({
        'string.empty': 'The password field cannot be empty.',
        'string.min': 'The password must be at least 6 characters.',
        'string.pattern.base': 'The password must contain at least one letter and one number.',
    }),

    cpf: joi.document().cpf('invalid cpf.').messages({
        'document.cpf': 'invalid CPF.',
    }),
        

    phone_number: joi.string().regex(/^\d+$/).messages({
        'any.required': 'The phone_number field is required.',
        'string.empty': 'The phone_number field can not be empty.',
        'string.pattern.base': 'The phone_number field must contain only numbers.',
    }),
});

const schemaRegister = joi.object({
    name: joi.string().required().min(3).max(100).messages({
        "any.required": "The name field is required.",
        "string.empty": "The name field can not be empty.",
        "string.min": "The name field must contain at least 3 characters.",
        "string.max": "The name field must contain a maximum of 100 characters.",
    }),

    email: joi.string().email().required().messages({
        'any.required': 'The email field is required.',
        'string.empty': 'The email field cannot be empty.',
        'string.email': 'Please enter a valid email address.',
    }),

    password: joi.string().min(6).required().pattern(/^(?=.*[a-zA-Z])(?=.*[0-9])/).messages({
        'any.required': 'The password field is required.',
        'string.empty': 'The password field cannot be empty.',
        'string.min': 'The password must be at least 6 characters long.',
        'string.pattern.base': 'The password must contain at least one letter and one number.',
    }),
});

module.exports = {schemaRegister, schemaUpdate};