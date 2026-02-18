const { BaseService } = require("./BaseService");
const {
  SCENARIO_TYPES,
  SCENARIO_STATUSES,
} = require("constants/customConstants");
const { formatScenarioCycle } = require("utils/common_utils");

class scenariosData extends BaseService {
  constructor(db) {
    super(db);
  }

  /**
   * @description Function to get scenario data by type, namc, line & cycle
   */
  async getScenarioData(type, namc, line, cycle) {
    try {
      return await this.prisma
        .$queryRaw`select * from supply_planning.scenarios where plan_type = ${type}
                   and namc = ${namc} and line = ${line} and scenario_cycle = ${cycle};`;
    } catch (err) {
      console.log("Error in getScenarioData:", err);
      throw err;
    }
  }

  /**
   * @description Function to create scenario
   */
  async createScenario(
    input,
    scenarioName,
    cycle,
    startMonthYear,
    endMonthYear,
    tx
  ) {
    try {
      const getsudoMonth =
        input.type === SCENARIO_TYPES.GETSUDO
          ? formatScenarioCycle(cycle)
          : null;
      return await tx.$queryRaw`INSERT INTO supply_planning.scenarios (user_email, user_name, scenario_name,
                    namc,
                    line,
                    plan_type,
                    start_month_year,
                    end_month_year,
                    scenario_cycle,
                    getsudo_month,
                    scenario_status,
                    last_updated) 
                    VALUES (${input.userEmail},${input.userName},${scenarioName},
                    ${input.namc}, ${input.line},${input.type}, ${startMonthYear},
                    ${endMonthYear}, ${cycle}, ${getsudoMonth}, 
                    ${SCENARIO_STATUSES.NOT_STARTED}, CURRENT_TIMESTAMP);`;
    } catch (err) {
      console.log("Error in createScenario:", err);
      throw err;
    }
  }

  /**
   * @description Function to get scenario data count for table
   */
  async getScenarioTableDataCount(query) {
    try {
      return await this.prisma.$queryRaw`${query}`;
    } catch (err) {
      console.log("Error in getScenarioTableDataCount:", err);
      throw err;
    }
  }

  /**
   * @description Function to get scenario data for table
   */
  async getScenarioTableData(query) {
    try {
      return await this.prisma.$queryRaw`${query}`;
    } catch (err) {
      console.log("Error in getScenarioTableData:", err);
      throw err;
    }
  }

  
 /**
   * @description Function to get scenario row from supply_planning.scenarios table
   *  based on scenario_name.
   */
  async getScenarioByName(scenarioName) {
    try {
      const rows = await this.prisma
        .$queryRaw`select * from supply_planning.scenarios where scenario_name = ${scenarioName};`;

      return rows?.[0] || null;
    } catch (err) {
      console.log("Error in getScenarioByName:", err);
      throw err;
    }
  }

  /**
   * @description Function to delete scenario in supply_planning.scenarios table.
   * Soft delete , we will not remove the record from DB.
   */
  async deleteScenario(scenarioName) {
    try {
      return await this.prisma.$queryRaw`
        update supply_planning.scenarios
        set is_active = false,
            last_updated = CURRENT_TIMESTAMP
        where scenario_name = ${scenarioName};
      `;
    } catch (err) {
      console.log("Error in softDeleteScenario:", err);
      throw err;
    }
  }
}

module.exports.scenariosData = scenariosData;
