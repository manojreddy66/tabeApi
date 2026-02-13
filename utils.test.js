// __tests__/scenariosTable/utils.test.js

const assert = require("assert");

const { prepareResponse } = require("../../src/scenariosTable/v1/1/utils");

describe("SP Scenarios Table - utils.js Test Suite", () => {
  it("Unit Test Case 1: Should build response with correct pagination fields and data", async () => {
    console.log(
      "*****************Unit Test Case 1: prepareResponse normal case*****************"
    );

    const params = { type: "all", page: 2, limit: 40 };
    const totalRecords = 100;
    const rows = [{ scenario: "S1" }];

    const result = prepareResponse(params, totalRecords, rows);

    assert.deepEqual(result, {
      currentPage: 2,
      recordsPerPage: 40,
      totalRecords: 100,
      totalPage: 3, // ceil(100/40)=3
      data: [{ scenario: "S1" }],
    });
  });

  it("Unit Test Case 2: Should return data=[] when rows is null/undefined", async () => {
    console.log(
      "*****************Unit Test Case 2: prepareResponse rows default*****************"
    );

    const params = { type: "all", page: 1, limit: 10 };
    const totalRecords = 5;

    const result1 = prepareResponse(params, totalRecords, undefined);
    const result2 = prepareResponse(params, totalRecords, null);

    assert.deepEqual(result1.data, []);
    assert.deepEqual(result2.data, []);
  });

  it("Unit Test Case 3: Should set totalPage=0 when limit is 0", async () => {
    console.log(
      "*****************Unit Test Case 3: prepareResponse limit=0*****************"
    );

    const params = { type: "all", page: 1, limit: 0 };
    const totalRecords = 100;
    const rows = [{ scenario: "S1" }];

    const result = prepareResponse(params, totalRecords, rows);

    assert.equal(result.totalPage, 0);
  });

  it("Unit Test Case 4: Should set totalPage=0 when limit is negative", async () => {
    console.log(
      "*****************Unit Test Case 4: prepareResponse limit negative*****************"
    );

    const params = { type: "all", page: 1, limit: -5 };
    const totalRecords = 100;

    const result = prepareResponse(params, totalRecords, []);

    assert.equal(result.totalPage, 0);
  });
});
