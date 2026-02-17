/**
 * This file builds all tab query condition
 * and fetches all tab scenarios data
 */
const { dbConnect, dbDisconnect } = require("prismaORM/index");
const { DB_CLOSE_CONNECTION_STMT } = require("constants/customConstants");

const {
   getScenarioCount,
  getScenarioPage,
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
    // All tab -> no plan_type filter.
    const planType=null;

    const [countRow, rows] = await Promise.all([
      /**
       * @description Function to get scenarios count
       */
      getScenarioCount(rdb,planType),
      /**
       * @description Function to get scenarios data
       */
      getScenarioPage(rdb,planType,page,limit),
    ]);

    const totalRecords = Number(countRow?.count || 0);
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