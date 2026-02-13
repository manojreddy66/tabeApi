/**
 * This file contains input request validation
 */
const { getValidationSchema } = require("/customDependencies/nodejs/schemaValidator/supplyPlanning/scenarios/scenariosTableSchema");

/**
 * @description Function to validate input request
 * @param {Object} params: { type, page, limit }
 * @returns {Object} errorMessages: List of validation error messages
 */
async function validateInput(params) {
  const errorMessages = [];

  await validateParams(params, errorMessages);

  return {
    errorMessages: [...new Set(errorMessages)]
  };
}

/**
 * @description Joi validation (abortEarly false for multiple errors)
 */
async function validateParams(params, errorMessages) {
  const options = { abortEarly: false };
  const schema = await getValidationSchema();
  const { error } = await schema.validate(params, options);

  if (error) {
    error.details.forEach((detail) => errorMessages.push(detail.message));
  }
}
module.exports = { validateInput };
