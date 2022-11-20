import { union } from './util';

const { hasOwnProperty } = Object.prototype;

/**
 * Compares and orders keywords by descending amount of individual words
 * @returns {number}
 */
function descendingCompositeOrder(v, nv) {
  return (nv.match(/\S+/g) || []).length - (v.match(/\S+/g) || []).length;
}

/**
 * Refines an array of reserved words
 * @param {string[]} [words=[]] - The base array of reserved words
 * @param {string[]} [include=[]] - Reserved words that should be contained in the resulting array
 * @param {string[]} [exclude=[]] - Reserved words that should not be contained in the resulting array
 * @returns {string[]}
 */
function refineWords(words = [], include = [], exclude = []) {
  const toInclude = include.map(word => word.toUpperCase());
  const toExclude = exclude.map(word => word.toUpperCase());

  return union(
    words
      .concat(toInclude)
      .filter(word => !toExclude.includes(word)),
  );
}

/**
 * Refines and streamlines an array of reserved words
 * @param {string[]} [words=[]] - The base array of reserved words
 * @param {object} [options={}] - Word refinement options
 * @param {string[]} [options.include] - Reserved words that should be contained in the resulting array
 * @param {string[]} [options.exclude] - Reserved words that should not be contained in the resulting array
 * @returns {string[]}
 */
export function getWords(words = [], options = {}) {
  let keywords = words.slice();

  if (options && (hasOwnProperty.call(options, 'include') || hasOwnProperty.call(options, 'exclude')))
    keywords = refineWords(keywords,
      Array.isArray(options.include) ? options.include : undefined,
      Array.isArray(options.exclude) ? options.exclude : undefined);

  return keywords.sort(descendingCompositeOrder);
}
