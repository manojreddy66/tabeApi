// __tests__/scenariosTable/getSudoTab.test.js

const assert = require("assert");

jest.mock("prismaORM/index", () => ({
  dbConnect: jest.fn(),
  dbDisconnect: jest.fn(),
}));

jest.mock("constants/customConstants", () => ({
  DB_CLOSE_CONNECTION_STMT: "DB connection closed",
}));

jest.mock("../../src/scenariosTable/v1/1/scenariosTable", () => ({
  getScenarioCount: jest.fn(),
  getScenarioPage: jest.fn(),
}));

const { dbConnect, dbDisconnect } = require("prismaORM/index");
const { getScenarioCount, getScenarioPage } = require("../../src/scenariosTable/v1/1/scenariosTable");
const { getGetsudoTabScenariosData } = require("../../src/scenariosTable/v1/1/getSudoTab");

describe("SP Scenarios Table - GETSUDO Tab Test Suite", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Unit Test Case 1: Should return {totalRecords, rows} for GETSUDO tab and call DB helpers with planType='Getsudo'", async () => {
    console.log(
      "*****************Unit Test Case 1: GETSUDO tab returns data*****************"
    );

    const fakeRdb = { name: "fake-prisma-client" };
    dbConnect.mockResolvedValue(fakeRdb);

    getScenarioCount.mockResolvedValue({ count: 12 });
    getScenarioPage.mockResolvedValue([{ scenario: "G1" }]);

    const params = { type: "Getsudo", page: 2, limit: 10 };

    const result = await getGetsudoTabScenariosData(params);

    // DB connect + disconnect
    assert.equal(dbConnect.mock.calls.length, 1);
    assert.equal(dbDisconnect.mock.calls.length, 1);

    // planType must be 'Getsudo' for GETSUDO tab
    assert.equal(getScenarioCount.mock.calls.length, 1);
    assert.deepEqual(getScenarioCount.mock.calls[0], [fakeRdb, "Getsudo"]);

    assert.equal(getScenarioPage.mock.calls.length, 1);
    assert.deepEqual(getScenarioPage.mock.calls[0], [fakeRdb, "Getsudo", 2, 10]);

    assert.deepEqual(result, {
      totalRecords: 12,
      rows: [{ scenario: "G1" }],
    });
  });

  it("Unit Test Case 2: Should default totalRecords to 0 when countRow is missing", async () => {
    console.log(
      "*****************Unit Test Case 2: GETSUDO tab totalRecords default*****************"
    );

    const fakeRdb = { name: "fake-prisma-client" };
    dbConnect.mockResolvedValue(fakeRdb);

    getScenarioCount.mockResolvedValue(undefined); // simulate unexpected
    getScenarioPage.mockResolvedValue([]);

    const params = { type: "Getsudo", page: 1, limit: 40 };
    const result = await getGetsudoTabScenariosData(params);

    assert.deepEqual(result, { totalRecords: 0, rows: [] });
    assert.equal(dbDisconnect.mock.calls.length, 1);
  });

  it("Unit Test Case 3: Should rethrow error when DB helper throws and still disconnect", async () => {
    console.log(
      "*****************Unit Test Case 3: GETSUDO tab rethrows error*****************"
    );

    const fakeRdb = { name: "fake-prisma-client" };
    dbConnect.mockResolvedValue(fakeRdb);

    const err = new Error("DB error");
    getScenarioCount.mockRejectedValue(err);

    const params = { type: "Getsudo", page: 2, limit: 10 };

    await assert.rejects(async () => getGetsudoTabScenariosData(params), (e) => e === err);

    // must disconnect in finally
    assert.equal(dbDisconnect.mock.calls.length, 1);
  });
});
