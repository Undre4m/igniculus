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

function getToken(name) {
    if (typeof name !== 'string')
        return;

    const lname = name.toLowerCase();

    if (lname in ANSIModes)
        return ['mode', lname];

    else if (lname in ANSIColours.fg)
        return ['fg', lname];

    else if (lname.startsWith('fg') && lname.replace('fg','') in ANSIColours.fg)
        return ['fg', lname.replace('fg','')];

    else if (lname.startsWith('bg') && lname.replace('bg','') in ANSIColours.bg)
        return ['bg', lname.replace('bg','')];
}

function toggle(array, value) {
    const idx = array.indexOf(value);

    if (idx === -1)
        array.push(value);
    else
        array.splice(idx, 1);
}

class Builder {
    constructor(style = {}) {
        this.style = Object.assign({}, {
            mode: style.mode ? style.mode.slice() : [],
            fg: style.fg,
            bg: style.bg
        });
    }

    mode(mode) {
        this.style.mode = this.style.mode || [];
        toggle(this.style.mode, mode);
    }

    fg(colour) {
        this.style.fg = colour;
    }

    bg(colour) {
        this.style.bg = colour;
    }
}

function newProxy(style) {
    return new Proxy(
        new Builder(style), {
            get: function(target, name) {
                if (typeof name !== 'string')
                    return target[name];

                const token = getToken(name);

                if (token) {
                    const proxy = newProxy(target.style);
                    const [attribute, value] = token;
                    proxy[attribute](value);
                    return proxy;
                }
                else {
                    return target[name];
                }
            }
        });
}

module.exports = newProxy();