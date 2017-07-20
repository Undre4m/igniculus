'use strict';

module.exports = (opts) => {

    const dataTypes = ['BIGINT', 'NUMERIC', 'BIT', 'SMALLINT', 'DECIMAL', 'SMALLMONEY', 'INT', 'INTEGER', 'TINYINT', 'MONEY', 'FLOAT', 'REAL', 'DATE', 'DATETIMEOFFSET', 'DATETIME2', 'SMALLDATETIME', 'DATETIME', 'TIME', 'CHAR', 'VARCHAR', 'TEXT', 'NCHAR', 'NVARCHAR', 'NTEXT', 'BINARY', 'VARBINARY', 'IMAGE'];

    const keywords = ['ALL', 'AND', 'ANY', 'BETWEEN', 'RIGHT', 'IN', 'INNER', 'IS', 'JOIN', 'SOME', 'LEFT', 'LIKE', 'CROSS', 'NOT', 'NULL', 'OR', 'OUTER', 'PIVOT', 'EXISTS', 'UNPIVOT'];

    const ANSIModes = {
        reset: '\x1b[0m',
        bright: '\x1b[1m',
        dim: '\x1b[2m',
        underscore: '\x1b[4m',
        blink: '\x1b[5m',
        reverse: '\x1b[7m',
        hidden: '\x1b[8m'
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
        constants:              { mode: 'bright', fg: 'red' },
        delimitedIdentifiers:   { mode: 'bright', fg: 'yellow' },
        dataTypes:              { mode: 'dim', fg: 'green' },
        keywords:               { mode: 'bright', fg: 'black' },
        prefix:                 { mode: 'bright', fg: 'yellow', bg: 'red', replace: 'Executing (default):', text: '[SQL]' }
    };

    const options = opts || defaults;

    /**
     * Forge ANSI escape code sequence for text formatting.
     * @param {Object} rule - Object that defines the colors to use for formatting a particular rule.
     * @returns {string}
     */
    function forgeANSISequence (rule) {
        let mode, fg, bg;

        mode = (rule.mode && ANSIModes[rule.mode]) ? ANSIModes[rule.mode] : '';
        fg = (rule.fg && ANSIColours.fg[rule.fg]) ? ANSIColours.fg[rule.fg] : '';
        bg = (rule.bg && ANSIColours.bg[rule.bg]) ? ANSIColours.bg[rule.bg] : '';

        let ANSISequence = mode + bg + fg;
        return ANSISequence;
    }

    ((opts) => {
        let sequence;

        if (options.delimitedIdentifiers) {
            options.delimitedIdentifiers.sequence = forgeANSISequence(options.delimitedIdentifiers);
        }

        if (options.constants) {
            options.constants.sequence = forgeANSISequence(options.constants);
        }

        if (options.prefix) {
            options.prefix.sequence = forgeANSISequence(options.prefix);

            /* If prefix should replace a given pattern and that pattern is a string,
             * escape it so it can be passed to the RegExp constructor.
             */
            if (options.prefix.replace && typeof options.prefix.replace === 'string') {
                options.prefix.replace = options.prefix.replace.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                options.prefix.replace = new RegExp('^' + options.prefix.replace, 'i');
            }
        }

        if (options.dataTypes) {
            options.dataTypes.sequence = forgeANSISequence(options.dataTypes);
        }

        if (options.keywords) {
            options.keywords.sequence = forgeANSISequence(options.keywords);
        }

    })(options);

    return function SqlSyntaxHighlighter(text) {
        if (options.delimitedIdentifiers && options.delimitedIdentifiers.sequence) {
            text = text.replace(/(\[.*?\]|['].*?['])/g, options.delimitedIdentifiers.sequence + '$1' + ANSIModes.reset);
        }

        if (options.constants && options.constants.sequence) {
            text = text.replace(/(['].*?['])/g, options.constants.sequence + '$1' + ANSIModes.reset);
        }

        if (options.prefix) {
            text = text.replace(options.prefix.replace, options.prefix.sequence + options.prefix.text + ANSIModes.reset);
        }

        if (options.dataTypes && options.dataTypes.sequence) {
            for (let i = 0; i < dataTypes.length; i++) {
                let regex = new RegExp('\\b' + dataTypes[i] + '\\b', 'gi');
                text = text.replace(regex, options.dataTypes.sequence + dataTypes[i] + ANSIModes.reset);
            }
        }

        if (options.keywords && options.keywords.sequence) {
            for (let i = 0; i < keywords.length; i++) {
                let regex = new RegExp('\\b' + keywords[i] + '\\b', 'gi');
                text = text.replace(regex, options.keywords.sequence + keywords[i] + ANSIModes.reset);
            }
        }

        console.log(text);
    };
};