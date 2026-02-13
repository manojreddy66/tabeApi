/**
 * @name sp-scenarios-table-v1
 * @description Returns scenario table data for Supply Planning landing page (All / Getsudo).
 * @createdOn Feb, 2026
 * @author
 * @modifiedBy
 * @modifiedOn
 * @modificationSummary
 */

const {
  sendResponse,
  BadRequest,
  HTTP_RESPONSE_CODES,
} = require("utils/api_response_utils");

const { getScenariosTable } = require("./scenariosTableService");
const { API_ERROR_MESSAGE } = require("constants/customConstants");

/**
 * @description Lambda handler for scenarios table.
 * @param {Object} event: API event with:
 *  - pathParameters: { type: "all" | "getsudo" }
 *  - queryStringParameters: { page: number, limit: number }
 *
 * Response object sample for success response with status code 200.
 * {
  "currentPage": 1,
  "recordsPerPage": 40,
  "totalRecords": 100,
  "totalPage": 3,
  "data": [
    {
      "scenario": "Getsudo/TMMI/Line1_Cycle_V1",
      "scenarioId":"uniqueuuid",
      "plan": "Getsudo",
      "namc": "TMMI",
      "Line": "Line1",
      "cycle": "Jan25",

      "createdBy": "Priyadarshini Gangone",
      "lastUpdated": "12/24/2025",
      "status": "Not Started"
    }
    {
      "scenario": "AP/TMMI/Line1_Cycle_V1",
      "scenarioId":"uniqueuuid",
      "plan": "AP",
      "namc": "TMMI",
      "Line": "Line1",
      "cycle": "Jan25",
      "createdBy": "Priyadarshini Gangone",
      "lastUpdated": "12/24/2025",
      "status": "In Progress"
    }
  ]
}

// if data for scenarios not availabel
If the data for scenarios is not available:

{
  "currentPage": 1, // Page no from the query Param
  "recordsPerPage": 40,// Page limit from the Query Param
  "totalRecords": 0,
  "totalPage": 0,
  "data": [],
}
  
 *
 * In-valid input error with status 400:
 * {
 *   "errorMessage": [<"ValidationError: validation error message”>]
 * }
 *
 * Unauthorized error with status 401 is handled by auth layer (before lambda).
 *
 * Internal server error with status 500:
 * {
 *   "errorMessage": "Internal Server Error"
 * }
 */
exports.handler = async (event) => {
  try {
    const response = await getScenariosTable(event);
    console.log("response:", response);
    return sendResponse(HTTP_RESPONSE_CODES.SUCCESS, response);
  } catch (err) {
    console.log("Handler Error: ", err);

    let errorMsg = API_ERROR_MESSAGE.INTERNAL_SERVER_ERROR;
    let statusCode = HTTP_RESPONSE_CODES.INTERNAL_SERVER_ERROR;

    if (err instanceof BadRequest) {
      statusCode = HTTP_RESPONSE_CODES.BAD_REQUEST;
      errorMsg = err.message
        .split(/,(?=ValidationError:)/)
        .map((e) => e.trim());
      console.log("Validation error messages: ", errorMsg);
    }

    return sendResponse(statusCode, { errorMessage: errorMsg });
  }
};
