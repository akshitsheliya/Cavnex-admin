/**
 * Organization Helper Functions
 * Use these in all controllers for consistent org-based queries
 */

/**
 * Build query object based on organization or user
 * @param {Object} req - Express request object
 * @returns {Object} Query object
 */
const buildOrgQuery = (req) => {
  if (req.organizationId) {
    return { organization: req.organizationId };
  }
  return { createdBy: req.user._id };
};

/**
 * Build query with additional filters
 * @param {Object} req - Express request object
 * @param {Object} additionalFilters - Additional filters to merge
 * @returns {Object} Query object
 */
const buildOrgQueryWithFilters = (req, additionalFilters = {}) => {
  return {
    ...buildOrgQuery(req),
    ...additionalFilters,
  };
};

/**
 * Get org/user match for aggregations
 * @param {Object} req - Express request object
 * @returns {Object} Match object for aggregate
 */
const getAggregateMatch = (req) => {
  if (req.organizationId) {
    return { organization: req.organizationId };
  }
  return { createdBy: req.user._id };
};

/**
 * Create document data with organization
 * @param {Object} req - Express request object
 * @param {Object} data - Document data
 * @returns {Object} Data with org and createdBy
 */
const withOrgData = (req, data) => {
  return {
    ...data,
    createdBy: req.user._id,
    ...(req.organizationId && { organization: req.organizationId }),
  };
};

module.exports = {
  buildOrgQuery,
  buildOrgQueryWithFilters,
  getAggregateMatch,
  withOrgData,
};
