'use strict';

const modes = {
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

const colors = {
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

/**
 * Forge ANSI escape code sequence for text formatting.
 * @param {Object} style - Object which defines formatting for a particular rule.
 * @returns {string}
 */
function forgeSequence(style) {
    let mode, fg, bg;

    mode = []
        .concat(style.mode || [])
        .filter(m => modes[m]).map(m => modes[m])
        .sort().join('');

    fg = (style.fg && colors.fg[style.fg]) ? colors.fg[style.fg] : '';
    bg = (style.bg && colors.bg[style.bg]) ? colors.bg[style.bg] : '';

    return mode + bg + fg;
}

/**
 * Remove all ANSI escape code sequences from text.
 * @param {string} text - Text piece from which to void all formatting.
 * @returns {string}
 */
function voidFormatting(text) {
    return text.replace(/\x1b\[\d{1,2}m/g, '');
}

module.exports = { modes, colors, forgeSequence, voidFormatting };