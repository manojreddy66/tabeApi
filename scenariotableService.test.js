// __tests__/scenariosTable/scenariosTableService.test.js

const assert = require("assert");

jest.mock("utils/api_response_utils", () => {
  class BadRequest extends Error {
    constructor(message) {
      super(Array.isArray(message) ? message.join(",") : message);
      this.name = "BadRequest";
    }
  }
  return { BadRequest };
});

jest.mock("../../src/scenariosTable/v1/1/validateRequest", () => ({
  validateInput: jest.fn(),
}));

jest.mock("../../src/scenariosTable/v1/1/allTab", () => ({
  getAllTabScenariosData: jest.fn(),
}));

// ✅ UPDATED: service uses getGetsudoTabScenariosData from ./getSudoTab
jest.mock("../../src/scenariosTable/v1/1/getSudoTab", () => ({
  getGetsudoTabScenariosData: jest.fn(),
}));

jest.mock("../../src/scenariosTable/v1/1/utils", () => ({
  prepareResponse: jest.fn(),
}));

const { getScenariosTable } = require("../../src/scenariosTable/v1/1/scenariosTableService");
const { validateInput } = require("../../src/scenariosTable/v1/1/validateRequest");
const { getAllTabScenariosData } = require("../../src/scenariosTable/v1/1/allTab");
const { getGetsudoTabScenariosData } = require("../../src/scenariosTable/v1/1/getSudoTab");
const { prepareResponse } = require("../../src/scenariosTable/v1/1/utils");
const { BadRequest } = require("utils/api_response_utils");

describe("SP Scenarios Table Service Test Suite", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Unit Test Case 1: Should validate input and route to ALL tab, then prepare response.", async () => {
    console.log(
      "*****************Unit Test Case 1: Service routes ALL tab*****************"
    );

    const event = {
      pathParameters: { type: "all" },
      queryStringParameters: { page: "1", limit: "40" },
    };

    validateInput.mockResolvedValue([]);

    getAllTabScenariosData.mockResolvedValue({
      totalRecords: 100,
      rows: [{ scenario: "S1" }],
    });

    prepareResponse.mockReturnValue({
      currentPage: 1,
      recordsPerPage: 40,
      totalRecords: 100,
      totalPage: 3,
      data: [{ scenario: "S1" }],
    });

    const result = await getScenariosTable(event);

    // validateInput gets called with transformed params (Number conversion)
    assert.equal(validateInput.mock.calls.length, 1);
    assert.deepEqual(validateInput.mock.calls[0][0], {
      type: "all",
      page: 1,
      limit: 40,
    });

    // routed to ALL tab
    assert.equal(getAllTabScenariosData.mock.calls.length, 1);
    assert.deepEqual(getAllTabScenariosData.mock.calls[0][0], {
      type: "all",
      page: 1,
      limit: 40,
    });

    // NOT routed to getsudo
    assert.equal(getGetsudoTabScenariosData.mock.calls.length, 0);

    // prepareResponse called with params + totals
    assert.equal(prepareResponse.mock.calls.length, 1);
    assert.deepEqual(prepareResponse.mock.calls[0], [
      { type: "all", page: 1, limit: 40 },
      100,
      [{ scenario: "S1" }],
    ]);

    assert.deepEqual(result, {
      currentPage: 1,
      recordsPerPage: 40,
      totalRecords: 100,
      totalPage: 3,
      data: [{ scenario: "S1" }],
    });
  });

  it("Unit Test Case 2: Should validate input and route to GETSUDO tab, then prepare response.", async () => {
    console.log(
      "*****************Unit Test Case 2: Service routes GETSUDO tab*****************"
    );

    const event = {
      pathParameters: { type: "Getsudo" },
      queryStringParameters: { page: "2", limit: "10" },
    };

    validateInput.mockResolvedValue([]);

    getGetsudoTabScenariosData.mockResolvedValue({
      totalRecords: 12,
      rows: [{ scenario: "G1" }],
    });

    prepareResponse.mockReturnValue({
      currentPage: 2,
      recordsPerPage: 10,
      totalRecords: 12,
      totalPage: 2,
      data: [{ scenario: "G1" }],
    });

    const result = await getScenariosTable(event);

    assert.equal(validateInput.mock.calls.length, 1);
    assert.deepEqual(validateInput.mock.calls[0][0], {
      type: "Getsudo",
      page: 2,
      limit: 10,
    });

    assert.equal(getGetsudoTabScenariosData.mock.calls.length, 1);
    assert.deepEqual(getGetsudoTabScenariosData.mock.calls[0][0], {
      type: "Getsudo",
      page: 2,
      limit: 10,
    });

    assert.equal(getAllTabScenariosData.mock.calls.length, 0);

    assert.equal(prepareResponse.mock.calls.length, 1);
    assert.deepEqual(prepareResponse.mock.calls[0], [
      { type: "Getsudo", page: 2, limit: 10 },
      12,
      [{ scenario: "G1" }],
    ]);

    assert.deepEqual(result, {
      currentPage: 2,
      recordsPerPage: 10,
      totalRecords: 12,
      totalPage: 2,
      data: [{ scenario: "G1" }],
    });
  });

  it("Unit Test Case 3: Should throw BadRequest when validateInput returns errors.", async () => {
    console.log(
      "*****************Unit Test Case 3: Service throws BadRequest*****************"
    );

    const event = {
      pathParameters: { type: "all" },
      queryStringParameters: { page: "x", limit: "y" },
    };

    validateInput.mockResolvedValue([
      "ValidationError: page must be a number",
      "ValidationError: limit must be a number",
    ]);

    await assert.rejects(
      async () => getScenariosTable(event),
      (err) => err instanceof BadRequest
    );

    // Should not hit DB layer or prepareResponse
    assert.equal(getAllTabScenariosData.mock.calls.length, 0);
    assert.equal(getGetsudoTabScenariosData.mock.calls.length, 0);
    assert.equal(prepareResponse.mock.calls.length, 0);
  });

  it("Unit Test Case 4: Should rethrow error if tab handler throws.", async () => {
    console.log(
      "*****************Unit Test Case 4: Service rethrows tab error*****************"
    );

    const event = {
      pathParameters: { type: "all" },
      queryStringParameters: { page: "1", limit: "40" },
    };

    validateInput.mockResolvedValue([]);

    const tabErr = new Error("DB down");
    getAllTabScenariosData.mockRejectedValue(tabErr);

    await assert.rejects(async () => getScenariosTable(event), (err) => err === tabErr);

    // prepareResponse should not run
    assert.equal(prepareResponse.mock.calls.length, 0);
  });

  it("Unit Test Case 5: Should handle missing queryStringParameters (page/limit undefined) and still call validateInput.", async () => {
    console.log(
      "*****************Unit Test Case 5: Missing query params*****************"
    );

    const event = {
      pathParameters: { type: "all" },
      // queryStringParameters missing
    };

    validateInput.mockResolvedValue([]);

    getAllTabScenariosData.mockResolvedValue({
      totalRecords: 0,
      rows: [],
    });

    prepareResponse.mockReturnValue({
      currentPage: undefined,
      recordsPerPage: undefined,
      totalRecords: 0,
      totalPage: 0,
      data: [],
    });

    const result = await getScenariosTable(event);

    assert.deepEqual(validateInput.mock.calls[0][0], {
      type: "all",
      page: undefined,
      limit: undefined,
    });

    assert.deepEqual(result, {
      currentPage: undefined,
      recordsPerPage: undefined,
      totalRecords: 0,
      totalPage: 0,
      data: [],
    });
  });
});
