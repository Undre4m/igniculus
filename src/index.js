'use strict';

const ansi = require('./ansi');
const proxy = require('./style');

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
function union(...arrays) {
    return [...new Set([].concat(...arrays))];
}

/**
 * Compares and orders keywords by descending amount of individual words
 * @returns {number}
 */
function descendingCompositeOrder(v, nv) {
    return (nv.match(/\S+/g) || []).length - (v.match(/\S+/g) || []).length;
}

/**
 * Creates, refines and streamlines an array of reserved words
 * @param {string[]} [array=[]] - The base array of reserved words
 * @param {string[]} [include=[]] - Reserved words that should be contained in the resulting array
 * @param {string[]} [exclude=[]] - Reserved words that should not be contained in the resulting array
 * @returns {string[]}
 */
function refineReservedWords(array = [], include = [], exclude = []) {
    const inc = include.map(rw => rw.toUpperCase());
    const exc = exclude.map(rw => rw.toUpperCase());

    return union(
        array
            .concat(inc)
            .filter(rw => !exc.includes(rw))
            .sort(descendingCompositeOrder)
    );
}

const defaultDataTypes = union(sql92.defaultDataTypes, tsql.defaultDataTypes);

const defaultStandardKeywords = ['ACTION', 'ADD', 'AFTER', 'ALTER', 'AUTHORIZATION', 'BEFORE', 'BEGIN', 'BREAK', 'BY', 'CASCADE', 'CASE', 'CHECK', 'CHECKPOINT', 'CLOSE', 'COLUMN', 'COMMIT', 'CONSTRAINT', 'CONTINUE', 'CREATE', 'CROSS', 'CURSOR', 'DATABASE', 'DECLARE', 'DEFAULT', 'DELETE', 'DISTINCT', 'DROP', 'EACH', 'ELSE', 'ELSEIF', 'END', 'EXCEPT', 'EXEC', 'EXECUTE', 'EXIT', 'FETCH', 'FIRST', 'FOR', 'FOREIGN', 'FROM', 'FULL', 'FUNCTION', 'GO', 'GRANT', 'GROUP', 'HAVING', 'IDENTITY', 'IF', 'INDEX', 'INNER', 'INSERT', 'INTERSECT', 'INTO', 'JOIN', 'KEY', 'LEFT', 'LIMIT', 'LAST', 'LOOP', 'MERGE', 'MODIFY', 'NEXT', 'NO', 'OFFSET', 'ON', 'OPEN', 'ORDER', 'OUTER', 'PRIMARY', 'PROC', 'PROCEDURE', 'REFERENCES', 'RELATIVE', 'REPLACE', 'RETURN', 'RETURNS', 'REVOKE', 'RIGHT', 'ROLLBACK', 'ROW', 'ROWS', 'SAVE', 'SCHEMA', 'SELECT', 'SET', 'TABLE', 'THEN', 'TOP', 'TRAN', 'TRANSACTION', 'TRIGGER', 'TRUNCATE', 'UNION', 'UNIQUE', 'UPDATE', 'USE', 'USING', 'VALUES', 'VIEW', 'WHEN', 'WHERE', 'WHILE', 'WITH', 'WITHOUT'];

const defaultLesserKeywords = ['ALL', 'AND', 'ANY', 'AS', 'ASC', 'AVG', 'BETWEEN', 'COLLATE', 'COUNT', 'DESC', 'ESCAPE', 'EXISTS', 'FALSE', 'IN', 'IS', 'LIKE', 'MAX', 'MIN', 'NOT', 'NULL', 'OR', 'SOME', 'SUM', 'TO', 'TRUE'];

let dataTypes = defaultDataTypes.slice().sort(descendingCompositeOrder);
let standardKeywords = defaultStandardKeywords.slice().sort(descendingCompositeOrder);
let lesserKeywords = defaultLesserKeywords.slice().sort(descendingCompositeOrder);

const defaults = {
    rules: {
        comments: {
            style: { mode: ['dim'], fg: 'white' }
        },
        constants: {
            style: { mode: ['dim'], fg: 'red' }
        },
        delimitedIdentifiers: {
            style: { mode: ['dim'], fg: 'yellow' }
        },
        variables: {
            style: { mode: ['dim'], fg: 'magenta' }
        },
        dataTypes: {
            style: { mode: ['dim'], fg: 'green' },
            casing: 'uppercase'
        },
        standardKeywords: {
            style: { mode: ['dim'], fg: 'cyan' },
            casing: 'uppercase'
        },
        lesserKeywords: {
            style: { mode: ['bold'], fg: 'black' },
            casing: 'uppercase'
        },
        prefix: {
            replace: /^.*?: /
        }
    }
};

let runestone;

/**
 * Highlight syntax of SQL-statments and log to terminal.
 * @param {string|Object} text - String of SQL-statements to highlight.
 */
function illumine(text) {
    const { rules = {}, own = {} } = runestone;

    const reset = ansi.modes.reset;

    let output,
        type = typeof text;

    // Coerce entry to string primitive capable of being altered or exit.
    if (text && (type === 'string' || (type === 'object' && text.toString)))
        output = type === 'string' ? text : text.toString();
    else
        return;

    // If a given prefix should be replaced or removed, extract it before any subsequent highlights taint it.
    let __prefix;
    if (rules.prefix && rules.prefix.replace) {
        let match = rules.prefix.replace.exec(output);
        if (match) {
            __prefix = match[0];
            output = output.substr(__prefix.length);
        }
    }

    let __archetypes = {};

    for (const key of Object.keys(own)) {
        const rule = own[key];

        // Extract custom-built archetypes so no subsequent operations alter them. Mark their positions for reinsertion.
        __archetypes[key] = output.match(rule.regexp);
        if (__archetypes[key] && __archetypes[key].length) {
            output = output.replace(rule.regexp, '⥂_' + key + '⥄');
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

    if (rules.dataTypes && (rules.dataTypes.sequence || rules.dataTypes.casing)) {
        let regex = new RegExp('\\b' + '(' + dataTypes.join('|') + ')' + '\\b' + '(?![\'"\\]])', 'gi');
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
        let regex = new RegExp('\\b' + '(' + standardKeywords.join('|') + ')' + '\\b' + '(?![\'"\\]])', 'gi');
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
        let regex = new RegExp('\\b' + '(' + lesserKeywords.join('|') + ')' + '\\b' + '(?![\'"\\]])', 'gi');
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
        for (let i of __comments) {
            // If comment sections were to be formatted, apply the provided style.
            if (rules.comments && rules.comments.sequence)
                output = output.replace('⥤※⥢', rules.comments.sequence + 'c†s' + i + 'c‡e' + reset);
            else
                output = output.replace('⥤※⥢', 'c†s' + i + 'c‡e');
        }
    }

    // If local variables were found and extracted, reinsert them on the marked positions.
    if (__variables && __variables.length) {
        for (let i of __variables) {
            // If local variables were to be formatted, apply the provided style.
            if (rules.variables && rules.variables.sequence)
                output = output.replace('↪※↩', rules.variables.sequence + i + reset);
            else
                output = output.replace('↪※↩', i);
        }
    }

    // If constants were found and extracted, reinsert them on the marked positions.
    if (__constants && __constants.length) {
        for (let i of __constants) {
            // If constants were to be formatted, apply the provided style.
            if (rules.constants && rules.constants.sequence)
                output = output.replace('⇝※⇜', rules.constants.sequence + i + reset);
            else
                output = output.replace('⇝※⇜', i);
        }
    }

    // If delimited identifiers were found and extracted, reinsert them on the marked positions.
    if (__identifiers && __identifiers.length) {
        for (let i of __identifiers) {
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
                    output = output.replace('⥂_' + key + '⥄', rule.sequence + re + reset);
                else
                    output = output.replace('⥂_' + key + '⥄', re);
            }
        }
    }

    // Constants are to be formatted as a whole and no other format should exist inside them. Void any that could have been applied.
    output = output.replace(/('.*?')/g, (match) => {
        return ansi.voidFormatting(match);
    });

    // Comment sections are to be formatted as a whole and no other format should exist inside them. Void any that could have been applied and remove cordon.
    output = output.replace(/(c†s)((-{2}.*)|(\/\*(.|[\r\n])*?\*\/))(c‡e)/g, (match, p1, p2) => {
        return ansi.voidFormatting(p2);
    });

    // If the given prefix was found and a replacement pattern was provided, substitute it.
    if (__prefix && typeof rules.prefix.text === 'string') {
        output = __prefix + output;
        output = output.replace(__prefix, rules.prefix.sequence ?
            rules.prefix.sequence + rules.prefix.text + reset :
            rules.prefix.text
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
        output = output + (rules.postfix.sequence ?
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
    'postfix'
];

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

    const { rules, own } = runestone;

    if (rules) {
        for (const name of Object.keys(rules)) {
            const style = rules[name].style;

            if (style) {
                rules[name].sequence = ansi.forgeSequence(
                    // If using proxy builder pass style parameters as object
                    style instanceof proxy.constructor ? style.style : style
                );
            }
        }

        if (rules.dataTypes) {
            const { types, casing } = rules.dataTypes;

            if (Array.isArray(types))
                dataTypes = types.slice().sort(descendingCompositeOrder);

            else if (types && (types.hasOwnProperty('include') || types.hasOwnProperty('exclude')))
                dataTypes = refineReservedWords(defaultDataTypes,
                    Array.isArray(types.include) ? types.include : undefined,
                    Array.isArray(types.exclude) ? types.exclude : undefined
                );

            else
                dataTypes = defaultDataTypes.slice().sort(descendingCompositeOrder);

            if (typeof casing !== 'string' || (casing !== 'lowercase' && casing !== 'uppercase'))
                delete rules.dataTypes.casing;
        }

        if (rules.standardKeywords) {
            const { keywords, casing } = rules.standardKeywords;

            if (Array.isArray(keywords))
                standardKeywords = keywords.slice().sort(descendingCompositeOrder);

            else if (keywords && (keywords.hasOwnProperty('include') || keywords.hasOwnProperty('exclude')))
                standardKeywords = refineReservedWords(defaultStandardKeywords,
                    Array.isArray(keywords.include) ? keywords.include : undefined,
                    Array.isArray(keywords.exclude) ? keywords.exclude : undefined
                );

            else
                standardKeywords = defaultStandardKeywords.slice().sort(descendingCompositeOrder);

            if (typeof casing !== 'string' || (casing !== 'lowercase' && casing !== 'uppercase'))
                delete rules.standardKeywords.casing;
        }

        if (rules.lesserKeywords) {
            const { keywords, casing } = rules.lesserKeywords;

            if (Array.isArray(keywords))
                lesserKeywords = keywords.slice().sort(descendingCompositeOrder);

            else if (keywords && (keywords.hasOwnProperty('include') || keywords.hasOwnProperty('exclude')))
                lesserKeywords = refineReservedWords(defaultLesserKeywords,
                    Array.isArray(keywords.include) ? keywords.include : undefined,
                    Array.isArray(keywords.exclude) ? keywords.exclude : undefined
                );

            else
                lesserKeywords = defaultLesserKeywords.slice().sort(descendingCompositeOrder);

            if (typeof casing !== 'string' || (casing !== 'lowercase' && casing !== 'uppercase'))
                delete rules.lesserKeywords.casing;
        }

        /* If prefix should replace a given pattern and that pattern is a string,
         * escape it so it can be passed to the RegExp constructor.
         */
        if (rules.prefix) {
            if (rules.prefix.replace && typeof rules.prefix.replace === 'string') {
                rules.prefix.replace = rules.prefix.replace.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
                rules.prefix.replace = new RegExp('^' + rules.prefix.replace, 'i');
            }
        }
    }

    if (own) {
        for (const name of Object.keys(own)) {
            const style = own[name].style;

            if (style) {
                own[name].sequence = ansi.forgeSequence(
                    // If using proxy builder pass style parameters as object
                    style instanceof proxy.constructor ? style.style : style
                );
            }
        }
    }

    if (typeof runestone.output !== 'function') {
        runestone.output = console.log;
    }

    return illumine;
}

module.exports = igniculus;
module.exports.log = illumine;
module.exports.nox = proxy;