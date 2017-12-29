'use strict';

const ava = require('ava');
const dedent = require('dedent');
const igniculus = require('..');

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
    strikethrough: '\x1b[9m'
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

const statement_a = dedent`CREATE TABLE Surveillance_Cameras (
                               [scid] SMALLINT IDENTITY(200,1),
                               [sn] CHAR(25) NOT NULL UNIQUE,
                               [ip] BINARY(4) NOT NULL,
                               [port] INTEGER NOT NULL,
                               [online] BIT NOT NULL DEFAULT 0,
                               [model] NVARCHAR(50),
                               [range] NUMERIC(3,1),
                               [locator] INTEGER NOT NULL,
                               CONSTRAINT 'CHK_Port' CHECK ([port] BETWEEN 1 AND 65535),
                               CONSTRAINT 'CHK_Range' CHECK ([range] >= 0.1),
                               CONSTRAINT 'PK_Printers' PRIMARY KEY ("scid"),
                               CONSTRAINT 'FK_Locator' FOREIGN KEY ("locator") REFERENCES [Locators]("lid")
                           );`;

const statement_b = 'SELECT CURRENT_TIMESTAMP';

const statement_c = dedent`SELECT 'Feature' as type, 'Point' as [geometry.type],
                               JSON_QUERY(FORMATMESSAGE('[%s,%s]',
                                   FORMAT(L.position.STY, N'0.##################################################'),
                                   FORMAT(L.position.STX, N'0.##################################################')
                               )) as [geometry.coordinates],
                               L.descriptor as [properties.descriptor],
                               C.name as [properties.class]
                           FROM Locators L
                           INNER JOIN Locator_Classes C ON L.lcid = C.lcid
                           WHERE L.lid = 20295
                           FOR JSON PATH`;

const statement_d = dedent`SELECT name AS 'user', CONVERT(DATE, createdate, 102) AS 'created'
                           FROM master..syslogins
                           WHERE dbname = 'master'`;

const statement_e = dedent`DECLARE @name VARCHAR(50)
                           DECLARE @path VARCHAR(256)
                           DECLARE @stamp VARCHAR(20)
                           DECLARE @fileName VARCHAR(256)

                           SET @path = 'U:\\Ark\\'
                           SET @stamp = CONVERT(VARCHAR(20), GETDATE(), 112)

                           DECLARE db_cursor CURSOR FOR
                           SELECT name
                           FROM master.dbo.sysdatabases
                           WHERE name NOT IN ('monitor', 'index', 'library')

                           OPEN db_cursor
                           FETCH NEXT FROM db_cursor INTO @name

                           WHILE @@FETCH_STATUS = 0
                           BEGIN
                                  SET @fileName = @path + @name + '_' + @stamp + '.bak'
                                  BACKUP DATABASE @name TO DISK = @fileName

                                  FETCH NEXT FROM db_cursor INTO @name
                           END

                           CLOSE db_cursor
                           DEALLOCATE db_cursor`;

test('custom output', t => {
    const options = {
        output: out => out.split('').reduce((a, c) => a += c.charCodeAt(0), 0)
    };

    const print = igniculus(Object.assign(options));

    const output = print(statement_a);
    const expected = 36876;

    t.is(output, expected);
});

test('constants', t => {
    const options = {
        constants: { fg: 'red' }
    };

    const print = igniculus(Object.assign(options, echo));

    const output = print(statement_a);
    const expected =
        dedent`CREATE TABLE Surveillance_Cameras (
                   [scid] SMALLINT IDENTITY(200,1),
                   [sn] CHAR(25) NOT NULL UNIQUE,
                   [ip] BINARY(4) NOT NULL,
                   [port] INTEGER NOT NULL,
                   [online] BIT NOT NULL DEFAULT 0,
                   [model] NVARCHAR(50),
                   [range] NUMERIC(3,1),
                   [locator] INTEGER NOT NULL,
                   CONSTRAINT ${c.fg.red}'CHK_Port'${m.reset} CHECK ([port] BETWEEN 1 AND 65535),
                   CONSTRAINT ${c.fg.red}'CHK_Range'${m.reset} CHECK ([range] >= 0.1),
                   CONSTRAINT ${c.fg.red}'PK_Printers'${m.reset} PRIMARY KEY ("scid"),
                   CONSTRAINT ${c.fg.red}'FK_Locator'${m.reset} FOREIGN KEY ("locator") REFERENCES [Locators]("lid")
               );`;

    t.is(output, expected);
});

test('numbers', t => {
    const options = {
        numbers: { fg: 'blue' }
    };

    const print = igniculus(Object.assign(options, echo));

    const output = print(statement_a);
    const expected =
        dedent`CREATE TABLE Surveillance_Cameras (
                   [scid] SMALLINT IDENTITY(${c.fg.blue}200${m.reset},${c.fg.blue}1${m.reset}),
                   [sn] CHAR(${c.fg.blue}25${m.reset}) NOT NULL UNIQUE,
                   [ip] BINARY(${c.fg.blue}4${m.reset}) NOT NULL,
                   [port] INTEGER NOT NULL,
                   [online] BIT NOT NULL DEFAULT ${c.fg.blue}0${m.reset},
                   [model] NVARCHAR(${c.fg.blue}50${m.reset}),
                   [range] NUMERIC(${c.fg.blue}3${m.reset},${c.fg.blue}1${m.reset}),
                   [locator] INTEGER NOT NULL,
                   CONSTRAINT 'CHK_Port' CHECK ([port] BETWEEN ${c.fg.blue}1${m.reset} AND ${c.fg.blue}65535${m.reset}),
                   CONSTRAINT 'CHK_Range' CHECK ([range] >= ${c.fg.blue}0.1${m.reset}),
                   CONSTRAINT 'PK_Printers' PRIMARY KEY ("scid"),
                   CONSTRAINT 'FK_Locator' FOREIGN KEY ("locator") REFERENCES [Locators]("lid")
               );`;

    t.is(output, expected);
});

test('operators', t => {
    const options = {
        operators: { fg: 'black' }
    };

    const print = igniculus(Object.assign(options, echo));

    const output = print(statement_a);
    const expected =
        dedent`CREATE TABLE Surveillance_Cameras (
                   [scid] SMALLINT IDENTITY(200,1),
                   [sn] CHAR(25) NOT NULL UNIQUE,
                   [ip] BINARY(4) NOT NULL,
                   [port] INTEGER NOT NULL,
                   [online] BIT NOT NULL DEFAULT 0,
                   [model] NVARCHAR(50),
                   [range] NUMERIC(3,1),
                   [locator] INTEGER NOT NULL,
                   CONSTRAINT 'CHK_Port' CHECK ([port] BETWEEN 1 AND 65535),
                   CONSTRAINT 'CHK_Range' CHECK ([range] ${c.fg.black}>=${m.reset} 0.1),
                   CONSTRAINT 'PK_Printers' PRIMARY KEY ("scid"),
                   CONSTRAINT 'FK_Locator' FOREIGN KEY ("locator") REFERENCES [Locators]("lid")
               );`;

    t.is(output, expected);
});

test('delimitedIdentifiers', t => {
    const options = {
        delimitedIdentifiers: { fg: 'yellow' }
    };

    const print = igniculus(Object.assign(options, echo));

    const output = print(statement_a);
    const expected =
        dedent`CREATE TABLE Surveillance_Cameras (
                   ${c.fg.yellow}[scid]${m.reset} SMALLINT IDENTITY(200,1),
                   ${c.fg.yellow}[sn]${m.reset} CHAR(25) NOT NULL UNIQUE,
                   ${c.fg.yellow}[ip]${m.reset} BINARY(4) NOT NULL,
                   ${c.fg.yellow}[port]${m.reset} INTEGER NOT NULL,
                   ${c.fg.yellow}[online]${m.reset} BIT NOT NULL DEFAULT 0,
                   ${c.fg.yellow}[model]${m.reset} NVARCHAR(50),
                   ${c.fg.yellow}[range]${m.reset} NUMERIC(3,1),
                   ${c.fg.yellow}[locator]${m.reset} INTEGER NOT NULL,
                   CONSTRAINT 'CHK_Port' CHECK (${c.fg.yellow}[port]${m.reset} BETWEEN 1 AND 65535),
                   CONSTRAINT 'CHK_Range' CHECK (${c.fg.yellow}[range]${m.reset} >= 0.1),
                   CONSTRAINT 'PK_Printers' PRIMARY KEY (${c.fg.yellow}"scid"${m.reset}),
                   CONSTRAINT 'FK_Locator' FOREIGN KEY (${c.fg.yellow}"locator"${m.reset}) REFERENCES ${c.fg.yellow}[Locators]${m.reset}(${c.fg.yellow}"lid"${m.reset})
               );`;

    t.is(output, expected);
});

test('dataTypes', t => {
    const options = {
        dataTypes: { fg: 'green' }
    };

    const print = igniculus(Object.assign(options, echo));

    const output = print(statement_a);
    const expected =
        dedent`CREATE TABLE Surveillance_Cameras (
                   [scid] ${c.fg.green}SMALLINT${m.reset} IDENTITY(200,1),
                   [sn] ${c.fg.green}CHAR${m.reset}(25) NOT NULL UNIQUE,
                   [ip] ${c.fg.green}BINARY${m.reset}(4) NOT NULL,
                   [port] ${c.fg.green}INTEGER${m.reset} NOT NULL,
                   [online] ${c.fg.green}BIT${m.reset} NOT NULL DEFAULT 0,
                   [model] ${c.fg.green}NVARCHAR${m.reset}(50),
                   [range] ${c.fg.green}NUMERIC${m.reset}(3,1),
                   [locator] ${c.fg.green}INTEGER${m.reset} NOT NULL,
                   CONSTRAINT 'CHK_Port' CHECK ([port] BETWEEN 1 AND 65535),
                   CONSTRAINT 'CHK_Range' CHECK ([range] >= 0.1),
                   CONSTRAINT 'PK_Printers' PRIMARY KEY ("scid"),
                   CONSTRAINT 'FK_Locator' FOREIGN KEY ("locator") REFERENCES [Locators]("lid")
               );`;

    t.is(output, expected);
});

test('standardKeywords', t => {
    const options = {
        standardKeywords: { fg: 'cyan' }
    };

    const print = igniculus(Object.assign(options, echo));

    const output = print(statement_a);
    const expected =
        dedent`${c.fg.cyan}CREATE${m.reset} ${c.fg.cyan}TABLE${m.reset} Surveillance_Cameras (
                   [scid] SMALLINT ${c.fg.cyan}IDENTITY${m.reset}(200,1),
                   [sn] CHAR(25) NOT NULL ${c.fg.cyan}UNIQUE${m.reset},
                   [ip] BINARY(4) NOT NULL,
                   [port] INTEGER NOT NULL,
                   [online] BIT NOT NULL ${c.fg.cyan}DEFAULT${m.reset} 0,
                   [model] NVARCHAR(50),
                   [range] NUMERIC(3,1),
                   [locator] INTEGER NOT NULL,
                   ${c.fg.cyan}CONSTRAINT${m.reset} 'CHK_Port' ${c.fg.cyan}CHECK${m.reset} ([port] BETWEEN 1 AND 65535),
                   ${c.fg.cyan}CONSTRAINT${m.reset} 'CHK_Range' ${c.fg.cyan}CHECK${m.reset} ([range] >= 0.1),
                   ${c.fg.cyan}CONSTRAINT${m.reset} 'PK_Printers' ${c.fg.cyan}PRIMARY${m.reset} ${c.fg.cyan}KEY${m.reset} ("scid"),
                   ${c.fg.cyan}CONSTRAINT${m.reset} 'FK_Locator' ${c.fg.cyan}FOREIGN${m.reset} ${c.fg.cyan}KEY${m.reset} ("locator") ${c.fg.cyan}REFERENCES${m.reset} [Locators]("lid")
               );`;

    t.is(output, expected);
});

test('lesserKeywords', t => {
    const options = {
        lesserKeywords: { fg: 'magenta' }
    };

    const print = igniculus(Object.assign(options, echo));

    const output = print(statement_a);
    const expected =
        dedent`CREATE TABLE Surveillance_Cameras (
                   [scid] SMALLINT IDENTITY(200,1),
                   [sn] CHAR(25) ${c.fg.magenta}NOT${m.reset} ${c.fg.magenta}NULL${m.reset} UNIQUE,
                   [ip] BINARY(4) ${c.fg.magenta}NOT${m.reset} ${c.fg.magenta}NULL${m.reset},
                   [port] INTEGER ${c.fg.magenta}NOT${m.reset} ${c.fg.magenta}NULL${m.reset},
                   [online] BIT ${c.fg.magenta}NOT${m.reset} ${c.fg.magenta}NULL${m.reset} DEFAULT 0,
                   [model] NVARCHAR(50),
                   [range] NUMERIC(3,1),
                   [locator] INTEGER ${c.fg.magenta}NOT${m.reset} ${c.fg.magenta}NULL${m.reset},
                   CONSTRAINT 'CHK_Port' CHECK ([port] ${c.fg.magenta}BETWEEN${m.reset} 1 ${c.fg.magenta}AND${m.reset} 65535),
                   CONSTRAINT 'CHK_Range' CHECK ([range] >= 0.1),
                   CONSTRAINT 'PK_Printers' PRIMARY KEY ("scid"),
                   CONSTRAINT 'FK_Locator' FOREIGN KEY ("locator") REFERENCES [Locators]("lid")
               );`;

    t.is(output, expected);
});

test('prefix', t => {
    const options = {
        prefix: { fg: 'white', text: '(query) ' }
    };

    const print = igniculus(Object.assign(options, echo));

    const output = print(statement_b);
    const expected = `${c.fg.white}(query) ${m.reset}SELECT CURRENT_TIMESTAMP`;

    t.is(output, expected);
});

test('postfix', t => {
    const options = {
        postfix: { fg: 'white', text: ' █\n' }
    };

    const print = igniculus(Object.assign(options, echo));

    const output = print(statement_b);
    const expected = `SELECT CURRENT_TIMESTAMP${c.fg.white} █\n${m.reset}`;

    t.is(output, expected);
});
/*
test('data types and keywords', t => {
    const options = {
        dataTypes:            { mode: 'dim', fg: 'green' },
        standardKeywords:     { mode: 'dim', fg: 'cyan' },
        lesserKeywords:       { mode: 'bold', fg: 'black' }
    };

    const print = igniculus(Object.assign(options, echo));

    const output = print(statement_d);
    const expected =
        dedent`${m.dim}${c.fg.cyan}SELECT${m.reset} 'Feature' ${m.bold}${c.fg.black}as${m.reset} type, 'Point' ${m.bold}${c.fg.black}as${m.reset} [geometry.type],
                   JSON_QUERY(FORMATMESSAGE('[%s,%s]',
                       FORMAT(L.position.STY, N'0.##################################################'),
                       FORMAT(L.position.STX, N'0.##################################################')
                   )) ${m.bold}${c.fg.black}as${m.reset} [geometry.coordinates],
                   L.descriptor ${m.bold}${c.fg.black}as${m.reset} [properties.descriptor],
                   C.name ${m.bold}${c.fg.black}as${m.reset} [properties.class]
               ${m.dim}${c.fg.cyan}FROM${m.reset} Locators L
               ${m.dim}${c.fg.cyan}INNER${m.reset} ${m.dim}${c.fg.cyan}JOIN${m.reset} Locator_Classes C ${m.dim}${c.fg.cyan}ON${m.reset} L.lcid = C.lcid
               ${m.dim}${c.fg.cyan}WHERE${m.reset} L.lid = 20295
               FOR JSON PATH`;

    t.is(output, expected);
});
*/
test('data types and keywords', t => {
    const options = {
        dataTypes:            { mode: 'dim', fg: 'green' },
        standardKeywords:     { mode: 'dim', fg: 'cyan' },
        lesserKeywords:       { mode: 'bold', fg: 'black' }
    };

    const print = igniculus(Object.assign(options, echo));

    const output = print(statement_c);
    const expected =
        dedent`${m.dim}${c.fg.cyan}SELECT${m.reset} 'Feature' ${m.bold}${c.fg.black}AS${m.reset} type, 'Point' ${m.bold}${c.fg.black}AS${m.reset} [geometry.type],
                   JSON_QUERY(FORMATMESSAGE('[%s,%s]',
                       FORMAT(L.position.STY, N'0.##################################################'),
                       FORMAT(L.position.STX, N'0.##################################################')
                   )) ${m.bold}${c.fg.black}AS${m.reset} [geometry.coordinates],
                   L.descriptor ${m.bold}${c.fg.black}AS${m.reset} [properties.descriptor],
                   C.name ${m.bold}${c.fg.black}AS${m.reset} [properties.class]
               ${m.dim}${c.fg.cyan}FROM${m.reset} Locators L
               ${m.dim}${c.fg.cyan}INNER${m.reset} ${m.dim}${c.fg.cyan}JOIN${m.reset} Locator_Classes C ${m.dim}${c.fg.cyan}ON${m.reset} L.lcid = C.lcid
               ${m.dim}${c.fg.cyan}WHERE${m.reset} L.lid = 20295
               FOR JSON PATH`;

    t.is(output, expected);
});
/*
test('data types and keywords among constant and identifiers', t => {
    const options = {
        constants:                { mode: 'dim', fg: 'red' },
        delimitedIdentifiers:     { mode: 'dim', fg: 'yellow' },
        dataTypes:                { mode: 'dim', fg: 'green' },
        standardKeywords:         { mode: 'dim', fg: 'cyan' },
        lesserKeywords:           { mode: 'bold', fg: 'black' }
    };

    const print = igniculus(Object.assign(options, echo));

    const output = print(statement_d);
    const expected =
        dedent`${m.dim}${c.fg.cyan}SELECT${m.reset} ${m.dim}${c.fg.red}'Feature'${m.reset} ${m.bold}${c.fg.black}as${m.reset} type, ${m.dim}${c.fg.red}'Point'${m.reset} ${m.bold}${c.fg.black}as${m.reset} ${m.dim}${c.fg.yellow}[geometry.type]${m.reset},
                   JSON_QUERY(FORMATMESSAGE(${m.dim}${c.fg.red}'[%s,%s]'${m.reset},
                       FORMAT(L.position.STY, N${m.dim}${c.fg.red}'0.##################################################'${m.reset}),
                       FORMAT(L.position.STX, N${m.dim}${c.fg.red}'0.##################################################'${m.reset})
                   )) ${m.bold}${c.fg.black}as${m.reset} ${m.dim}${c.fg.yellow}[geometry.coordinates]${m.reset},
                   L.descriptor ${m.bold}${c.fg.black}as${m.reset} ${m.dim}${c.fg.yellow}[properties.descriptor]${m.reset},
                   C.name ${m.bold}${c.fg.black}as${m.reset} ${m.dim}${c.fg.yellow}[properties.class]${m.reset}
               ${m.dim}${c.fg.cyan}FROM${m.reset} Locators L
               ${m.dim}${c.fg.cyan}INNER${m.reset} ${m.dim}${c.fg.cyan}JOIN${m.reset} Locator_Classes C ${m.dim}${c.fg.cyan}ON${m.reset} L.lcid = C.lcid
               ${m.dim}${c.fg.cyan}WHERE${m.reset} L.lid = 20295
               FOR JSON PATH`;

    t.is(output, expected);
});
*/
test('data types and keywords among constant and identifiers', t => {
    const options = {
        constants:                { mode: 'dim', fg: 'red' },
        delimitedIdentifiers:     { mode: 'dim', fg: 'yellow' },
        dataTypes:                { mode: 'dim', fg: 'green' },
        standardKeywords:         { mode: 'dim', fg: 'cyan' },
        lesserKeywords:           { mode: 'bold', fg: 'black' }
    };

    const print = igniculus(Object.assign(options, echo));

    const output = print(statement_c);
    const expected =
        dedent`${m.dim}${c.fg.cyan}SELECT${m.reset} ${m.dim}${c.fg.red}'Feature'${m.reset} ${m.bold}${c.fg.black}AS${m.reset} type, ${m.dim}${c.fg.red}'Point'${m.reset} ${m.bold}${c.fg.black}AS${m.reset} ${m.dim}${c.fg.yellow}[geometry.type]${m.reset},
                   JSON_QUERY(FORMATMESSAGE(${m.dim}${c.fg.red}'[%s,%s]'${m.reset},
                       FORMAT(L.position.STY, N${m.dim}${c.fg.red}'0.##################################################'${m.reset}),
                       FORMAT(L.position.STX, N${m.dim}${c.fg.red}'0.##################################################'${m.reset})
                   )) ${m.bold}${c.fg.black}AS${m.reset} ${m.dim}${c.fg.yellow}[geometry.coordinates]${m.reset},
                   L.descriptor ${m.bold}${c.fg.black}AS${m.reset} ${m.dim}${c.fg.yellow}[properties.descriptor]${m.reset},
                   C.name ${m.bold}${c.fg.black}AS${m.reset} ${m.dim}${c.fg.yellow}[properties.class]${m.reset}
               ${m.dim}${c.fg.cyan}FROM${m.reset} Locators L
               ${m.dim}${c.fg.cyan}INNER${m.reset} ${m.dim}${c.fg.cyan}JOIN${m.reset} Locator_Classes C ${m.dim}${c.fg.cyan}ON${m.reset} L.lcid = C.lcid
               ${m.dim}${c.fg.cyan}WHERE${m.reset} L.lid = 20295
               FOR JSON PATH`;

    t.is(output, expected);
});
/*
test('custom data types and keywords', t => {
    const options = {
        dataTypes:            { mode: 'dim', fg: 'green', types: ['GEOMETRY', 'POINT', 'JSON'] },
        standardKeywords:     { mode: 'bold', fg: 'black', keywords: ['SELECT', 'FROM', 'INNER', 'JOIN', 'ON', 'WHERE', 'AS', 'FOR', 'PATH'] },
        lesserKeywords:       { mode: 'dim', fg: 'red', keywords: ['FORMAT', 'FORMATMESSAGE', 'STX', 'STY', 'FEATURE', 'QUERY'] }
    };

    const print = igniculus(Object.assign(options, echo));

    const output = print(statement_d);
    const expected =
        dedent`${m.bold}${c.fg.black}SELECT${m.reset} 'Feature' ${m.bold}${c.fg.black}as${m.reset} type, 'Point' ${m.bold}${c.fg.black}as${m.reset} [geometry.type],
                   JSON_QUERY(${m.dim}${c.fg.red}FORMATMESSAGE${m.reset}('[%s,%s]',
                       ${m.dim}${c.fg.red}FORMAT${m.reset}(L.position.${m.dim}${c.fg.red}STY${m.reset}, N'0.##################################################'),
                       ${m.dim}${c.fg.red}FORMAT${m.reset}(L.position.${m.dim}${c.fg.red}STX${m.reset}, N'0.##################################################')
                   )) ${m.bold}${c.fg.black}as${m.reset} [geometry.coordinates],
                   L.descriptor ${m.bold}${c.fg.black}as${m.reset} [properties.descriptor],
                   C.name ${m.bold}${c.fg.black}as${m.reset} [properties.class]
               ${m.bold}${c.fg.black}FROM${m.reset} Locators L
               ${m.bold}${c.fg.black}INNER${m.reset} ${m.bold}${c.fg.black}JOIN${m.reset} Locator_Classes C ${m.bold}${c.fg.black}ON${m.reset} L.lcid = C.lcid
               ${m.bold}${c.fg.black}WHERE${m.reset} L.lid = 20295
               ${m.bold}${c.fg.black}FOR${m.reset} ${m.dim}${c.fg.green}JSON${m.reset} ${m.bold}${c.fg.black}PATH${m.reset}`;

    t.is(output, expected);
});
*/
test('custom data types and keywords', t => {
    const options = {
        dataTypes:            { mode: 'dim', fg: 'green', types: ['GEOMETRY', 'POINT', 'JSON'] },
        standardKeywords:     { mode: 'bold', fg: 'black', keywords: ['SELECT', 'FROM', 'INNER', 'JOIN', 'ON', 'WHERE', 'AS', 'FOR', 'PATH'] },
        lesserKeywords:       { mode: 'dim', fg: 'red', keywords: ['FORMAT', 'FORMATMESSAGE', 'STX', 'STY', 'FEATURE', 'QUERY'] }
    };

    const print = igniculus(Object.assign(options, echo));

    const output = print(statement_c);
    const expected =
        dedent`${m.bold}${c.fg.black}SELECT${m.reset} 'Feature' ${m.bold}${c.fg.black}AS${m.reset} type, 'Point' ${m.bold}${c.fg.black}AS${m.reset} [geometry.type],
                   JSON_QUERY(${m.dim}${c.fg.red}FORMATMESSAGE${m.reset}('[%s,%s]',
                       ${m.dim}${c.fg.red}FORMAT${m.reset}(L.position.${m.dim}${c.fg.red}STY${m.reset}, N'0.##################################################'),
                       ${m.dim}${c.fg.red}FORMAT${m.reset}(L.position.${m.dim}${c.fg.red}STX${m.reset}, N'0.##################################################')
                   )) ${m.bold}${c.fg.black}AS${m.reset} [geometry.coordinates],
                   L.descriptor ${m.bold}${c.fg.black}AS${m.reset} [properties.descriptor],
                   C.name ${m.bold}${c.fg.black}AS${m.reset} [properties.class]
               ${m.bold}${c.fg.black}FROM${m.reset} Locators L
               ${m.bold}${c.fg.black}INNER${m.reset} ${m.bold}${c.fg.black}JOIN${m.reset} Locator_Classes C ${m.bold}${c.fg.black}ON${m.reset} L.lcid = C.lcid
               ${m.bold}${c.fg.black}WHERE${m.reset} L.lid = 20295
               ${m.bold}${c.fg.black}FOR${m.reset} ${m.dim}${c.fg.green}JSON${m.reset} ${m.bold}${c.fg.black}PATH${m.reset}`;

    t.is(output, expected);
});
/*
test('custom data types and keywords among constant and identifiers', t => {
    const options = {
        constants:                { mode: 'inverse', bg: 'black', fg: 'red' },
        delimitedIdentifiers:     { mode: 'italic', bg: 'yellow', fg: 'black' },
        dataTypes:                { mode: 'dim', fg: 'green', types: ['GEOMETRY', 'POINT', 'JSON'] },
        standardKeywords:         { mode: 'bold', fg: 'black', keywords: ['SELECT', 'FROM', 'INNER', 'JOIN', 'ON', 'WHERE', 'AS', 'FOR', 'PATH'] },
        lesserKeywords:           { mode: 'dim', fg: 'red', keywords: ['FORMAT', 'FORMATMESSAGE', 'STX', 'STY', 'FEATURE', 'QUERY'] }
    };

    const print = igniculus(Object.assign(options, echo));

    const output = print(statement_d);
    const expected =
        dedent`${m.bold}${c.fg.black}SELECT${m.reset} ${m.inverse}${c.bg.black}${c.fg.red}'Feature'${m.reset} ${m.bold}${c.fg.black}as${m.reset} type, ${m.inverse}${c.bg.black}${c.fg.red}'Point'${m.reset} ${m.bold}${c.fg.black}as${m.reset} ${m.italic}${c.bg.yellow}${c.fg.black}[geometry.type]${m.reset},
                   JSON_QUERY(${m.dim}${c.fg.red}FORMATMESSAGE${m.reset}(${m.inverse}${c.bg.black}${c.fg.red}'[%s,%s]'${m.reset},
                       ${m.dim}${c.fg.red}FORMAT${m.reset}(L.position.${m.dim}${c.fg.red}STY${m.reset}, N${m.inverse}${c.bg.black}${c.fg.red}'0.##################################################'${m.reset}),
                       ${m.dim}${c.fg.red}FORMAT${m.reset}(L.position.${m.dim}${c.fg.red}STX${m.reset}, N${m.inverse}${c.bg.black}${c.fg.red}'0.##################################################'${m.reset})
                   )) ${m.bold}${c.fg.black}as${m.reset} ${m.italic}${c.bg.yellow}${c.fg.black}[geometry.coordinates]${m.reset},
                   L.descriptor ${m.bold}${c.fg.black}as${m.reset} ${m.italic}${c.bg.yellow}${c.fg.black}[properties.descriptor]${m.reset},
                   C.name ${m.bold}${c.fg.black}as${m.reset} ${m.italic}${c.bg.yellow}${c.fg.black}[properties.class]${m.reset}
               ${m.bold}${c.fg.black}FROM${m.reset} Locators L
               ${m.bold}${c.fg.black}INNER${m.reset} ${m.bold}${c.fg.black}JOIN${m.reset} Locator_Classes C ${m.bold}${c.fg.black}ON${m.reset} L.lcid = C.lcid
               ${m.bold}${c.fg.black}WHERE${m.reset} L.lid = 20295
               ${m.bold}${c.fg.black}FOR${m.reset} ${m.dim}${c.fg.green}JSON${m.reset} ${m.bold}${c.fg.black}PATH${m.reset}`;

    t.is(output, expected);
});
*/
test('custom data types and keywords among constant and identifiers', t => {
    const options = {
        constants:                { mode: 'inverse', bg: 'black', fg: 'red' },
        delimitedIdentifiers:     { mode: 'italic', bg: 'yellow', fg: 'black' },
        dataTypes:                { mode: 'dim', fg: 'green', types: ['GEOMETRY', 'POINT', 'JSON'] },
        standardKeywords:         { mode: 'bold', fg: 'black', keywords: ['SELECT', 'FROM', 'INNER', 'JOIN', 'ON', 'WHERE', 'AS', 'FOR', 'PATH'] },
        lesserKeywords:           { mode: 'dim', fg: 'red', keywords: ['FORMAT', 'FORMATMESSAGE', 'STX', 'STY', 'FEATURE', 'QUERY'] }
    };

    const print = igniculus(Object.assign(options, echo));

    const output = print(statement_c);
    const expected =
        dedent`${m.bold}${c.fg.black}SELECT${m.reset} ${m.inverse}${c.bg.black}${c.fg.red}'Feature'${m.reset} ${m.bold}${c.fg.black}AS${m.reset} type, ${m.inverse}${c.bg.black}${c.fg.red}'Point'${m.reset} ${m.bold}${c.fg.black}AS${m.reset} ${m.italic}${c.bg.yellow}${c.fg.black}[geometry.type]${m.reset},
                   JSON_QUERY(${m.dim}${c.fg.red}FORMATMESSAGE${m.reset}(${m.inverse}${c.bg.black}${c.fg.red}'[%s,%s]'${m.reset},
                       ${m.dim}${c.fg.red}FORMAT${m.reset}(L.position.${m.dim}${c.fg.red}STY${m.reset}, N${m.inverse}${c.bg.black}${c.fg.red}'0.##################################################'${m.reset}),
                       ${m.dim}${c.fg.red}FORMAT${m.reset}(L.position.${m.dim}${c.fg.red}STX${m.reset}, N${m.inverse}${c.bg.black}${c.fg.red}'0.##################################################'${m.reset})
                   )) ${m.bold}${c.fg.black}AS${m.reset} ${m.italic}${c.bg.yellow}${c.fg.black}[geometry.coordinates]${m.reset},
                   L.descriptor ${m.bold}${c.fg.black}AS${m.reset} ${m.italic}${c.bg.yellow}${c.fg.black}[properties.descriptor]${m.reset},
                   C.name ${m.bold}${c.fg.black}AS${m.reset} ${m.italic}${c.bg.yellow}${c.fg.black}[properties.class]${m.reset}
               ${m.bold}${c.fg.black}FROM${m.reset} Locators L
               ${m.bold}${c.fg.black}INNER${m.reset} ${m.bold}${c.fg.black}JOIN${m.reset} Locator_Classes C ${m.bold}${c.fg.black}ON${m.reset} L.lcid = C.lcid
               ${m.bold}${c.fg.black}WHERE${m.reset} L.lid = 20295
               ${m.bold}${c.fg.black}FOR${m.reset} ${m.dim}${c.fg.green}JSON${m.reset} ${m.bold}${c.fg.black}PATH${m.reset}`;

    t.is(output, expected);
});
/*
test('colliding data types and keywords', t => {
    const options = {
        dataTypes:            { fg: 'magenta', types: ['DATE', 'DB'] },
        standardKeywords:     { mode: 'hidden', bg: 'black', fg: 'black', keywords: ['SELECT', 'CREATE', 'FROM', 'WHERE', 'USER', 'MASTER', 'DATE'] },
        lesserKeywords:       { mode: 'bold', fg: 'black', keywords: ['CONVERT', 'AS', 'MASTER'] }
    };

    const print = igniculus(Object.assign(options, echo));

    const output = print(statement_e);
    const expected =
        dedent`${m.hidden}${c.bg.black}${c.fg.black}SELECT${m.reset} name ${m.bold}${c.fg.black}AS${m.reset} 'user', ${m.bold}${c.fg.black}CONVERT${m.reset}(${c.fg.magenta}DATE${m.reset}, createdate, 102) ${m.bold}${c.fg.black}AS${m.reset} 'created'
               ${m.hidden}${c.bg.black}${c.fg.black}FROM${m.reset} ${m.hidden}${c.bg.black}${c.fg.black}master${m.reset}..syslogins
               ${m.hidden}${c.bg.black}${c.fg.black}WHERE${m.reset} dbname = 'master'`;

    t.is(output, expected);
});
*/
test('colliding data types and keywords', t => {
    const options = {
        dataTypes:            { fg: 'magenta', types: ['DATE', 'DB'] },
        standardKeywords:     { mode: 'hidden', bg: 'black', fg: 'black', keywords: ['SELECT', 'CREATE', 'FROM', 'WHERE', 'USER', 'MASTER', 'DATE'] },
        lesserKeywords:       { mode: 'bold', fg: 'black', keywords: ['CONVERT', 'AS', 'MASTER'] }
    };

    const print = igniculus(Object.assign(options, echo));

    const output = print(statement_d);
    const expected =
        dedent`${m.hidden}${c.bg.black}${c.fg.black}SELECT${m.reset} name ${m.bold}${c.fg.black}AS${m.reset} 'user', ${m.bold}${c.fg.black}CONVERT${m.reset}(${c.fg.magenta}DATE${m.reset}, createdate, 102) ${m.bold}${c.fg.black}AS${m.reset} 'created'
               ${m.hidden}${c.bg.black}${c.fg.black}FROM${m.reset} ${m.hidden}${c.bg.black}${c.fg.black}MASTER${m.reset}..syslogins
               ${m.hidden}${c.bg.black}${c.fg.black}WHERE${m.reset} dbname = 'master'`;

    t.is(output, expected);
});

test('prefix replace', t => {
    const options = {
        constants:            { fg: 'red' },
        dataTypes:            { fg: 'magenta' },
        standardKeywords:     { mode: 'bold', fg: 'black' },
        lesserKeywords:       { mode: 'bold', fg: 'black', keywords: ['DEALLOCATE', 'CURSOR', 'OPEN', 'CLOSE', 'FOR', 'FETCH', 'NEXT', 'BACKUP', 'TO', 'DISK', 'NOT', 'IN'] },
        prefix:               { fg: 'red', text: '$&', replace: /[\s\S]*\('monitor', 'index', 'library'\)/ }
    };

    const print = igniculus(Object.assign(options, echo));

    const output = print(statement_e);
    const expected =
        dedent`${c.fg.red}DECLARE @name VARCHAR(50)
               DECLARE @path VARCHAR(256)
               DECLARE @stamp VARCHAR(20)
               DECLARE @fileName VARCHAR(256)

               SET @path = 'U:\\Ark\\'
               SET @stamp = CONVERT(VARCHAR(20), GETDATE(), 112)

               DECLARE db_cursor CURSOR FOR
               SELECT name
               FROM master.dbo.sysdatabases
               WHERE name NOT IN ('monitor', 'index', 'library')${m.reset}

               ${m.bold}${c.fg.black}OPEN${m.reset} db_cursor
               ${m.bold}${c.fg.black}FETCH${m.reset} ${m.bold}${c.fg.black}NEXT${m.reset} ${m.bold}${c.fg.black}FROM${m.reset} db_cursor ${m.bold}${c.fg.black}INTO${m.reset} @name

               ${m.bold}${c.fg.black}WHILE${m.reset} @@FETCH_STATUS = 0
               ${m.bold}${c.fg.black}BEGIN${m.reset}
                      ${m.bold}${c.fg.black}SET${m.reset} @fileName = @path + @name + ${c.fg.red}'_'${m.reset} + @stamp + ${c.fg.red}'.bak'${m.reset}
                      ${m.bold}${c.fg.black}BACKUP${m.reset} ${m.bold}${c.fg.black}DATABASE${m.reset} @name ${m.bold}${c.fg.black}TO${m.reset} ${m.bold}${c.fg.black}DISK${m.reset} = @fileName

                      ${m.bold}${c.fg.black}FETCH${m.reset} ${m.bold}${c.fg.black}NEXT${m.reset} ${m.bold}${c.fg.black}FROM${m.reset} db_cursor ${m.bold}${c.fg.black}INTO${m.reset} @name
               ${m.bold}${c.fg.black}END${m.reset}

               ${m.bold}${c.fg.black}CLOSE${m.reset} db_cursor
               ${m.bold}${c.fg.black}DEALLOCATE${m.reset} db_cursor`;

    t.is(output, expected);
});

test('prefix remove', t => {
    const options = {
        constants:            { fg: 'red' },
        operators:            { fg: 'yellow' },
        standardKeywords:     { mode: 'bold', fg: 'black' },
        lesserKeywords:       { mode: 'bold', fg: 'black', keywords: ['DEALLOCATE', 'CURSOR', 'OPEN', 'CLOSE', 'FOR', 'FETCH', 'NEXT', 'BACKUP', 'TO', 'DISK', 'NOT', 'IN'] },
        prefix:               { replace: /[\s\S]*\('monitor', 'index', 'library'\)\n\n/ }
    };

    const print = igniculus(Object.assign(options, echo));

    const output = print(statement_e);
    const expected =
        dedent`${m.bold}${c.fg.black}OPEN${m.reset} db_cursor
               ${m.bold}${c.fg.black}FETCH${m.reset} ${m.bold}${c.fg.black}NEXT${m.reset} ${m.bold}${c.fg.black}FROM${m.reset} db_cursor ${m.bold}${c.fg.black}INTO${m.reset} @name

               ${m.bold}${c.fg.black}WHILE${m.reset} @@FETCH_STATUS ${c.fg.yellow}=${m.reset} 0
               ${m.bold}${c.fg.black}BEGIN${m.reset}
                      ${m.bold}${c.fg.black}SET${m.reset} @fileName ${c.fg.yellow}=${m.reset} @path ${c.fg.yellow}+${m.reset} @name ${c.fg.yellow}+${m.reset} ${c.fg.red}'_'${m.reset} ${c.fg.yellow}+${m.reset} @stamp ${c.fg.yellow}+${m.reset} ${c.fg.red}'.bak'${m.reset}
                      ${m.bold}${c.fg.black}BACKUP${m.reset} ${m.bold}${c.fg.black}DATABASE${m.reset} @name ${m.bold}${c.fg.black}TO${m.reset} ${m.bold}${c.fg.black}DISK${m.reset} ${c.fg.yellow}=${m.reset} @fileName

                      ${m.bold}${c.fg.black}FETCH${m.reset} ${m.bold}${c.fg.black}NEXT${m.reset} ${m.bold}${c.fg.black}FROM${m.reset} db_cursor ${m.bold}${c.fg.black}INTO${m.reset} @name
               ${m.bold}${c.fg.black}END${m.reset}

               ${m.bold}${c.fg.black}CLOSE${m.reset} db_cursor
               ${m.bold}${c.fg.black}DEALLOCATE${m.reset} db_cursor`;

    t.is(output, expected);
});