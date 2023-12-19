const { validator } = require('cpf-cnpj-validator');
const joi = require("joi").extend(validator);

const schemaClient = joi.object({
    name: joi.string().required().min(3).id().max(100).messages({
        "any.required": "The name field is required.",
        "string.empty": "The name field can not be empty.",
        "id.empty": "ID is required.",
        "string.min": "The name field must contain at least 3 characters.",
        "string.max": "The name field must contain a maximum of 100 characters.",
    }),

    email: joi.string().email().required().messages({
        'any.required': 'The email field is required.',
        'string.empty': 'The email field can not be empty.',
        'string.email': 'Please enter a valid email address.',
    }),


    phone_number: joi.string().required().regex(/^\d+$/).messages({
        'any.required': 'The phone_number field is required.',
        'string.empty': 'The phone_number field can not be empty.',
        'string.pattern.base': 'The phone_number field must contain only numbers.',
    }),

    zip_code: joi.string().regex(/^\d{8}$/).messages({
        'string.pattern.base': 'The cep field must contain exactly 8 numeric digits.',
    }),

    address: joi.string().min(3).max(100).messages({
        "string.min": "The address field must contain at least 3 characters.",
        "string.max": "The address field must contain a maximum of 100 characters.",
    }),

    address2: joi.string().max(100).messages({
        "string.min": "The address2 field must contain at least 3 characters.",
        "string.max": "The address2 field must contain a maximum of 100 characters.",
    }),

    district: joi.string().min(3).max(50).messages({
        "string.min": "The district field must contain at least 3 characters.",
        "string.max": "The district field must contain a maximum of 50 characters.",
    }),

    state: joi.string().min(2).max(30).messages({
        "string.min": "The state field must contain at least 2 characters.",
        "string.max": "The state field must contain a maximum of 30 characters.",
    }),

    city: joi.string().min(2).max(30).messages({
        "string.min": "The city field must contain at least 2 characters.",
        "string.max": "The city field must contain a maximum of 30 characters.",
    }),

    cpf: joi.document().cpf().required().messages({
        'any.required': 'The cpf field is required.',
        'string.empty': 'The cpf field can not be empty.',
        'document.cpf': 'invalid CPF.'
    }),

    status: joi.number().valid(0, 1).messages({
        "number.base": "The status field must be a number.",
        "number.only": "The status field must be either 0 or 1",
    }),
});

module.exports = schemaClient;
