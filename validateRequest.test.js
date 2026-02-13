// __tests__/scenariosTable/validateRequest.test.js

const assert = require("assert");

jest.mock("../../src/scenariosTable/v1/1/scenariosTableSchema", () => ({
  getValidationSchema: jest.fn(),
}));

const { getValidationSchema } = require("../../src/scenariosTable/v1/1/scenariosTableSchema");
const { validateInput } = require("../../src/scenariosTable/v1/1/validateRequest");

describe("SP Scenarios Table - validateRequest.js Test Suite", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Unit Test Case 1: Should return [] when validation passes", async () => {
    console.log(
      "*****************Unit Test Case 1: validateInput success*****************"
    );

    const validateAsync = jest.fn().mockResolvedValue(true);
    getValidationSchema.mockResolvedValue({ validateAsync });

    const params = { type: "all", page: 1, limit: 40 };

    const result = await validateInput(params);

    assert.deepEqual(result, []);
    assert.equal(getValidationSchema.mock.calls.length, 1);
    assert.equal(validateAsync.mock.calls.length, 1);
    assert.deepEqual(validateAsync.mock.calls[0][0], params);
  });

  it("Unit Test Case 2: Should return error messages array when validation fails (details[])", async () => {
    console.log(
      "*****************Unit Test Case 2: validateInput returns errors*****************"
    );

    const validateAsync = jest.fn().mockRejectedValue({
      details: [
        { message: "ValidationError: page is required and must be number." },
        { message: "ValidationError: limit is required and must be number." },
      ],
    });

    getValidationSchema.mockResolvedValue({ validateAsync });

    const params = { type: "all", page: "x", limit: "y" };

    const result = await validateInput(params);

    assert.deepEqual(result, [
      "ValidationError: page is required and must be number.",
      "ValidationError: limit is required and must be number.",
    ]);
  });

  it("Unit Test Case 3: Should return [] if validator throws but has no details (defensive)", async () => {
    console.log(
      "*****************Unit Test Case 3: validateInput defensive error*****************"
    );

    const validateAsync = jest.fn().mockRejectedValue(new Error("boom"));
    getValidationSchema.mockResolvedValue({ validateAsync });

    const params = { type: "all", page: 1, limit: 40 };

    const result = await validateInput(params);

    // depending on your implementation, you might return [] or ["boom"].
    // This assertion matches the common pattern: return [] when no details exist.
    assert.deepEqual(result, []);
  });
});
