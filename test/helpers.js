'use strict';

const ava = require('ava');
const dedent = require('dedent');
const igniculus = require('../src');

const test = ava.test;

const m = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    dim: '\x1b[2m',
    italic: '\x1b[3m',
    underline: '\x1b[4m',
    blink: '\x1b[5m',
    inverse: '\x1b[7m',
    hidden: '\x1b[8m',
    strikethrough: '\x1b[9m',
    fraktur: '\x1b[20m',
    framed: '\x1b[51m',
    encircled: '\x1b[52m',
    overline: '\x1b[53m'
};

const c = {
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

const echo = { output: out => out };

const statement_a = dedent`---[ xop: 2011.04.28/09.56.21.7856 ; 331B ; 0.0329s ]---

                           ---$ st_n_erik56.s2 $---
                           create table x__dom (
                            dsig uuid         primary key
                            ,kia inet[]       not null
                            ,prt int          check (prt between 0 and 65535)
                            ,toc timestamp(6) not null default (now() at time zone 'utc')
                            ,tod timestamp(6)
                            ,ake bytea
                            ,ata smallint     not null
                           );

                           ---$ st_n_erik56.s12 $---
                           insert into x__dom values (
                            '00000000-0000-0000-0000-000000000000', array['0100::e056:ffff'::inet], 60606, '010101Z', null, E'GTDv4uLF0ufZ2dbGxWWARQ==', 0
                           ) returning *;`;

const statement_b = dedent`SELECT * FROM SalesOrders;
                           OUTPUT TO 'c:\\test\\sales.csv'
                           FORMAT TEXT
                           QUOTE '"'
                           WITH COLUMN NAMES;`;

const statement_c = dedent`create table HEROES (
                               id              bigserial primary key,
                               name            character varying(36) not null check ('' <> name),
                               aliases         character varying(36)[] not null check ('' <> all(aliases)),
                               birthyear       smallint not null,
                               birthplace      integer references PLACES(id),
                               -- STATS --
                               nobility        smallint not null default 0,
                               health          integer not null default 1,
                               mana            integer not null default 1,
                               stamina         integer not null default 1,
                               strength        integer not null default 1,
                               dexterity       integer not null default 1,
                               charisma        integer not null default 1,
                               intelligence    integer not null default 1,
                               perception      integer not null default 1
                           );`;

test('nox base', t => {
    const { nox } = igniculus;

    const options = {
        rules: {
            comments:             { style: nox },
            constants:            { style: nox },
            numbers:              { style: nox },
            operators:            { style: nox },
            variables:            { style: nox },
            delimitedIdentifiers: { style: nox },
            dataTypes:            { style: nox },
            standardKeywords:     { style: nox },
            lesserKeywords:       { style: nox },
            prefix:               { style: nox, text: '\u0002' },
            postfix:              { style: nox, text: '\u0003' }
        }
    };

    const print = igniculus(Object.assign(options, echo));

    const output = print(statement_a);
    const expected = '\u0002' + statement_a + '\u0003';

    t.is(output, expected);
});

test('nox simple styles', t => {
    const { nox } = igniculus;

    const options = {
        rules: {
            comments:         { style: nox.italic },
            constants:        { style: nox.inverse },
            numbers:          { style: nox.underline },
            operators:        { style: nox.magenta },
            dataTypes:        {
                style: nox.green,
                types: { include: ['array', 'inet', 'bytea', 'uuid'] }
            },
            standardKeywords: {
                style: nox.yellow,
                keywords: { include: ['at', 'returning', 'primary key'] }
            },
            lesserKeywords:   {
                style: nox.cyan,
                keywords: { include: ['not null'], exclude: ['null'] }
            }
        },
        own: {
            x__ident:         { style: nox.red, regexp: /\bx__\w+\b/g },
            escape_format:    { style: nox.inverse, regexp: /E'.*?'/g },
            no_parens:        { style: nox.hidden, regexp: /\(\)|\)|\(/g, transform: '\u00a0' }
        }
    };

    const print = igniculus(Object.assign(options, echo));

    const output = print(statement_a);
    const nbsp = '\u{a0}';
    const expected =
        dedent`${m.italic}---[ xop: 2011.04.28/09.56.21.7856 ; 331B ; 0.0329s ]---${m.reset}

               ${m.italic}---$ st_n_erik56.s2 $---${m.reset}
               ${c.fg.yellow}create${m.reset} ${c.fg.yellow}table${m.reset} ${c.fg.red}x__dom${m.reset} ${m.hidden + nbsp + m.reset}
                dsig ${c.fg.green}uuid${m.reset}         ${c.fg.yellow}primary key${m.reset}
                ,kia ${c.fg.green}inet${m.reset}[]       ${c.fg.cyan}not null${m.reset}
                ,prt ${c.fg.green}int${m.reset}          ${c.fg.yellow}check${m.reset} ${m.hidden + nbsp + m.reset}prt ${c.fg.cyan}between${m.reset} ${m.underline}0${m.reset} ${c.fg.cyan}and${m.reset} ${m.underline}65535${m.reset}${m.hidden + nbsp + m.reset}
                ,toc ${c.fg.green}timestamp${m.reset}${m.hidden + nbsp + m.reset}${m.underline}6${m.reset}${m.hidden + nbsp + m.reset} ${c.fg.cyan}not null${m.reset} ${c.fg.yellow}default${m.reset} ${m.hidden + nbsp + m.reset}now${m.hidden + nbsp + m.reset} ${c.fg.yellow}at${m.reset} ${c.fg.green}time zone${m.reset} ${m.inverse}'utc'${m.reset}${m.hidden + nbsp + m.reset}
                ,tod ${c.fg.green}timestamp${m.reset}${m.hidden + nbsp + m.reset}${m.underline}6${m.reset}${m.hidden + nbsp + m.reset}
                ,ake ${c.fg.green}bytea${m.reset}
                ,ata ${c.fg.green}smallint${m.reset}     ${c.fg.cyan}not null${m.reset}
               ${m.hidden + nbsp + m.reset};

               ${m.italic}---$ st_n_erik56.s12 $---${m.reset}
               ${c.fg.yellow}insert${m.reset} ${c.fg.yellow}into${m.reset} ${c.fg.red}x__dom${m.reset} ${c.fg.yellow}values${m.reset} ${m.hidden + nbsp + m.reset}
                ${m.inverse}'00000000-0000-0000-0000-000000000000'${m.reset}, ${c.fg.green}array${m.reset}['0100::e056:ffff'::inet], ${m.underline}60606${m.reset}, ${m.inverse}'010101Z'${m.reset}, null, ${m.inverse}E'GTDv4uLF0ufZ2dbGxWWARQ=='${m.reset}, ${m.underline}0${m.reset}
               ${m.hidden + nbsp + m.reset} ${c.fg.yellow}returning${m.reset} ${c.fg.magenta}*${m.reset};`;

    t.is(output, expected);
});

test('nox chained styles', t => {
    const { nox } = igniculus;

    const options = {
        rules: {
            comments:         { style: nox.italic.bold.black },
            constants:        { style: nox.inverse.underline.bgblue },
            numbers:          { style: nox.inverse.underline.bgred },
            operators:        { style: nox.magenta },
            dataTypes:        { style: nox.green, types: ['SMALLINT', 'INT', 'ARRAY', 'BYTEA', 'TIMESTAMP', 'INET', 'UUID', 'TIME ZONE'] },
            standardKeywords: { style: nox.yellow, keywords: ['CREATE', 'TABLE', 'INSERT', 'INTO', 'VALUES', 'PRIMARY KEY', 'CHECK', 'DEFAULT', 'AT', 'RETURNING'] },
            lesserKeywords:   { style: nox.cyan, keywords: ['NOT NULL', 'BETWEEN', 'AND'] }
        },
        own: {
            escape_format:    { style: nox.inverse.underline.bgyellow, regexp: /E'.*?'/g },
            x__ident:         { style: nox.overline.red, regexp: /\bx__\w+\b/g },
            no_parens:        { style: nox.dim.white, regexp: /\(\)|\)|\(/g },
            no_meta:          { regexp: /^---\[.*?\]---\n*/, transform: '' }
        }
    };

    const print = igniculus(Object.assign(options, echo));

    const output = print(statement_a);
    const expected =
        dedent`${m.bold + m.italic + c.fg.black}---$ st_n_erik56.s2 $---${m.reset}
               ${c.fg.yellow}create${m.reset} ${c.fg.yellow}table${m.reset} ${m.overline + c.fg.red}x__dom${m.reset} ${m.dim + c.fg.white}(${m.reset}
                dsig ${c.fg.green}uuid${m.reset}         ${c.fg.yellow}primary key${m.reset}
                ,kia ${c.fg.green}inet${m.reset}[]       ${c.fg.cyan}not null${m.reset}
                ,prt ${c.fg.green}int${m.reset}          ${c.fg.yellow}check${m.reset} ${m.dim + c.fg.white}(${m.reset}prt ${c.fg.cyan}between${m.reset} ${m.underline + m.inverse + c.bg.red}0${m.reset} ${c.fg.cyan}and${m.reset} ${m.underline + m.inverse + c.bg.red}65535${m.reset}${m.dim + c.fg.white})${m.reset}
                ,toc ${c.fg.green}timestamp${m.reset}${m.dim + c.fg.white}(${m.reset}${m.underline + m.inverse + c.bg.red}6${m.reset}${m.dim + c.fg.white})${m.reset} ${c.fg.cyan}not null${m.reset} ${c.fg.yellow}default${m.reset} ${m.dim + c.fg.white}(${m.reset}now${m.dim + c.fg.white}()${m.reset} ${c.fg.yellow}at${m.reset} ${c.fg.green}time zone${m.reset} ${m.underline + m.inverse + c.bg.blue}'utc'${m.reset}${m.dim + c.fg.white})${m.reset}
                ,tod ${c.fg.green}timestamp${m.reset}${m.dim + c.fg.white}(${m.reset}${m.underline + m.inverse + c.bg.red}6${m.reset}${m.dim + c.fg.white})${m.reset}
                ,ake ${c.fg.green}bytea${m.reset}
                ,ata ${c.fg.green}smallint${m.reset}     ${c.fg.cyan}not null${m.reset}
               ${m.dim + c.fg.white})${m.reset};

               ${m.bold + m.italic + c.fg.black}---$ st_n_erik56.s12 $---${m.reset}
               ${c.fg.yellow}insert${m.reset} ${c.fg.yellow}into${m.reset} ${m.overline + c.fg.red}x__dom${m.reset} ${c.fg.yellow}values${m.reset} ${m.dim + c.fg.white}(${m.reset}
                ${m.underline + m.inverse + c.bg.blue}'00000000-0000-0000-0000-000000000000'${m.reset}, ${c.fg.green}array${m.reset}['0100::e056:ffff'::inet], ${m.underline + m.inverse + c.bg.red}60606${m.reset}, ${m.underline + m.inverse + c.bg.blue}'010101Z'${m.reset}, null, ${m.underline + m.inverse + c.bg.yellow}E'GTDv4uLF0ufZ2dbGxWWARQ=='${m.reset}, ${m.underline + m.inverse + c.bg.red}0${m.reset}
               ${m.dim + c.fg.white})${m.reset} ${c.fg.yellow}returning${m.reset} ${c.fg.magenta}*${m.reset};`;

    t.is(output, expected);
});

test('nox inherited styles', t => {
    const { nox } = igniculus;

    const charcoal = nox.bold.black;
    const ashes = nox.dim.white;
    const bilane = nox.underline.overline;

    const options = {
        rules: {
            comments:         { style: charcoal._white.italic.inverse },
            constants:        { style: bilane.cyan },
            numbers:          { style: bilane.green },
            operators:        { style: ashes },
            dataTypes:        { style: ashes, types: ['SMALLINT', 'INT', 'ARRAY', 'BYTEA', 'TIMESTAMP', 'INET', 'UUID', 'TIME ZONE'] },
            standardKeywords: { style: nox.yellow, keywords: ['CREATE', 'TABLE', 'INSERT', 'INTO', 'VALUES', 'PRIMARY KEY', 'CHECK', 'DEFAULT', 'AT', 'RETURNING'] },
            lesserKeywords:   { style: charcoal, keywords: ['NULL', 'NOT NULL', 'BETWEEN', 'AND'] }
        },
        own: {
            meta:             { style: nox.bold._white.black, regexp: /^---\[.*?\]---/ },
            x__ident:         { style: nox.framed.blink.red, regexp: /\bx__\w+\b/g },
            escape_format:    { style: bilane.yellow, regexp: /E'.*?'/g },
            nv_symbols:       { style: charcoal, regexp: /\(\)|\)|\(|,|;/g }
        }
    };

    const print = igniculus(Object.assign(options, echo));

    const output = print(statement_a);
    const expected =
        dedent`${m.bold + c.bg.white + c.fg.black}---[ xop: 2011.04.28/09.56.21.7856 ; 331B ; 0.0329s ]---${m.reset}

               ${m.bold + m.italic + m.inverse + c.bg.white + c.fg.black}---$ st_n_erik56.s2 $---${m.reset}
               ${c.fg.yellow}create${m.reset} ${c.fg.yellow}table${m.reset} ${m.blink + m.framed + c.fg.red}x__dom${m.reset} ${m.bold + c.fg.black}(${m.reset}
                dsig ${m.dim + c.fg.white}uuid${m.reset}         ${c.fg.yellow}primary key${m.reset}
                ${m.bold + c.fg.black},${m.reset}kia ${m.dim + c.fg.white}inet${m.reset}[]       ${m.bold + c.fg.black}not null${m.reset}
                ${m.bold + c.fg.black},${m.reset}prt ${m.dim + c.fg.white}int${m.reset}          ${c.fg.yellow}check${m.reset} ${m.bold + c.fg.black}(${m.reset}prt ${m.bold + c.fg.black}between${m.reset} ${m.underline + m.overline + c.fg.green}0${m.reset} ${m.bold + c.fg.black}and${m.reset} ${m.underline + m.overline + c.fg.green}65535${m.reset}${m.bold + c.fg.black})${m.reset}
                ${m.bold + c.fg.black},${m.reset}toc ${m.dim + c.fg.white}timestamp${m.reset}${m.bold + c.fg.black}(${m.reset}${m.underline + m.overline + c.fg.green}6${m.reset}${m.bold + c.fg.black})${m.reset} ${m.bold + c.fg.black}not null${m.reset} ${c.fg.yellow}default${m.reset} ${m.bold + c.fg.black}(${m.reset}now${m.bold + c.fg.black}()${m.reset} ${c.fg.yellow}at${m.reset} ${m.dim + c.fg.white}time zone${m.reset} ${m.underline + m.overline + c.fg.cyan}'utc'${m.reset}${m.bold + c.fg.black})${m.reset}
                ${m.bold + c.fg.black},${m.reset}tod ${m.dim + c.fg.white}timestamp${m.reset}${m.bold + c.fg.black}(${m.reset}${m.underline + m.overline + c.fg.green}6${m.reset}${m.bold + c.fg.black})${m.reset}
                ${m.bold + c.fg.black},${m.reset}ake ${m.dim + c.fg.white}bytea${m.reset}
                ${m.bold + c.fg.black},${m.reset}ata ${m.dim + c.fg.white}smallint${m.reset}     ${m.bold + c.fg.black}not null${m.reset}
               ${m.bold + c.fg.black})${m.reset}${m.bold + c.fg.black};${m.reset}

               ${m.bold + m.italic + m.inverse + c.bg.white + c.fg.black}---$ st_n_erik56.s12 $---${m.reset}
               ${c.fg.yellow}insert${m.reset} ${c.fg.yellow}into${m.reset} ${m.blink + m.framed + c.fg.red}x__dom${m.reset} ${c.fg.yellow}values${m.reset} ${m.bold + c.fg.black}(${m.reset}
                ${m.underline + m.overline + c.fg.cyan}'00000000-0000-0000-0000-000000000000'${m.reset}${m.bold + c.fg.black},${m.reset} ${m.dim + c.fg.white}array${m.reset}['0100::e056:ffff'::inet]${m.bold + c.fg.black},${m.reset} ${m.underline + m.overline + c.fg.green}60606${m.reset}${m.bold + c.fg.black},${m.reset} ${m.underline + m.overline + c.fg.cyan}'010101Z'${m.reset}${m.bold + c.fg.black},${m.reset} ${m.bold + c.fg.black}null${m.reset}${m.bold + c.fg.black},${m.reset} ${m.underline + m.overline + c.fg.yellow}E'GTDv4uLF0ufZ2dbGxWWARQ=='${m.reset}${m.bold + c.fg.black},${m.reset} ${m.underline + m.overline + c.fg.green}0${m.reset}
               ${m.bold + c.fg.black})${m.reset} ${c.fg.yellow}returning${m.reset} ${m.dim + c.fg.white}*${m.reset}${m.bold + c.fg.black};${m.reset}`;

    t.is(output, expected);
});

test('nox short-named and case-insensitive styles with mode toggle and color overwriting', t => {
    const { nox } = igniculus;

    const charcoal = nox.bold.black;
    const ashes = nox.dim.white;

    const options = {
        rules: {
            comments:         { style: nox.iNvErSe.InVeRsE.iNvErSe.black._WHITE.bolD.Italic },
            constants:        { style: ashes },
            numbers:          { style: ashes },
            operators:        { style: ashes },
            dataTypes:        {
                style: nox.red,
                types: { include: ['array', 'inet', 'bytea', 'uuid'] }
            },
            standardKeywords: {
                style: nox.grEEN.YELLow,
                keywords: { include: ['at', 'returning', 'primary key'] }
            },
            lesserKeywords:   {
                style: charcoal,
                keywords: { include: ['not null'] }
            }
        },
        own: {
            meta:             { style: nox.BOLd._white.BLACK, regexp: /^---\[.*?\]---/ },
            x__ident:         { style: nox.OVERline.BLINK.BLINK.red, regexp: /\bx__\w+\b/g },
            escape_format:    { style: nox.underLINE.yellow, regexp: /E'.*?'/g },
            nv_symbols:       { style: charcoal, regexp: /\(\)|\)|\(|,|;/g }
        }
    };

    const print = igniculus(Object.assign(options, echo));

    const output = print(statement_a);
    const expected =
        dedent`${m.bold + c.bg.white + c.fg.black}---[ xop: 2011.04.28/09.56.21.7856 ; 331B ; 0.0329s ]---${m.reset}

               ${m.bold + m.italic + m.inverse + c.bg.white + c.fg.black}---$ st_n_erik56.s2 $---${m.reset}
               ${c.fg.yellow}create${m.reset} ${c.fg.yellow}table${m.reset} ${m.overline + c.fg.red}x__dom${m.reset} ${m.bold + c.fg.black}(${m.reset}
                dsig ${c.fg.red}uuid${m.reset}         ${c.fg.yellow}primary key${m.reset}
                ${m.bold + c.fg.black},${m.reset}kia ${c.fg.red}inet${m.reset}[]       ${m.bold + c.fg.black}not null${m.reset}
                ${m.bold + c.fg.black},${m.reset}prt ${c.fg.red}int${m.reset}          ${c.fg.yellow}check${m.reset} ${m.bold + c.fg.black}(${m.reset}prt ${m.bold + c.fg.black}between${m.reset} ${m.dim + c.fg.white}0${m.reset} ${m.bold + c.fg.black}and${m.reset} ${m.dim + c.fg.white}65535${m.reset}${m.bold + c.fg.black})${m.reset}
                ${m.bold + c.fg.black},${m.reset}toc ${c.fg.red}timestamp${m.reset}${m.bold + c.fg.black}(${m.reset}${m.dim + c.fg.white}6${m.reset}${m.bold + c.fg.black})${m.reset} ${m.bold + c.fg.black}not null${m.reset} ${c.fg.yellow}default${m.reset} ${m.bold + c.fg.black}(${m.reset}now${m.bold + c.fg.black}()${m.reset} ${c.fg.yellow}at${m.reset} ${c.fg.red}time zone${m.reset} ${m.dim + c.fg.white}'utc'${m.reset}${m.bold + c.fg.black})${m.reset}
                ${m.bold + c.fg.black},${m.reset}tod ${c.fg.red}timestamp${m.reset}${m.bold + c.fg.black}(${m.reset}${m.dim + c.fg.white}6${m.reset}${m.bold + c.fg.black})${m.reset}
                ${m.bold + c.fg.black},${m.reset}ake ${c.fg.red}bytea${m.reset}
                ${m.bold + c.fg.black},${m.reset}ata ${c.fg.red}smallint${m.reset}     ${m.bold + c.fg.black}not null${m.reset}
               ${m.bold + c.fg.black})${m.reset}${m.bold + c.fg.black};${m.reset}

               ${m.bold + m.italic + m.inverse + c.bg.white + c.fg.black}---$ st_n_erik56.s12 $---${m.reset}
               ${c.fg.yellow}insert${m.reset} ${c.fg.yellow}into${m.reset} ${m.overline + c.fg.red}x__dom${m.reset} ${c.fg.yellow}values${m.reset} ${m.bold + c.fg.black}(${m.reset}
                ${m.dim + c.fg.white}'00000000-0000-0000-0000-000000000000'${m.reset}${m.bold + c.fg.black},${m.reset} ${c.fg.red}array${m.reset}['0100::e056:ffff'::inet]${m.bold + c.fg.black},${m.reset} ${m.dim + c.fg.white}60606${m.reset}${m.bold + c.fg.black},${m.reset} ${m.dim + c.fg.white}'010101Z'${m.reset}${m.bold + c.fg.black},${m.reset} ${m.bold + c.fg.black}null${m.reset}${m.bold + c.fg.black},${m.reset} ${m.underline + c.fg.yellow}E'GTDv4uLF0ufZ2dbGxWWARQ=='${m.reset}${m.bold + c.fg.black},${m.reset} ${m.dim + c.fg.white}0${m.reset}
               ${m.bold + c.fg.black})${m.reset} ${c.fg.yellow}returning${m.reset} ${m.dim + c.fg.white}*${m.reset}${m.bold + c.fg.black};${m.reset}`;

    t.is(output, expected);
});

test('nox full-named and case-insensitive inherited styles with mode toggle and color overwriting', t => {
    const { nox } = igniculus;

    const charcoal = nox.bold.fgBlack;
    const ashes = nox.dim.fgWhite;
    const danger = nox.OVERLINE.BLINK.bgYellow.fgRed;

    const options = {
        rules: {
            comments:         { style: charcoal.INverse.inVERSE.bgwhite },
            constants:        { style: ashes },
            numbers:          { style: ashes },
            operators:        { style: ashes },
            dataTypes:        { style: nox.fgRED, types: ['SMALLINT', 'INT', 'ARRAY', 'BYTEA', 'TIMESTAMP', 'INET', 'UUID', 'TIME ZONE'] },
            standardKeywords: { style: nox.fgYELLOW, keywords: ['CREATE', 'TABLE', 'INSERT', 'INTO', 'VALUES', 'PRIMARY KEY', 'CHECK', 'DEFAULT', 'AT', 'RETURNING'] },
            lesserKeywords:   { style: charcoal, keywords: ['NULL', 'NOT NULL', 'BETWEEN', 'AND'] }
        },
        own: {
            meta:             { style: charcoal.bgwhite, regexp: /^---\[.*?\]---/ },
            x__ident:         { style: danger.overline.encircled.bgblack, regexp: /\bx__\w+\b/g },
            escape_format:    { style: nox.UNDERline.fgYellow, regexp: /E'.*?'/g },
            nv_symbols:       { style: charcoal, regexp: /\(\)|\)|\(|,|;/g }
        }
    };

    const print = igniculus(Object.assign(options, echo));

    const output = print(statement_a);
    const expected =
        dedent`${m.bold + c.bg.white + c.fg.black}---[ xop: 2011.04.28/09.56.21.7856 ; 331B ; 0.0329s ]---${m.reset}

               ${m.bold + c.bg.white + c.fg.black}---$ st_n_erik56.s2 $---${m.reset}
               ${c.fg.yellow}create${m.reset} ${c.fg.yellow}table${m.reset} ${m.blink + m.encircled + c.bg.black + c.fg.red}x__dom${m.reset} ${m.bold + c.fg.black}(${m.reset}
                dsig ${c.fg.red}uuid${m.reset}         ${c.fg.yellow}primary key${m.reset}
                ${m.bold + c.fg.black},${m.reset}kia ${c.fg.red}inet${m.reset}[]       ${m.bold + c.fg.black}not null${m.reset}
                ${m.bold + c.fg.black},${m.reset}prt ${c.fg.red}int${m.reset}          ${c.fg.yellow}check${m.reset} ${m.bold + c.fg.black}(${m.reset}prt ${m.bold + c.fg.black}between${m.reset} ${m.dim + c.fg.white}0${m.reset} ${m.bold + c.fg.black}and${m.reset} ${m.dim + c.fg.white}65535${m.reset}${m.bold + c.fg.black})${m.reset}
                ${m.bold + c.fg.black},${m.reset}toc ${c.fg.red}timestamp${m.reset}${m.bold + c.fg.black}(${m.reset}${m.dim + c.fg.white}6${m.reset}${m.bold + c.fg.black})${m.reset} ${m.bold + c.fg.black}not null${m.reset} ${c.fg.yellow}default${m.reset} ${m.bold + c.fg.black}(${m.reset}now${m.bold + c.fg.black}()${m.reset} ${c.fg.yellow}at${m.reset} ${c.fg.red}time zone${m.reset} ${m.dim + c.fg.white}'utc'${m.reset}${m.bold + c.fg.black})${m.reset}
                ${m.bold + c.fg.black},${m.reset}tod ${c.fg.red}timestamp${m.reset}${m.bold + c.fg.black}(${m.reset}${m.dim + c.fg.white}6${m.reset}${m.bold + c.fg.black})${m.reset}
                ${m.bold + c.fg.black},${m.reset}ake ${c.fg.red}bytea${m.reset}
                ${m.bold + c.fg.black},${m.reset}ata ${c.fg.red}smallint${m.reset}     ${m.bold + c.fg.black}not null${m.reset}
               ${m.bold + c.fg.black})${m.reset}${m.bold + c.fg.black};${m.reset}

               ${m.bold + c.bg.white + c.fg.black}---$ st_n_erik56.s12 $---${m.reset}
               ${c.fg.yellow}insert${m.reset} ${c.fg.yellow}into${m.reset} ${m.blink + m.encircled + c.bg.black + c.fg.red}x__dom${m.reset} ${c.fg.yellow}values${m.reset} ${m.bold + c.fg.black}(${m.reset}
                ${m.dim + c.fg.white}'00000000-0000-0000-0000-000000000000'${m.reset}${m.bold + c.fg.black},${m.reset} ${c.fg.red}array${m.reset}['0100::e056:ffff'::inet]${m.bold + c.fg.black},${m.reset} ${m.dim + c.fg.white}60606${m.reset}${m.bold + c.fg.black},${m.reset} ${m.dim + c.fg.white}'010101Z'${m.reset}${m.bold + c.fg.black},${m.reset} ${m.bold + c.fg.black}null${m.reset}${m.bold + c.fg.black},${m.reset} ${m.underline + c.fg.yellow}E'GTDv4uLF0ufZ2dbGxWWARQ=='${m.reset}${m.bold + c.fg.black},${m.reset} ${m.dim + c.fg.white}0${m.reset}
               ${m.bold + c.fg.black})${m.reset} ${c.fg.yellow}returning${m.reset} ${m.dim + c.fg.white}*${m.reset}${m.bold + c.fg.black};${m.reset}`;

    t.is(output, expected);
});