// __tests__/scenariosTable/validateRequest.test.js

const assert = require("assert");

// ✅ Put the string directly (because jest.mock is hoisted)
jest.mock(
  "/customDependencies/nodejs/schemaValidator/supplyPlanning/scenarios/scenariosTableSchema",
  () => ({
    getValidationSchema: jest.fn(),
  }),
  { virtual: true }
);

const {
  getValidationSchema,
} = require("/customDependencies/nodejs/schemaValidator/supplyPlanning/scenarios/scenariosTableSchema");

const { validateInput } = require("../../src/scenariosTable/v1/1/validateRequest");

describe("SP Scenarios Table - validateRequest.js Test Suite", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Unit Test Case 1: Should return { errorMessages: [] } when validation passes", async () => {
    const schema = {
      validate: jest.fn().mockResolvedValue({ error: null }),
    };
    getValidationSchema.mockResolvedValue(schema);

    const result = await validateInput({ type: "all", page: 1, limit: 40 });

    assert.deepEqual(result, { errorMessages: [] });
  });

  it("Unit Test Case 2: Should return unique error messages when validation fails", async () => {
    const schema = {
      validate: jest.fn().mockResolvedValue({
        error: {
          details: [
            { message: "ValidationError: type invalid" },
            { message: "ValidationError: page invalid" },
            { message: "ValidationError: page invalid" },
          ],
        },
      }),
    };
    getValidationSchema.mockResolvedValue(schema);

    const result = await validateInput({ type: "bad", page: "x", limit: 10 });

    assert.deepEqual(result, {
      errorMessages: ["ValidationError: type invalid", "ValidationError: page invalid"],
    });
  });
});
