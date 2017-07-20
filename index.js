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
        numbers:                { mode: 'bright', fg: 'cyan' },
        operators:              { mode: 'bright', fg: 'magenta' },
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
    function voidFormmating(text) {
        return text.replace(/\x1b\[\d{1,2}m/g, '');
    }

    ((opts) => {
        let sequence;

        if (options.constants) {
            options.constants.sequence = forgeANSISequence(options.constants);
        }

        if (options.delimitedIdentifiers) {
            options.delimitedIdentifiers.sequence = forgeANSISequence(options.delimitedIdentifiers);
        }

        if (options.numbers) {
            options.numbers.sequence = forgeANSISequence(options.numbers);
        }

        if (options.operators) {
            options.operators.sequence = forgeANSISequence(options.operators);
        }

        if (options.dataTypes) {
            options.dataTypes.sequence = forgeANSISequence(options.dataTypes);
        }

        if (options.keywords) {
            options.keywords.sequence = forgeANSISequence(options.keywords);
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

    })(options);

    return function SqlSyntaxHighlighter(text) {
        // Coerce entry to string primitive capable of being altered.
        let output = text.toString();

        // If a given prefix should be replaced or removed, extract it before any subsequent highlights taint it.
        let prefixMatched;
        if (options.prefix && options.prefix.replace) {
            let match = options.prefix.replace.exec(output);
            if (match) {
                prefixMatched = match[0];
                output = output.substr(prefixMatched.length);
            }
        }

        if (options.delimitedIdentifiers && options.delimitedIdentifiers.sequence) {
            output = output.replace(/(\[.*?\]|".*?")/g, options.delimitedIdentifiers.sequence + '$1' + ANSIModes.reset);
        }

        if (options.dataTypes && options.dataTypes.sequence) {
            for (let i = 0; i < dataTypes.length; i++) {
                let regex = new RegExp('\\b' + dataTypes[i] + '\\b', 'gi');
                output = output.replace(regex, options.dataTypes.sequence + dataTypes[i] + ANSIModes.reset);
            }
        }

        if (options.keywords && options.keywords.sequence) {
            for (let i = 0; i < keywords.length; i++) {
                let regex = new RegExp('\\b' + keywords[i] + '\\b', 'gi');
                output = output.replace(regex, options.keywords.sequence + keywords[i] + ANSIModes.reset);
            }
        }

        if (options.numbers && options.numbers.sequence) {
            output = output.replace(/((\d+\.{1}){0,1}(\d+)(?![a-z\x1b]))(?!\d)/gi, options.numbers.sequence + '$1' + ANSIModes.reset);
        }

        if (options.operators && options.operators.sequence) {
            output = output.replace(/(\+|-|\*|\/|%|&|\||\^|=|>|<)+/g, options.operators.sequence + '$1' + ANSIModes.reset);
        }

        if (options.constants && options.constants.sequence) {
            output = output.replace(/('.*?')/g, (match) => {
                return options.constants.sequence + voidFormmating(match) + ANSIModes.reset;
            });
        }

        // If the given prefix was found and a replacement pattern was provided, substitute it.
        if (prefixMatched && options.prefix.text) {
            output = prefixMatched + output;
            output = output.replace(prefixMatched, options.prefix.sequence + options.prefix.text + ANSIModes.reset);
        }
        // If only the prefix text was provided, append it.
        else if (options.prefix && options.prefix.text && !options.prefix.replace) {
            output = options.prefix.sequence + options.prefix.text + ANSIModes.reset + output;
        }

        console.log(output);
    };
};