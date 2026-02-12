const Joi = require("joi");

/**
 * @description Validation schema for scenarios table API.
 */
const getValidationSchema = async () => {
  const schema = Joi.object({
    type: Joi.string()
      .valid("all", "getsudo")
      .required()
      .messages({
        "any.required":
          "ValidationError: The path parameter must include only one of the following options: all or getsudo.",
        "any.only":
          "ValidationError: The path parameter must include only one of the following options: all or getsudo.",
        "string.base":
          "ValidationError: The path parameter must include only one of the following options: all or getsudo.",
        "string.empty":
          "ValidationError: The path parameter must include only one of the following options: all or getsudo.",
      }),

    page: Joi.number().required().messages({
      "any.required": "ValidationError: page is required and must be number.",
      "number.base": "ValidationError: page is required and must be number.",
    }),

    limit: Joi.number().required().messages({
      "any.required": "ValidationError: limit is required and must be number.",
      "number.base": "ValidationError: limit is required and must be number.",
    }),
  });

  return schema;
};

module.exports = {
  getValidationSchema,
};
