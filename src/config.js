import { forgeSequence } from './ansi';
import { base } from './lang';
import { nox } from './style';
import { getWords } from './words';

/**
 * Draft format sequences, refines data types and keywords, and processes replacement patterns from the provided configuration
 * @param {Object} [config={}]
 */
export const craftRunestone = ({
  rules = {},
  own = {},
  output,
} = {}) => {
  const runestone = {
    rules: {},
    own: {},
    output: (typeof output !== 'function') ? console.log : output, // eslint-disable-line no-console
  };

  for (const [name, { style }] of Object.entries(rules)) {
    if (style) {
      runestone.rules[name] = {
        sequence: forgeSequence(
          // If using proxy builder pass style parameters as object
          style instanceof nox.constructor ? style.style : style,
        ),
      };
    }
  }

  for (const [name, { style, regexp, transform }] of Object.entries(own)) {
    if (regexp) {
      runestone.own[name] = { regexp };

      if (style) {
        runestone.own[name].sequence = forgeSequence(
          // If using proxy builder pass style parameters as object
          style instanceof nox.constructor ? style.style : style,
        );
      }

      if (typeof transform === 'string' || typeof transform === 'function') {
        runestone.own[name].transform = transform;
      }
    }
  }

  if (rules.dataTypes) {
    const { types, casing } = rules.dataTypes;

    runestone.rules.dataTypes = {
      ...runestone.rules.dataTypes,
      types: Array.isArray(types) ? getWords(types) : getWords(base.defaultDataTypes, types),
    };

    if (casing === 'lowercase' || casing === 'uppercase') {
      runestone.rules.dataTypes = {
        ...runestone.rules.dataTypes,
        casing,
      };
    }
  }

  if (rules.standardKeywords) {
    const { keywords, casing } = rules.standardKeywords;

    runestone.rules.standardKeywords = {
      ...runestone.rules.standardKeywords,
      keywords: Array.isArray(keywords) ? getWords(keywords) : getWords(base.defaultStandardKeywords, keywords),
    };

    if (casing === 'lowercase' || casing === 'uppercase') {
      runestone.rules.standardKeywords = {
        ...runestone.rules.standardKeywords,
        casing,
      };
    }
  }

  if (rules.lesserKeywords) {
    const { keywords, casing } = rules.lesserKeywords;

    runestone.rules.lesserKeywords = {
      ...runestone.rules.lesserKeywords,
      keywords: Array.isArray(keywords) ? getWords(keywords) : getWords(base.defaultLesserKeywords, keywords),
    };

    if (casing === 'lowercase' || casing === 'uppercase') {
      runestone.rules.lesserKeywords = {
        ...runestone.rules.lesserKeywords,
        casing,
      };
    }
  }

  if (rules.prefix) {
    const { replace, text } = rules.prefix;

    if (typeof replace === 'string' || replace instanceof RegExp) {
      runestone.rules.prefix = {
        ...runestone.rules.prefix,
        // If prefix replacement pattern is a string escape it so it can be passed to the RegExp constructor
        replace: (typeof replace === 'string')
          ? new RegExp(`^${replace.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}`, 'i')
          : replace,
      };
    }

    if (typeof text === 'string') {
      runestone.rules.prefix = {
        ...runestone.rules.prefix,
        text,
      };
    }
  }

  if (rules.postfix) {
    const { replace, text } = rules.postfix;

    // @todo add support for replacement
    if (typeof replace === 'string' || replace instanceof RegExp) {
      runestone.rules.postfix = {
        ...runestone.rules.postfix,
        // If postfix replacement pattern is a string escape it so it can be passed to the RegExp constructor
        replace: (typeof replace === 'string')
          ? new RegExp(`^${replace.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}`, 'i')
          : replace,
      };
    }

    if (typeof text === 'string') {
      runestone.rules.postfix = {
        ...runestone.rules.postfix,
        text,
      };
    }
  }

  return runestone;
};
