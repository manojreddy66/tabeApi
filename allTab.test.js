// __tests__/scenariosTable/allTab.test.js

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
const { getAllTabScenariosData } = require("../../src/scenariosTable/v1/1/allTab");

describe("SP Scenarios Table - ALL Tab Test Suite", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Unit Test Case 1: Should return {totalRecords, rows} for ALL tab and call DB helpers with planType=null", async () => {
    console.log(
      "*****************Unit Test Case 1: ALL tab returns data*****************"
    );

    const fakeRdb = { name: "fake-prisma-client" };
    dbConnect.mockResolvedValue(fakeRdb);

    getScenarioCount.mockResolvedValue({ count: 100 });
    getScenarioPage.mockResolvedValue([{ scenario: "S1" }, { scenario: "S2" }]);

    const params = { type: "all", page: 1, limit: 40 };

    const result = await getAllTabScenariosData(params);

    // DB connect + disconnect
    assert.equal(dbConnect.mock.calls.length, 1);
    assert.equal(dbDisconnect.mock.calls.length, 1);

    // planType must be null for ALL tab
    assert.equal(getScenarioCount.mock.calls.length, 1);
    assert.deepEqual(getScenarioCount.mock.calls[0], [fakeRdb, null]);

    assert.equal(getScenarioPage.mock.calls.length, 1);
    assert.deepEqual(getScenarioPage.mock.calls[0], [fakeRdb, null, 1, 40]);

    assert.deepEqual(result, {
      totalRecords: 100,
      rows: [{ scenario: "S1" }, { scenario: "S2" }],
    });
  });

  it("Unit Test Case 2: Should default totalRecords to 0 when countRow is missing", async () => {
    console.log(
      "*****************Unit Test Case 2: ALL tab totalRecords default*****************"
    );

    const fakeRdb = { name: "fake-prisma-client" };
    dbConnect.mockResolvedValue(fakeRdb);

    getScenarioCount.mockResolvedValue(undefined); // simulate unexpected
    getScenarioPage.mockResolvedValue([]);

    const params = { type: "all", page: 1, limit: 40 };
    const result = await getAllTabScenariosData(params);

    assert.deepEqual(result, { totalRecords: 0, rows: [] });
    assert.equal(dbDisconnect.mock.calls.length, 1);
  });

  it("Unit Test Case 3: Should rethrow error when DB helper throws and still disconnect", async () => {
    console.log(
      "*****************Unit Test Case 3: ALL tab rethrows error*****************"
    );

    const fakeRdb = { name: "fake-prisma-client" };
    dbConnect.mockResolvedValue(fakeRdb);

    const err = new Error("DB error");
    getScenarioCount.mockRejectedValue(err);

    const params = { type: "all", page: 1, limit: 40 };

    await assert.rejects(async () => getAllTabScenariosData(params), (e) => e === err);

    // must disconnect in finally
    assert.equal(dbDisconnect.mock.calls.length, 1);
  });
});
