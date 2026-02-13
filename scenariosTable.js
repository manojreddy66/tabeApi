/**
 * @description this file contains DB queries for scenarios table API 
 *
 * - Fetches:
 *   1) total count
 *   2) paginated rows (limit/offset)
 */

const TABLE_NAME = "supply_planning.scenarios";

/**
 * @description Function to get scenarios count
 * @param {*} rdb: prisma client instance from dbConnect()
 * @param {String|null} planType: null for all tab, 'getsudo' for getsudo tab
 * @returns {Object} count row like { count: 10 }
 */
async function getScenarioCount(rdb, planType) {
  const rows = await rdb.$queryRaw`
    SELECT count(*)::int AS count
    FROM ${TABLE_NAME}
    WHERE is_active = true
      AND (${planType}::text IS NULL OR plan_type = ${planType})
  `;

  return rows?.[0] || { count: 0 };
}

/**
 * @description Function to get scenarios data with pagination
 * @param {*} rdb: prisma client instance from dbConnect()
 * @param {String|null} planType: null for all tab, 'getsudo' for getsudo tab
 * @param {Number} page: current page number
 * @param {Number} limit: records per page
 * @returns {Array} scenarios rows
 */
async function getScenarioPage(rdb, planType, page, limit) {
  const offset = (page - 1) * limit;

  return rdb.$queryRaw`
    SELECT
      scenario_name AS "scenario",
      scenario_id AS "scenarioId",
      plan_type AS "plan",
      namc AS "namc",
      line AS "Line",
      scenario_cycle AS "cycle",
      user_name AS "createdBy",
      last_updated AS "lastUpdated",
      scenario_status AS "status"
    FROM ${TABLE_NAME}
    WHERE is_active = true
      AND (${planType}::text IS NULL OR plan_type = ${planType})
    ORDER BY created_date_timestamp DESC
    LIMIT ${limit} OFFSET ${offset}
  `;
}

module.exports = {
  getScenarioCount,
  getScenarioPage,
};