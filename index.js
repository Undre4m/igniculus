'use strict';

/* SQL-92 standard data types and keywords
 * http://www.frontbase.com/docs/5.3.html
 */
const sql92 = {
    defaultDataTypes: ['SMALLINT', 'INTEGER', 'INT', 'NUMERIC', 'DECIMAL', 'DEC', 'FLOAT', 'REAL', 'DOUBLE PRECISION', 'CHARACTER', 'CHAR', 'NCHAR', 'VARCHAR', 'BIT', 'DATE', 'TIME', 'TIMESTAMP', 'INTERVAL', 'NATIONAL', 'VARYING', 'TIME ZONE']
};

/* Oracle data types
 * https://docs.oracle.com/en/database/oracle/oracle-database/18/sqlrf/Data-Types.html#GUID-7B72E154-677A-4342-A1EA-C74C1EA928E6
 */
const oracle = {
    defaultDataTypes: ['VARCHAR2', 'NVARCHAR2', 'NUMBER', 'FLOAT', 'LONG', 'DATE', 'BINARY_FLOAT', 'BINARY_DOUBLE', 'TIMESTAMP', 'INTERVAL', 'RAW', 'ROWID', 'UROWID', 'CHAR', 'NCHAR', 'CLOB', 'NCLOB', 'BLOB', 'BFILE', 'BYTE', 'LOCAL', 'TIME ZONE']
};

/* T-SQL data types and keywords
 * https://docs.microsoft.com/en-us/sql/t-sql/data-types/data-types-transact-sql?view=sql-server-2017
 */
const tsql = {
    defaultDataTypes: ['BIGINT', 'NUMERIC', 'BIT', 'SMALLINT', 'DECIMAL', 'SMALLMONEY', 'INT', 'TINYINT', 'MONEY', 'FLOAT', 'REAL', 'DATE', 'DATETIMEOFFSET', 'DATETIME2', 'SMALLDATETIME', 'DATETIME', 'TIME', 'CHAR', 'VARCHAR', 'TEXT', 'NCHAR', 'NVARCHAR', 'NTEXT', 'BINARY', 'VARBINARY', 'IMAGE', 'GEOMETRY', 'GEOGRAPHY', 'UNIQUEIDENTIFIER', 'XML']
};

/* PostgreSQL data types and keywords
 * https://www.postgresql.org/docs/10/static/datatype.html
 */
const postgresql = {
    defaultDataTypes: ['SMALLINT', 'INTEGER', 'BIGINT', 'DECIMAL', 'NUMERIC', 'REAL', 'DOUBLE PRECISION', 'SMALLSERIAL', 'SERIAL', 'BIGSERIAL', 'MONEY', 'CHAR', 'CHARACTER', 'VARCHAR', 'TEXT', 'BYTEA', 'TIMESTAMP', 'TIMESTAMPTZ', 'DATE', 'TIME', 'INTERVAL', 'BOOLEAN', 'ENUM', 'POINT', 'LINE', 'LSEG', 'BOX', 'PATH', 'POLYGON', 'CIRCLE', 'CIDR', 'INET', 'MACADDR', 'MACADDR8', 'BIT', 'UUID', 'XML', 'JSON', 'JSONB', 'TSQUERY', 'TSVECTOR', 'INT4RANGE', 'INT8RANGE', 'NUMRANGE', 'TSRANGE', 'TSTZRANGE', 'DATERANGE', 'ARRAY', 'TIME ZONE']
};

/* MariaDB data types and keywords
 * https://mariadb.com/kb/en/library/data-types
 */
const mariadb = {
    defaultDataTypes: ['TINYINT', 'BOOLEAN', 'SMALLINT', 'MEDIUMINT', 'INT', 'INTEGER', 'BIGINT', 'DECIMAL', 'DEC', 'NUMERIC', 'FIXED', 'FLOAT', 'DOUBLE', 'DOUBLE PRECISION', 'REAL', 'BIT', 'CHAR', 'VARCHAR', 'BINARY', 'CHAR BYTE', 'VARBINARY', 'TINYBLOB', 'BLOB', 'MEDIUMBLOB', 'LONGBLOB', 'TINYTEXT', 'TEXT', 'MEDIUMTEXT', 'LONGTEXT', 'JSON', 'ENUM', 'SET', 'ROW', 'DATE', 'TIME', 'DATETIME', 'TIMESTAMP', 'YEAR', 'POINT', 'LINESTRING', 'POLYGON', 'MULTIPOINT', 'MULTILINESTRING', 'MULTIPOLYGON', 'GEOMETRYCOLLECTION', 'GEOMETRY']
};

/**
 * Creates an array of unique values
 * @param {...Array} [arrays]
 * @returns {Array}
 */
/* Incompatible with current node version
 * Bump version on 2.0 release
 *
 * function union(...arrays) {
 *     return [...new Set([].concat(...arrays))];
 * }
 */
function union() {
    let array = [];
    for (let arg of arguments)
        for (let item of arg)
            if (!~array.indexOf(item))
                array.push(item);

    return array;
}

/**
 * Moves all compound keywords to the front of the array
 * @param {string[]} array - Array of keywords to mutate
 * @returns {string[]}
 */
function unshiftCompoundKeywords(array) {
    for (let i = array.length - 1; i >= 0; i--) {
        const word = array[i];

        if (/\w+\s\w+/.test(word))
            array.unshift(array.splice(i, 1)[0]);
    }

    return array;
}

const defaultDataTypes = unshiftCompoundKeywords(union(sql92.defaultDataTypes, tsql.defaultDataTypes));

const defaultStandardKeywords = ['ACTION', 'ADD', 'AFTER', 'ALTER', 'AUTHORIZATION', 'BEFORE', 'BEGIN', 'BREAK', 'BY', 'CASCADE', 'CASE', 'CHECK', 'CHECKPOINT', 'CLOSE', 'COLUMN', 'COMMIT', 'CONSTRAINT', 'CONTINUE', 'CREATE', 'CROSS', 'CURSOR', 'DATABASE', 'DECLARE', 'DEFAULT', 'DELETE', 'DISTINCT', 'DROP', 'EACH', 'ELSE', 'ELSEIF', 'END', 'EXCEPT', 'EXEC', 'EXECUTE', 'EXIT', 'FETCH', 'FIRST', 'FOR', 'FOREIGN', 'FROM', 'FULL', 'FUNCTION', 'GO', 'GRANT', 'GROUP', 'HAVING', 'IDENTITY', 'IF', 'INDEX', 'INNER', 'INSERT', 'INTERSECT', 'INTO', 'JOIN', 'KEY', 'LEFT', 'LIMIT', 'LAST', 'LOOP', 'MERGE', 'MODIFY', 'NEXT', 'NO', 'OFFSET', 'ON', 'OPEN', 'ORDER', 'OUTER', 'PRIMARY', 'PROC', 'PROCEDURE', 'REFERENCES', 'RELATIVE', 'REPLACE', 'RETURN', 'RETURNS', 'REVOKE', 'RIGHT', 'ROLLBACK', 'ROW', 'ROWS', 'SAVE', 'SCHEMA', 'SELECT', 'SET', 'TABLE', 'THEN', 'TOP', 'TRAN', 'TRANSACTION', 'TRIGGER', 'TRUNCATE', 'UNION', 'UNIQUE', 'UPDATE', 'USE', 'USING', 'VALUES', 'VIEW', 'WHEN', 'WHERE', 'WHILE', 'WITH', 'WITHOUT'];

const defaultLesserKeywords = ['ALL', 'AND', 'ANY', 'AS', 'ASC', 'AVG', 'BETWEEN', 'COLLATE', 'COUNT', 'DESC', 'ESCAPE', 'EXISTS', 'IN', 'IS', 'LIKE', 'MAX', 'MIN', 'NOT', 'NULL', 'OR', 'SOME', 'SUM', 'TO'];

let dataTypes = defaultDataTypes.slice();
let standardKeywords = defaultStandardKeywords.slice();
let lesserKeywords = defaultLesserKeywords.slice();

const ANSIModes = {
    reset:         '\x1b[0m',
    bold:          '\x1b[1m',
    dim:           '\x1b[2m',
    italic:        '\x1b[3m',
    underline:     '\x1b[4m',
    blink:         '\x1b[5m',
    inverse:       '\x1b[7m',
    hidden:        '\x1b[8m',
    strikethrough: '\x1b[9m'
};

const ANSIColours = {
    fg: {
        black:     '\x1b[30m',
        red:       '\x1b[31m',
        green:     '\x1b[32m',
        yellow:    '\x1b[33m',
        blue:      '\x1b[34m',
        magenta:   '\x1b[35m',
        cyan:      '\x1b[36m',
        white:     '\x1b[37m'
    },
    bg: {
        black:     '\x1b[40m',
        red:       '\x1b[41m',
        green:     '\x1b[42m',
        yellow:    '\x1b[43m',
        blue:      '\x1b[44m',
        magenta:   '\x1b[45m',
        cyan:      '\x1b[46m',
        white:     '\x1b[47m'
    }
};

const defaults = {
    comments:               { mode: 'dim', fg: 'white' },
    constants:              { mode: 'dim', fg: 'red' },
    delimitedIdentifiers:   { mode: 'dim', fg: 'yellow' },
    variables:              { mode: 'dim', fg: 'magenta' },
    dataTypes:              { mode: 'dim', fg: 'green', casing: 'uppercase' },
    standardKeywords:       { mode: 'dim', fg: 'cyan', casing: 'uppercase' },
    lesserKeywords:         { mode: 'bold', fg: 'black', casing: 'uppercase' },
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

    let __archetypes = {};

    if (runestone.own) {
        for (const key of Object.keys(runestone.own)) {
            const rule = runestone.own[key];

            // Extract custom-built archetypes so no subsequent operations alter them. Mark their positions for reinsertion.
            __archetypes[key] = output.match(rule.regexp);
            if (__archetypes[key] && __archetypes[key].length) {
                output = output.replace(rule.regexp, '⥂_' + key + '⥄');
            }
        }
    }

    // Extract delimited identifiers so no subsequent operations alter them. Mark their positions for reinsertion.
    let __identifiers = output.match(/(\[.*?\]|".*?")/g);
    if (__identifiers && __identifiers.length) {
        output = output.replace(/(\[.*?\]|".*?")/g, '⇁※↼');
    }

    // Extract constants so no subsequent operations alter them. Mark their positions for reinsertion.
    let __constants = output.match(/('.*?')/g);
    if (__constants && __constants.length) {
        output = output.replace(/('.*?')/g, '⇝※⇜');
    }

    // Extract local variables so no subsequent operations alter them. Mark their positions for reinsertion.
    let __variables = output.match(/(\B@[@#$_\w\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u00ff\u0100-\u017f\u0180-\u024f]*)/g);
    if (__variables && __variables.length) {
        output = output.replace(/(\B@[@#$_\w\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u00ff\u0100-\u017f\u0180-\u024f]*)/g, '↪※↩');
    }

    // Extract comment sections so no subsequent operations alter them. Mark their positions for reinsertion.
    let __comments = output.match(/(-{2}.*)|(\/\*(.|[\r\n])*?\*\/)/g);
    if (__comments && __comments.length) {
        output = output.replace(/(-{2}.*)|(\/\*(.|[\r\n])*?\*\/)/g, '⥤※⥢');
    }

    if (runestone.dataTypes && runestone.dataTypes.sequence) {
        let regex = new RegExp('\\b' + '(' + dataTypes.join('|') + ')' + '\\b' + '(?![\'"\\]])', 'gi');
        output = output.replace(regex, (match, g1) => {
            let word = g1;

            const casing = runestone.dataTypes.casing;
            if (typeof casing === 'string' && (casing === 'lowercase' || casing === 'uppercase'))
                word = casing === 'lowercase' ? word.toLowerCase() : word.toUpperCase();

            return runestone.dataTypes.sequence + word + ANSIModes.reset;
        });
    }

    if (runestone.standardKeywords && runestone.standardKeywords.sequence) {
        let regex = new RegExp('\\b' + '(' + standardKeywords.join('|') + ')' + '\\b' + '(?![\'"\\]])', 'gi');
        output = output.replace(regex, (match, g1) => {
            let word = g1;

            const casing = runestone.standardKeywords.casing;
            if (typeof casing === 'string' && (casing === 'lowercase' || casing === 'uppercase'))
                word = casing === 'lowercase' ? word.toLowerCase() : word.toUpperCase();

            return runestone.standardKeywords.sequence + word + ANSIModes.reset;
        });
    }

    if (runestone.lesserKeywords && runestone.lesserKeywords.sequence) {
        let regex = new RegExp('\\b' + '(' + lesserKeywords.join('|') + ')' + '\\b' + '(?![\'"\\]])', 'gi');
        output = output.replace(regex, (match, g1) => {
            let word = g1;

            const casing = runestone.lesserKeywords.casing;
            if (typeof casing === 'string' && (casing === 'lowercase' || casing === 'uppercase'))
                word = casing === 'lowercase' ? word.toLowerCase() : word.toUpperCase();

            return runestone.lesserKeywords.sequence + word + ANSIModes.reset;
        });
    }

    if (runestone.numbers && runestone.numbers.sequence) {
        output = output.replace(/((\d+\.{1}){0,1}(\d+)(?![a-z\x1b]))(?!\d)/gi, runestone.numbers.sequence + '$1' + ANSIModes.reset);
    }

    if (runestone.operators && runestone.operators.sequence) {
        output = output.replace(/(\+|-|\*|\/|%|&|\||\^|=|>|<)+/g, runestone.operators.sequence + '$&' + ANSIModes.reset);
    }

    // If comment sections were found and extracted, reinsert them on the marked positions and cordon off the area for reference.
    if (__comments && __comments.length) {
        for (let i of __comments) {
            // If comment sections were to be formatted, apply the provided style.
            if (runestone.comments && runestone.comments.sequence)
                output = output.replace('⥤※⥢', runestone.comments.sequence + 'c†s' + i + 'c‡e' + ANSIModes.reset);
            else
                output = output.replace('⥤※⥢', 'c†s' + i + 'c‡e');
        }
    }

    // If local variables were found and extracted, reinsert them on the marked positions.
    if (__variables && __variables.length) {
        for (let i of __variables) {
            // If local variables were to be formatted, apply the provided style.
            if (runestone.variables && runestone.variables.sequence)
                output = output.replace('↪※↩', runestone.variables.sequence + i + ANSIModes.reset);
            else
                output = output.replace('↪※↩', i);
        }
    }

    // If constants were found and extracted, reinsert them on the marked positions.
    if (__constants && __constants.length) {
        for (let i of __constants) {
            // If constants were to be formatted, apply the provided style.
            if (runestone.constants && runestone.constants.sequence)
                output = output.replace('⇝※⇜', runestone.constants.sequence + i + ANSIModes.reset);
            else
                output = output.replace('⇝※⇜', i);
        }
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

    if (runestone.own) {
        for (const key of Object.keys(runestone.own).reverse()) {
            const rule = runestone.own[key];

            // If custom-built archetypes were found and extracted, reinsert them on the marked positions.
            if (__archetypes[key] && __archetypes[key].length) {
                for (let i of __archetypes[key]) {
                    let re = i;

                    if (typeof rule.transform === 'string')
                        re = rule.transform;
                    else if (typeof rule.transform === 'function')
                        re = rule.transform(i);

                    // Prevent back-reference
                    re = re.replace(/\$/g,'$$$');

                    // If custom-built archetypes were to be formatted, apply the provided style.
                    if (rule && rule.sequence)
                        output = output.replace('⥂_' + key + '⥄', rule.sequence + re + ANSIModes.reset);
                    else
                        output = output.replace('⥂_' + key + '⥄', re);
                }
            }
        }
    }

    // Constants are to be formatted as a whole and no other format should exist inside them. Void any that could have been applied.
    output = output.replace(/('.*?')/g, (match) => {
        return voidFormatting(match);
    });

    // Comment sections are to be formatted as a whole and no other format should exist inside them. Void any that could have been applied and remove cordon.
    output = output.replace(/(c†s)((-{2}.*)|(\/\*(.|[\r\n])*?\*\/))(c‡e)/g, (match, p1, p2) => {
        return voidFormatting(p2);
    });

    // If the given prefix was found and a replacement pattern was provided, substitute it.
    if (__prefix && typeof runestone.prefix.text === 'string') {
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

    if (runestone.comments) {
        runestone.comments.sequence = forgeANSISequence(runestone.comments);
    }

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

    if (runestone.variables) {
        runestone.variables.sequence = forgeANSISequence(runestone.variables);
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

    if (runestone.own) {
        for (const key of Object.keys(runestone.own)) {
            const rule = runestone.own[key];

            rule.sequence = forgeANSISequence(rule);
        }
    }

    if (typeof runestone.output !== 'function') {
        runestone.output = console.log;
    }

    return illumine;
}

module.exports = igniculus;
module.exports.log = illumine;