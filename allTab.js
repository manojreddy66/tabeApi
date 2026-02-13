/**
 * This file builds all tab query condition
 * and fetches all tab scenarios data
 */
const { dbConnect, dbDisconnect } = require("prismaORM/index");
const { DB_CLOSE_CONNECTION_STMT } = require("constants/customConstants");

const {
  getScenariosDataCount,
  getScenariosTableData,
} = require("./scenariosTable.js");

/**
 * @description Function to get all tab scenarios data
 * @param {*} {Object} params: type, page, limit
 * @returns {Object} totalRecords & rows
 */
async function getAllTabScenariosData(params) {
  /* Connecting to DB */
  const rdb = await dbConnect();
  try {
    const { page, limit } = params;

    // No extra condition for ALL tab
    const queryConditionForDataNCountByTab = "";

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
    console.log("Error in getAllTabScenariosData:", err);
    throw err;
  } finally {
    dbDisconnect();
    console.log(DB_CLOSE_CONNECTION_STMT);
  }
}

module.exports = { getAllTabScenariosData };