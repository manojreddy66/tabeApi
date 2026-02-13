/**
 * @description Function to prepare response for scenarios table API.
 * @param {Object} params: type, page, limit
 * @param {number} totalRecords: total records count
 * @param {Array} rows: scenarios data
 * @returns {Object} response formatted for UI
 */
function prepareResponse(params, totalRecords, rows) {
  const { page, limit } = params;
  const totalPage = limit > 0 ? Math.ceil(totalRecords / limit) : 0;

  return {
    currentPage: page,
    recordsPerPage: limit,
    totalRecords,
    totalPage,
    data: rows || [],
  };
}

module.exports = { prepareResponse };