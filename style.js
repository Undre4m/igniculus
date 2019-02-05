'use strict';

const { modes, colors } = require('./ansi');

function getToken(name) {
    if (typeof name !== 'string')
        return;

    const lname = name.toLowerCase();

    if (modes.hasOwnProperty(lname))
        return ['mode', lname];

    else if (colors.fg.hasOwnProperty(lname))
        return ['fg', lname];

    else if (lname.startsWith('fg') && colors.fg.hasOwnProperty(lname.replace('fg','')))
        return ['fg', lname.replace('fg','')];

    else if (lname.startsWith('bg') && colors.bg.hasOwnProperty(lname.replace('bg','')))
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

    fg(color) {
        this.style.fg = color;
    }

    bg(color) {
        this.style.bg = color;
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