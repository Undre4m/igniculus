export const modes = {
    reset:         '\x1b[0m',
    bold:          '\x1b[1m',
    dim:           '\x1b[2m',
    italic:        '\x1b[3m',
    underline:     '\x1b[4m',
    blink:         '\x1b[5m',
    inverse:       '\x1b[7m',
    hidden:        '\x1b[8m',
    strikethrough: '\x1b[9m',
    fraktur:       '\x1b[20m',
    framed:        '\x1b[51m',
    encircled:     '\x1b[52m',
    overline:      '\x1b[53m'
};

export const colors = {
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
 * Compares and orders SGR (Select Graphic Rendition) parameters by ascending code
 * @returns {number}
 */
export const ascendingSGR = (a, b) => Math.sign(
    a.substring(2, a.length - 1) - b.substring(2, b.length - 1)
);

/**
 * Forge ANSI escape code sequence for text formatting.
 * @param {Object} style - Object which defines formatting for a particular rule.
 * @returns {string}
 */
export const forgeSequence = (style) => {
    const mode = []
        .concat(style.mode || [])
        .filter(m => modes[m]).map(m => modes[m])
        .sort(ascendingSGR)
        .join('');

    const bg = (style.bg && colors.bg[style.bg]) ? colors.bg[style.bg] : '';
    const fg = (style.fg && colors.fg[style.fg]) ? colors.fg[style.fg] : '';

    return mode + bg + fg;
};

/**
 * Remove all ANSI escape code sequences from text.
 * @param {string} text - Text piece from which to void all formatting.
 * @returns {string}
 */
export const voidFormatting = (text) => text.replace(/\x1b\[\d{1,2}m/g, '');
