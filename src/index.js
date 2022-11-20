/* eslint-disable curly */
/* eslint-disable function-paren-newline */
/* eslint-disable no-useless-concat */
/* eslint-disable prefer-destructuring */
/* eslint-disable prefer-template */

import { modes, voidFormatting } from './ansi';
import { craftRunestone } from './config';
import { defaultConfig } from './default';
import { nox } from './style';

let runestone;

/**
 * Highlight syntax of SQL-statements and log to terminal
 * @param {string|Object} text - String of SQL-statements to highlight
 */
function illumine(text) {
  const { rules = {}, own = {} } = runestone;

  const reset = modes.reset;
  const type = typeof text;

  let output;

  // Coerce entry to string primitive capable of being altered on exit.
  if (text && (type === 'string' || (type === 'object' && text.toString)))
    output = type === 'string' ? text : text.toString();
  else
    return;

  // If a given prefix should be replaced or removed, extract it before any subsequent highlights taint it.
  let __prefix;
  if (rules.prefix && rules.prefix.replace) {
    const match = rules.prefix.replace.exec(output);
    if (match) {
      __prefix = match[0];
      output = output.substr(__prefix.length);
    }
  }

  const __archetypes = {};

  for (const key of Object.keys(own)) {
    const rule = own[key];

    // Extract custom-built archetypes so no subsequent operations alter them. Mark their positions for reinsertion.
    __archetypes[key] = output.match(rule.regexp);
    if (__archetypes[key] && __archetypes[key].length) {
      output = output.replace(rule.regexp, '⥂_' + key + '⥄');
    }
  }

  // Extract delimited identifiers so no subsequent operations alter them. Mark their positions for reinsertion.
  const __identifiers = output.match(/(\[.*?\]|".*?")/g);
  if (__identifiers && __identifiers.length) {
    output = output.replace(/(\[.*?\]|".*?")/g, '⇁※↼');
  }

  // Extract constants so no subsequent operations alter them. Mark their positions for reinsertion.
  const __constants = output.match(/('.*?')/g);
  if (__constants && __constants.length) {
    output = output.replace(/('.*?')/g, '⇝※⇜');
  }

  // Extract local variables so no subsequent operations alter them. Mark their positions for reinsertion.
  const __variables = output.match(/(\B@[@#$_\w\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u00ff\u0100-\u017f\u0180-\u024f]*)/g);
  if (__variables && __variables.length) {
    output = output.replace(/(\B@[@#$_\w\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u00ff\u0100-\u017f\u0180-\u024f]*)/g, '↪※↩');
  }

  // Extract comment sections so no subsequent operations alter them. Mark their positions for reinsertion.
  const __comments = output.match(/(-{2}.*)|(\/\*(.|[\r\n])*?\*\/)/g);
  if (__comments && __comments.length) {
    output = output.replace(/(-{2}.*)|(\/\*(.|[\r\n])*?\*\/)/g, '⥤※⥢');
  }

  if (rules.dataTypes && (rules.dataTypes.sequence || rules.dataTypes.casing)) {
    const regex = new RegExp('\\b' + '(' + rules.dataTypes.types.join('|') + ')' + '\\b' + '(?![\'"\\]])', 'gi');
    output = output.replace(regex, (match, g1) => {
      let word = g1;

      if (rules.dataTypes.casing)
        word = rules.dataTypes.casing === 'lowercase' ? word.toLowerCase() : word.toUpperCase();

      if (rules.dataTypes.sequence)
        return rules.dataTypes.sequence + word + reset;
      else
        return word;
    });
  }

  if (rules.standardKeywords && (rules.standardKeywords.sequence || rules.standardKeywords.casing)) {
    const regex = new RegExp('\\b' + '(' + rules.standardKeywords.keywords.join('|') + ')' + '\\b' + '(?![\'"\\]])', 'gi');
    output = output.replace(regex, (match, g1) => {
      let word = g1;

      if (rules.standardKeywords.casing)
        word = rules.standardKeywords.casing === 'lowercase' ? word.toLowerCase() : word.toUpperCase();

      if (rules.standardKeywords.sequence)
        return rules.standardKeywords.sequence + word + reset;
      else
        return word;
    });
  }

  if (rules.lesserKeywords && (rules.lesserKeywords.sequence || rules.lesserKeywords.casing)) {
    const regex = new RegExp('\\b' + '(' + rules.lesserKeywords.keywords.join('|') + ')' + '\\b' + '(?![\'"\\]])', 'gi');
    output = output.replace(regex, (match, g1) => {
      let word = g1;

      if (rules.lesserKeywords.casing)
        word = rules.lesserKeywords.casing === 'lowercase' ? word.toLowerCase() : word.toUpperCase();

      if (rules.lesserKeywords.sequence)
        return rules.lesserKeywords.sequence + word + reset;
      else
        return word;
    });
  }

  if (rules.numbers && rules.numbers.sequence) {
    output = output.replace(/((\d+\.{1}){0,1}(\d+)(?![a-z\x1b]))(?!\d)/gi, rules.numbers.sequence + '$1' + reset);
  }

  if (rules.operators && rules.operators.sequence) {
    output = output.replace(/(\+|-|\*|\/|%|&|\||\^|=|>|<|::)+/g, rules.operators.sequence + '$&' + reset);
  }

  // If comment sections were found and extracted, reinsert them on the marked positions and cordon off the area for reference.
  if (__comments && __comments.length) {
    for (const i of __comments) {
      // If comment sections were to be formatted, apply the provided style.
      if (rules.comments && rules.comments.sequence)
        output = output.replace('⥤※⥢', rules.comments.sequence + 'c†s' + i + 'c‡e' + reset);
      else
        output = output.replace('⥤※⥢', 'c†s' + i + 'c‡e');
    }
  }

  // If local variables were found and extracted, reinsert them on the marked positions.
  if (__variables && __variables.length) {
    for (const i of __variables) {
      // If local variables were to be formatted, apply the provided style.
      if (rules.variables && rules.variables.sequence)
        output = output.replace('↪※↩', rules.variables.sequence + i + reset);
      else
        output = output.replace('↪※↩', i);
    }
  }

  // If constants were found and extracted, reinsert them on the marked positions.
  if (__constants && __constants.length) {
    for (const i of __constants) {
      // If constants were to be formatted, apply the provided style.
      if (rules.constants && rules.constants.sequence)
        output = output.replace('⇝※⇜', rules.constants.sequence + i + reset);
      else
        output = output.replace('⇝※⇜', i);
    }
  }

  // If delimited identifiers were found and extracted, reinsert them on the marked positions.
  if (__identifiers && __identifiers.length) {
    for (const i of __identifiers) {
      // If delimited identifiers were to be formatted, apply the provided style.
      if (rules.delimitedIdentifiers && rules.delimitedIdentifiers.sequence)
        output = output.replace('⇁※↼', rules.delimitedIdentifiers.sequence + i + reset);
      else
        output = output.replace('⇁※↼', i);
    }
  }

  for (const key of Object.keys(own).reverse()) {
    const rule = own[key];

    // If custom-built archetypes were found and extracted, reinsert them on the marked positions.
    if (__archetypes[key] && __archetypes[key].length) {
      for (const i of __archetypes[key]) {
        let re = i;

        if (typeof rule.transform === 'string')
          re = rule.transform;
        else if (typeof rule.transform === 'function')
          re = rule.transform(i);

        // Prevent back-reference
        re = re.replace(/\$/g, '$$$');

        // If custom-built archetypes were to be formatted, apply the provided style.
        if (rule && rule.sequence)
          output = output.replace('⥂_' + key + '⥄', rule.sequence + re + reset);
        else
          output = output.replace('⥂_' + key + '⥄', re);
      }
    }
  }

  // Constants are to be formatted as a whole and no other format should exist inside them. Void any that could have been applied.
  output = output.replace(/('.*?')/g, (match) => voidFormatting(match));

  // Comment sections are to be formatted as a whole and no other format should exist inside them. Void any that could have been applied and remove cordon.
  output = output.replace(/(c†s)((-{2}.*)|(\/\*(.|[\r\n])*?\*\/))(c‡e)/g, (match, p1, p2) => voidFormatting(p2));

  // If the given prefix was found and a replacement pattern was provided, substitute it.
  if (__prefix && typeof rules.prefix.text === 'string') {
    output = __prefix + output;
    output = output.replace(
      __prefix,
      rules.prefix.sequence ?
        rules.prefix.sequence + rules.prefix.text + reset :
        rules.prefix.text,
    );
  }
  // If only the prefix text was provided, append it.
  else if (rules.prefix && rules.prefix.text && !rules.prefix.replace) {
    output = (rules.prefix.sequence ?
      rules.prefix.sequence + rules.prefix.text + reset :
      rules.prefix.text
    ) + output;
  }

  if (rules.postfix && rules.postfix.text) {
    output += (rules.postfix.sequence ?
      rules.postfix.sequence + rules.postfix.text + reset :
      rules.postfix.text
    );
  }

  return runestone.output(output);
}

const knownRules = [
  'comments',
  'constants',
  'numbers',
  'operators',
  'variables',
  'delimitedIdentifiers',
  'dataTypes',
  'standardKeywords',
  'lesserKeywords',
  'prefix',
  'postfix',
];

/**
 * Create logger
 * @param {any} [config] - Custom format rules
 * @returns {function} - Syntax highlighter and logging function
 * @todo return new instance instead
 */
function igniculus(config = defaultConfig) {
  runestone = craftRunestone(config);

  return illumine;
}

export default igniculus;
export { illumine as log, nox };
