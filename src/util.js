/**
 * Creates an array of unique values
 * @param {...Array} [arrays]
 * @returns {Array}
 */
export const union = (...arrays) => [
  ...new Set([].concat(...arrays)),
];
