const joi = require('joi');

const schemaCharges = joi.object({
    description: joi.string().required().messages({
      "any.required": "The description field is required.",
      "string.empty": "The description field can not be empty.",
    }),
    due_date: joi.date().required().messages({
      "any.required": "The due_date field is required.",
      "string.empty": "The due_date field can not be empty.",
      "date.base": "Invalid  format.",
    }),
    value: joi.number().required().messages({
      "any.required": "The value field is required.",
      "string.empty": "The value field can not be empty.",
      "number.base": "Invalid format.",
    }),
    status: joi.number().valid(0, 1).required().messages({
      "any.required": "The status field is required.",
      "string.empty": "The status field can not be empty.",
      "number.base": "Invalid format.",
      "number.only": "The status field must be either 0 or 1.",
    }),
  });


module.exports = schemaCharges