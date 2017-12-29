'use strict';

const defaultDataTypes = ['BIGINT', 'NUMERIC', 'BIT', 'SMALLINT', 'DECIMAL', 'SMALLMONEY', 'INT', 'INTEGER', 'TINYINT', 'MONEY', 'FLOAT', 'REAL', 'DATE', 'DATETIMEOFFSET', 'DATETIME2', 'SMALLDATETIME', 'DATETIME', 'TIME', 'CHAR', 'VARCHAR', 'TEXT', 'NCHAR', 'NVARCHAR', 'NTEXT', 'BINARY', 'VARBINARY', 'IMAGE'];

const defaultStandardKeywords = ['ACTION', 'ADD', 'ALTER', 'BEGIN', 'BY', 'CASCADE', 'CASE', 'CHECK', 'CHECKPOINT', 'COMMIT', 'CONSTRAINT', 'CONTINUE', 'CREATE', 'CROSS', 'DATABASE', 'DECLARE', 'DEFAULT', 'DELETE', 'DISTINCT', 'DROP', 'ELSE', 'END', 'EXCEPT', 'EXEC', 'EXECUTE', 'FOREIGN', 'FROM', 'FULL', 'GO', 'GROUP', 'HAVING', 'IDENTITY', 'IF', 'INDEX', 'INNER', 'INSERT', 'INTERSECT', 'INTO', 'JOIN', 'KEY', 'LEFT', 'MERGE', 'MODIFY', 'NO', 'ON', 'ORDER', 'OUTER', 'PREPARE', 'PRIMARY', 'PROC', 'PROCEDURE', 'REFERENCES', 'RETURN', 'RIGHT', 'SAVE', 'SELECT', 'SET', 'TABLE', 'TOP', 'TRAN', 'TRANSACTION', 'TRIGGER', 'TRUNCATE', 'UNION', 'UNIQUE', 'UPDATE', 'USE', 'VALUES', 'VIEW', 'WHEN', 'WHERE', 'WHILE', 'WITH'];

const defaultLesserKeywords = ['ALL', 'AND', 'ANY', 'AS', 'ASC', 'AVG', 'BETWEEN', 'COUNT', 'DESC', 'EXISTS', 'IN', 'IS', 'LIKE', 'MAX', 'MIN', 'NOT', 'NULL', 'OR', 'SOME', 'SUM'];

let dataTypes = defaultDataTypes.slice();
let standardKeywords = defaultStandardKeywords.slice();
let lesserKeywords = defaultLesserKeywords.slice();

const ANSIModes = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    dim: '\x1b[2m',
    italic: '\x1b[3m',
    underline: '\x1b[4m',
    blink: '\x1b[5m',
    inverse: '\x1b[7m',
    hidden: '\x1b[8m',
    strikethrough: '\x1b[9m'
};

const ANSIColours = {
    fg: {
        black: '\x1b[30m',
        red: '\x1b[31m',
        green: '\x1b[32m',
        yellow: '\x1b[33m',
        blue: '\x1b[34m',
        magenta: '\x1b[35m',
        cyan: '\x1b[36m',
        white: '\x1b[37m'
    },
    bg: {
        black: '\x1b[40m',
        red: '\x1b[41m',
        green: '\x1b[42m',
        yellow: '\x1b[43m',
        blue: '\x1b[44m',
        magenta: '\x1b[45m',
        cyan: '\x1b[46m',
        white: '\x1b[47m'
    }
};

const defaults = {
    constants:              { mode: 'dim', fg: 'red' },
    delimitedIdentifiers:   { mode: 'dim', fg: 'yellow' },
    dataTypes:              { mode: 'dim', fg: 'green' },
    standardKeywords:       { mode: 'dim', fg: 'cyan' },
    lesserKeywords:         { mode: 'bold', fg: 'black' },
    prefix:                 { replace: /.*?: / }
};

let runestone;

/**
 * Forge ANSI escape code sequence for text formatting.
 * @param {Object} rule - Object that defines the colors to use for formatting a particular rule.
 * @returns {string}
 */
function forgeANSISequence(rule) {
    let mode, fg, bg;

    mode = (rule.mode && ANSIModes[rule.mode]) ? ANSIModes[rule.mode] : '';
    fg = (rule.fg && ANSIColours.fg[rule.fg]) ? ANSIColours.fg[rule.fg] : '';
    bg = (rule.bg && ANSIColours.bg[rule.bg]) ? ANSIColours.bg[rule.bg] : '';

    let ANSISequence = mode + bg + fg;
    return ANSISequence;
}

/**
 * Remove all ANSI escape code sequences from text.
 * @param {string} text - Text piece from which to void all formatting.
 * @returns {string}
 */
function voidFormatting(text) {
    return text.replace(/\x1b\[\d{1,2}m/g, '');
}

/**
 * Highlight syntax of SQL-statments and log to terminal.
 * @param {string|Object} text - String of SQL-statements to highlight.
 */
function illumine(text) {
    let output,
        type = typeof text;

    // Coerce entry to string primitive capable of being altered or exit.
    if (text && (type === 'string' || type === 'object'))
        output = type === 'string' ? text : text.toString();
    else
        return;

    // If a given prefix should be replaced or removed, extract it before any subsequent highlights taint it.
    let __prefix;
    if (runestone.prefix && runestone.prefix.replace) {
        let match = runestone.prefix.replace.exec(output);
        if (match) {
            __prefix = match[0];
            output = output.substr(__prefix.length);
        }
    }

    // Extract delimited identifiers so no subsequent operations alter them. Mark their positions for reinsertion.
    let __identifiers = output.match(/(\[.*?\]|".*?")/g);
    if (__identifiers && __identifiers.length) {
        output = output.replace(/(\[.*?\]|".*?")/g, '⇁※↼');
    }

    if (runestone.dataTypes && runestone.dataTypes.sequence) {
        for (let i = 0; i < dataTypes.length; i++) {
            let regex = new RegExp('\\b' + dataTypes[i] + '\\b' + '(?![\'"\\]])', 'gi');
            output = output.replace(regex, runestone.dataTypes.sequence + dataTypes[i] + ANSIModes.reset);
        }
    }

    if (runestone.standardKeywords && runestone.standardKeywords.sequence) {
        for (let i = 0; i < standardKeywords.length; i++) {
            let regex = new RegExp('\\b' + standardKeywords[i] + '\\b' + '(?![\'"\\]])', 'gi');
            output = output.replace(regex, runestone.standardKeywords.sequence + standardKeywords[i] + ANSIModes.reset);
        }
    }

    if (runestone.lesserKeywords && runestone.lesserKeywords.sequence) {
        for (let i = 0; i < lesserKeywords.length; i++) {
            let regex = new RegExp('\\b' + lesserKeywords[i] + '\\b' + '(?![\'"\\]])', 'gi');
            output = output.replace(regex, runestone.lesserKeywords.sequence + lesserKeywords[i] + ANSIModes.reset);
        }
    }

    if (runestone.numbers && runestone.numbers.sequence) {
        output = output.replace(/((\d+\.{1}){0,1}(\d+)(?![a-z\x1b]))(?!\d)/gi, runestone.numbers.sequence + '$1' + ANSIModes.reset);
    }

    if (runestone.operators && runestone.operators.sequence) {
        output = output.replace(/(\+|-|\*|\/|%|&|\||\^|=|>|<)+/g, runestone.operators.sequence + '$&' + ANSIModes.reset);
    }

    // If delimited identifiers were found and extracted, reinsert them on the marked positions.
    if (__identifiers && __identifiers.length) {
        for (let i of __identifiers) {
            // If delimited identifiers were to be formatted, apply the provided style.
            if (runestone.delimitedIdentifiers && runestone.delimitedIdentifiers.sequence)
                output = output.replace('⇁※↼', runestone.delimitedIdentifiers.sequence + i + ANSIModes.reset);
            else
                output = output.replace('⇁※↼', i);
        }
    }

    if (runestone.constants && runestone.constants.sequence) {
        output = output.replace(/('.*?')/g, (match) => {
            return runestone.constants.sequence + voidFormatting(match) + ANSIModes.reset;
        });
    }
    // Constants are to be formatted as a whole and no other format should exist inside them. Void any that could have been applied.
    else {
        output = output.replace(/('.*?')/g, (match) => {
            return voidFormatting(match);
        });
    }

    // If the given prefix was found and a replacement pattern was provided, substitute it.
    if (__prefix && runestone.prefix.text) {
        output = __prefix + output;
        output = output.replace(__prefix, runestone.prefix.sequence + runestone.prefix.text + ANSIModes.reset);
    }
    // If only the prefix text was provided, append it.
    else if (runestone.prefix && runestone.prefix.text && !runestone.prefix.replace) {
        output = runestone.prefix.sequence + runestone.prefix.text + ANSIModes.reset + output;
    }

    if (runestone.postfix && runestone.postfix.text) {
        output = output + runestone.postfix.sequence + runestone.postfix.text + ANSIModes.reset;
    }

    return runestone.output(output);
}

/**
 * Create logger.
 * @param {any} [options] - Custom format rules.
 * @returns {function} - Syntax highlighter and logging function.
 */
function igniculus(options) {

    /* Draft all format sequences from the provided or default
     * configuration and save them.
     */
    runestone = options || defaults;

    if (runestone.constants) {
        runestone.constants.sequence = forgeANSISequence(runestone.constants);
    }

    if (runestone.delimitedIdentifiers) {
        runestone.delimitedIdentifiers.sequence = forgeANSISequence(runestone.delimitedIdentifiers);
    }

    if (runestone.numbers) {
        runestone.numbers.sequence = forgeANSISequence(runestone.numbers);
    }

    if (runestone.operators) {
        runestone.operators.sequence = forgeANSISequence(runestone.operators);
    }

    if (runestone.dataTypes) {
        if (Array.isArray(runestone.dataTypes.types))
            dataTypes = runestone.dataTypes.types;
        else
            dataTypes = defaultDataTypes.slice();

        runestone.dataTypes.sequence = forgeANSISequence(runestone.dataTypes);
    }

    if (runestone.standardKeywords) {
        if (Array.isArray(runestone.standardKeywords.keywords))
            standardKeywords = runestone.standardKeywords.keywords;
        else
            standardKeywords = defaultStandardKeywords.slice();

        runestone.standardKeywords.sequence = forgeANSISequence(runestone.standardKeywords);
    }

    if (runestone.lesserKeywords) {
        if (Array.isArray(runestone.lesserKeywords.keywords))
            lesserKeywords = runestone.lesserKeywords.keywords;
        else
            lesserKeywords = defaultLesserKeywords.slice();

        runestone.lesserKeywords.sequence = forgeANSISequence(runestone.lesserKeywords);
    }

    if (runestone.prefix) {
        runestone.prefix.sequence = forgeANSISequence(runestone.prefix);

        /* If prefix should replace a given pattern and that pattern is a string,
         * escape it so it can be passed to the RegExp constructor.
         */
        if (runestone.prefix.replace && typeof runestone.prefix.replace === 'string') {
            runestone.prefix.replace = runestone.prefix.replace.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
            runestone.prefix.replace = new RegExp('^' + runestone.prefix.replace, 'i');
        }
    }

    if (runestone.postfix) {
        runestone.postfix.sequence = forgeANSISequence(runestone.postfix);
    }

    if (typeof runestone.output !== 'function') {
        runestone.output = console.log;
    }

    return illumine;
}

module.exports = igniculus;
module.exports.log = illumine;
