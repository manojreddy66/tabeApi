/**
 * @description This file contains routing to input validation, DB operations and prepare response
 */
const { BadRequest } = require("utils/api_response_utils");
const { validateInput } = require("./validateRequest");

const { getAllTabScenariosData } = require("./allTab");
const { getGetsudoTabScenariosData } = require("./getSudoTab");

const { prepareResponse } = require("./utils");

/**
 * @description Function to validate & return scenario table data.
 * @param {Object} event: API request
 * @returns {Object} response - scenarios table response
 */
async function getScenariosTable(event) {
  try {
    const type = event?.pathParameters?.type;
    const queryParams = event?.queryStringParameters || {};

    /**
     * @description a function to extract path and query parameters
     * @returns {Object} params: type,page,limit
     */
    const params = {
      type,
      page:
        queryParams.page !== undefined ? Number(queryParams.page) : queryParams.page,
      limit:
        queryParams.limit !== undefined ? Number(queryParams.limit) : queryParams.limit,
    };

    /**
     * @description validate input params (type/page/limit)
     * @param { Object } params - the input parameters to vlidate
     * @returns {Promise<Array<string>>} Array of error messages (empty if valid)
     */
    const { errorMessages } = await validateInput(params);

    if (errorMessages.length > 0) {
      throw new BadRequest(errorMessages);
    }

    /**
     * @description route to tab logic based on type
     * Each tab handler returns: { totalRecords, rows }
     */
    const { totalRecords, rows } = await getScenariosTableDataByType(
      params
    );

    /**
     * @description prepare final UI response
     */
    return prepareResponse(params, totalRecords, rows);
  } catch (err) {
    console.log("Error in getScenariosTable:", err);
    throw err;
  }
}

/**
 * @description Function to fetch scenarios data by type provided in path param
 * @param {{type:string,page:number,limit:number}} params: type, page, limit
 * @returns {Promise<{totalRecords: number, roes: any[]}>}
 */
async function getScenariosTableDataByType(params) {
  const { type } = params;

  if (type === "all") {
    return  getAllTabScenariosData(params);
  }
   else {
    return  getGetsudoTabScenariosData(params);
   }
}

module.exports = { getScenariosTable };