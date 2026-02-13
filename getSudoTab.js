/**
 * This file builds getsudo tab query condition
 * and fetches getsudo tab scenarios data
 */
const { dbConnect, dbDisconnect } = require("prismaORM/index");
const { DB_CLOSE_CONNECTION_STMT } = require("constants/customConstants");

const {
  getScenariosDataCount,
  getScenariosTableData,
} = require("./scenariosTable");

/**
 * @description Function to get getsudo tab scenarios data
 * @param {*} {Object} params: type, page, limit
 * @returns {Object} totalRecords & rows
 */
async function getGetsudoTabScenariosData(params) {
  /* Connecting to DB */
  const rdb = await dbConnect();
  try {
    const { page, limit } = params;

    /**
     * @description Default query condition for Getsudo tab
     * plan_type valid values include 'getsudo' (lowercase) as per DB schema.
     */
    const queryConditionForDataNCountByTab = ` AND plan_type = 'getsudo'`;

    const [countResult, rows] = await Promise.all([
      /**
       * @description Function to get scenarios count
       */
      getScenariosDataCount(queryConditionForDataNCountByTab, rdb),
      /**
       * @description Function to get scenarios data
       */
      getScenariosTableData(queryConditionForDataNCountByTab, page, limit, rdb),
    ]);

    const totalRecords = Number(countResult?.[0]?.count || 0);
    return { totalRecords, rows };
  } catch (err) {
    console.log("Error in getGetsudoTabScenariosData:", err);
    throw err;
  } finally {
    dbDisconnect();
    console.log(DB_CLOSE_CONNECTION_STMT);
  }
}

module.exports = { getGetsudoTabScenariosData };