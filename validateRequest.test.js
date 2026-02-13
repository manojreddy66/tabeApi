// __tests__/scenariosTable/validateRequest.test.js

const assert = require("assert");

// ✅ EXACT path from validateRequest.js
const SCHEMA_PATH =
  "/customDependencies/nodejs/schemaValidator/supplyPlanning/scenarios/scenariosTableSchema";

// ✅ IMPORTANT: virtual:true tells Jest "mock even if module doesn't exist on disk"
jest.mock(
  SCHEMA_PATH,
  () => ({
    getValidationSchema: jest.fn(),
  }),
  { virtual: true }
);

const { getValidationSchema } = require(SCHEMA_PATH);
const { validateInput } = require("../../src/scenariosTable/v1/1/validateRequest");

describe("SP Scenarios Table - validateRequest.js Test Suite", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Unit Test Case 1: Should return { errorMessages: [] } when validation passes", async () => {
    console.log(
      "*****************Unit Test Case 1: validateInput success*****************"
    );

    // validate() returns { error: null } on success
    const schema = {
      validate: jest.fn().mockResolvedValue({ error: null }),
    };

    getValidationSchema.mockResolvedValue(schema);

    const params = { type: "all", page: 1, limit: 40 };

    const result = await validateInput(params);

    assert.deepEqual(result, { errorMessages: [] });
    assert.equal(getValidationSchema.mock.calls.length, 1);
    assert.equal(schema.validate.mock.calls.length, 1);
    assert.deepEqual(schema.validate.mock.calls[0][0], params);
    assert.deepEqual(schema.validate.mock.calls[0][1], { abortEarly: false });
  });

  it("Unit Test Case 2: Should return unique error messages when validation fails", async () => {
    console.log(
      "*****************Unit Test Case 2: validateInput returns errors*****************"
    );

    const schema = {
      validate: jest.fn().mockResolvedValue({
        error: {
          details: [
            { message: "ValidationError: type is invalid" },
            { message: "ValidationError: page must be a number" },
            { message: "ValidationError: page must be a number" }, // duplicate
          ],
        },
      }),
    };

    getValidationSchema.mockResolvedValue(schema);

    const params = { type: "bad", page: "x", limit: 10 };

    const result = await validateInput(params);

    assert.deepEqual(result, {
      errorMessages: [
        "ValidationError: type is invalid",
        "ValidationError: page must be a number",
      ],
    });
  });
});
