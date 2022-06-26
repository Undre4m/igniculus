/* eslint-disable max-len */

import test from 'ava';
import dedent from 'dedent';
import igniculus from '../src';

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
        white: '\x1b[37m',
    },
    bg: {
        black: '\x1b[40m',
        red: '\x1b[41m',
        green: '\x1b[42m',
        yellow: '\x1b[43m',
        blue: '\x1b[44m',
        magenta: '\x1b[45m',
        cyan: '\x1b[46m',
        white: '\x1b[47m',
    },
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

const statement_f = dedent`cReAtE fUnCtIoN get_child_schemas (@schema_id iNtEgEr)
                           ReTuRnS tAbLe As ReTuRn

                           SeLeCt name, schema_id As 'id'
                           FrOm sys.schemas
                           WhErE schema_id <> principal_id aNd principal_id = @schema_id`;

const statement_g = dedent`declare @@ char(2) = 'B0'
                           declare @0 decimal(3,3) = 0.326
                           declare @# varchar(32) = '@nix'

                           select @@ as category, [@nima_uid_1], [@nima_uid_2]
                           from [ARCs]
                           where domain=@# and exposure<=@0 and g@ is null`;

const statement_h = dedent`declare @Æőn char(2) = 'ƀ2'
                           declare @nìma_ünûlak char(36) = '1147D009-466B-4B50-BCA0-DFF1F1573899'
                           declare @ŴāłŤż@Đėśiğnator varchar(32) = '@ÕçÝ'
                           declare @Ø decimal(3,3) = 0.901
                           declare @ĶValue decimal(2,2) = 0.76

                           select @Æőn as category, [@nimüid_1], [@nimüid_2]
                           from "ÁRCs"
                           where [@nimüid_2] = @nìma_ünûlak and domain=@ŴāłŤż@Đėśiğnator and exposure>=@Ø and [ƶ@]>@ĶValue`;

const statement_i = dedent`/*
                           THE SCRIPT - BUILDING A QUERY WITHOUT SANITIZING DATA
                           $sql = "SELECT first_name, last_name, email FROM members WHERE username='".$value."' AND showpublic=1"
                           */

                           /*
                           ATTACKER INPUT USING LINE COMMENTING
                           admin' -- 
                           */

                           -- QUERY GENERATED --
                           SELECT first_name, last_name, email
                           FROM members
                           WHERE username='admin' -- '
                           AND showpublic=1`;

const statement_j = dedent`CREATE OR ALTER VIEW "---"."vw_A/*" AS

                           SELECT [*/], [--], [-]
                           FROM [/*d*/v].[dbo].[/*]

                           UNION ALL

                           SELECT U.[*/], TODATETIMEOFFSET(C.[--], '-03:00'),
                               CASE
                                   WHEN C.[-] COLLATE DATABASE_DEFAULT IN ('O','o') THEN '--E'
                                   WHEN C.[-] COLLATE DATABASE_DEFAULT IN ('I','i') THEN '--I'
                                   WHEN ISNUMERIC(C.[-]) = 1 THEN
                                       CASE C.[-]
                                           WHEN 0 THEN '/*E*/'
                                           WHEN 1 THEN '/*I*/'
                                       END
                               END
                           FROM [téngtòng].[dbo].[/*CHECK--] C
                           INNER JOIN [téngtòng].[dbo].[--USER*/] U ON -C.[USERID] = -U.[USERID]`;

const statement_k = dedent`/* May 13th, 2018 | 06:09:28.262 | http://server.local:8000 */
                           select [username], [password] from Users where [_uuid] = '4072FA1B-D9E7-4F0E-9553-5F2CFFE6CC7A' and [status] = 'active'`;

const statement_l = dedent`create table roid_logs (
                             id integer,
                             roid character varying(64) not null,
                             assessment_ts timestamp with time zone not null,
                             albedo double precision not null,
                             SMASS_C national character varying(2),
                             estimated_mass dec(10,5),
                             estimated_velocity numeric(9),
                             constraint pk_roid_logs primary key (id),
                             constraint fk_roids foreign key (roid) references roids (id)
                           )`;

const nyan = dedent`
    ,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
    ,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
    ,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
    ,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,.,,,,,,
    ,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,.?.,,,,,
    ,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,.,,,,,,
    ,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
    ,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
    ,.,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
    .?.,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
    ,.,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
    ,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
    ,,,,,,,,,,,,,,,,,,,,,,,,,''''''''''''''',,,,,,,,,,,,,,,,,,,,,,,,
    ,,>>>>>>>>,,,,,,,,>>>>>>'@@@@@@@@@@@@@@@',,,,,,,,,,,,,,,,,,,,,,,
    >>>>>>>>>>>>>>>>>>>>>>>'@@@$$$$$$$$$$$@@@',,,,,,,,,,,,,,,,,,,,,,
    >>&&&&&&&&>>>>>>>>&&&&&'@@$$$$$-$$-$$$$@@',,,,,,,,,,,,,,,,,,,,,,
    &&&&&&&&&&&&&&&&&&&&&&&'@$$-$$$$$$''$-$$@','',,,,,,,,,,,,,,,,,,,
    &&&&&&&&&&&&&&&&&&&&&&&'@$$$$$$$$'**'$$$@''**',,,,,,,,,,,,,,,,,,
    &&++++++++&&&&&&&&'''++'@$$$$$-$$'***$$$@'***',,,,,,,,,,,,,,,,,,
    ++++++++++++++++++**''+'@$$$$$$$$'***''''****',,,,,,,,,,,,,,,,,,
    ++++++++++++++++++'**'''@$$$$$$$$'***********',,,,,,,,,,,,,,,,,,
    ++########++++++++''**''@$$$$$$-'*************',,,,,,,,,,,,,,,,,
    ###################''**'@$-$$$$$'***?'****?'**',,,,,,,,,,,,,,,,,
    ####################''''@$$$$$$$'***''**:*''**',,,,,,,,,,,,,,,,,
    ##========########====''@@$$$-$$'*%%********%%',,,,,,,,,,,,,,,,,
    ======================='@@@$$$$$$'***'::':'**',,,,,,,,,,,,,,,,,,
    ==;;;;;;;;?=======;;;;'''@@@@@@@@@'*********',,,,,,,,,,,,,,,,,,,
    ;;;;;;;;;;;;;;;;;;;;;'***''''''''''''''''''',,,,,,,,,,,,,,,,,,,,
    ;;;;;;;;;;;;;;;;;?;;;'**'','*',,,,,'*','**',,,,,,,,,,,,,,,,,,,,,
    ;;,,,,,?.,;;;;?;;;,,,'''',,'',,,,,,,'',,'',,,,,,,,,,,,,,,,,,,,,,
    ,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
    ,,,,,,,,,,?.,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
    ,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
    ,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,.,,,,,,,,,,,,,,,,,,,,,,,
    ,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,.?.,,,,,,,,,,,,,,,,,,,,,,
    ,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,.,,,,,,,,,,,,,,,,,,,,,,,
    ,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
    ,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
    ,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
    ,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
    ,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,`;

test('object input', t => {
    const options = {
        rules: {
            comments: {
                style: { mode: 'dim', fg: 'white' },
            },
            constants: {
                style: { mode: 'dim', fg: 'red' },
            },
            delimitedIdentifiers: {
                style: { mode: 'dim', fg: 'yellow' },
            },
            variables: {
                style: { mode: 'dim', fg: 'magenta' },
            },
            dataTypes: {
                style: { mode: 'dim', fg: 'green' },
                casing: 'uppercase',
            },
            standardKeywords: {
                style: { mode: 'dim', fg: 'cyan' },
                casing: 'uppercase',
            },
            lesserKeywords: {
                style: { mode: 'bold', fg: 'black' },
                casing: 'uppercase',
            },
            prefix: {
                replace: /.*?: /,
            },
        },
    };

    const input = {
        toString: () => `/* GENERATED */ ${statement_b}`,
    };

    const print = igniculus(Object.assign(options, echo));

    const output = print(input);
    const expected = `${m.dim}${c.fg.white}/* GENERATED */${m.reset} ${m.dim}${c.fg.cyan}SELECT${m.reset} CURRENT_TIMESTAMP`;

    t.is(output, expected);
});

test('null input', t => {
    const print = igniculus();

    const output = print(null);

    t.is(output, undefined);
});

test('custom output', t => {
    const options = {
        // eslint-disable-next-line no-return-assign, no-param-reassign
        output: out => out.split('').reduce((a, v) => a += v.charCodeAt(0), 0),
    };

    const print = igniculus(options);

    const output = print(statement_a);
    const expected = 36876;

    t.is(output, expected);
});

test('comments', t => {
    const options = {
        rules: {
            comments: {
                style: { mode: 'bold', fg: 'black' },
            },
            constants: {
                style: { fg: 'red' },
            },
            dataTypes: {
                style: { fg: 'blue' },
            },
            standardKeywords: {
                style: { fg: 'blue' },
            },
            lesserKeywords: {
                style: { fg: 'blue' },
            },
        },
    };

    const print = igniculus(Object.assign(options, echo));

    const output = print(statement_i);
    const expected =
        dedent`${m.bold}${c.fg.black}/*
               THE SCRIPT - BUILDING A QUERY WITHOUT SANITIZING DATA
               $sql = "SELECT first_name, last_name, email FROM members WHERE username='".$value."' AND showpublic=1"
               */${m.reset}

               ${m.bold}${c.fg.black}/*
               ATTACKER INPUT USING LINE COMMENTING
               admin' -- 
               */${m.reset}

               ${m.bold}${c.fg.black}-- QUERY GENERATED --${m.reset}
               ${c.fg.blue}SELECT${m.reset} first_name, last_name, email
               ${c.fg.blue}FROM${m.reset} members
               ${c.fg.blue}WHERE${m.reset} username=${c.fg.red}'admin'${m.reset} ${m.bold}${c.fg.black}-- '${m.reset}
               ${c.fg.blue}AND${m.reset} showpublic=1`;

    t.is(output, expected);
});

test('not comments', t => {
    const options = {
        rules: {
            comments: {
                style: { mode: 'bold', fg: 'black' },
            },
            constants: {
                style: { fg: 'red' },
            },
            dataTypes: {
                style: { fg: 'blue' },
            },
            standardKeywords: {
                style: { fg: 'blue' },
            },
            lesserKeywords: {
                style: { fg: 'blue' },
            },
        },
    };

    const print = igniculus(Object.assign(options, echo));

    const output = print(statement_j);
    const expected =
        dedent`${c.fg.blue}CREATE${m.reset} ${c.fg.blue}OR${m.reset} ${c.fg.blue}ALTER${m.reset} ${c.fg.blue}VIEW${m.reset} "---"."vw_A/*" ${c.fg.blue}AS${m.reset}

               ${c.fg.blue}SELECT${m.reset} [*/], [--], [-]
               ${c.fg.blue}FROM${m.reset} [/*d*/v].[dbo].[/*]

               ${c.fg.blue}UNION${m.reset} ${c.fg.blue}ALL${m.reset}

               ${c.fg.blue}SELECT${m.reset} U.[*/], TODATETIMEOFFSET(C.[--], ${c.fg.red}'-03:00'${m.reset}),
                   ${c.fg.blue}CASE${m.reset}
                       ${c.fg.blue}WHEN${m.reset} C.[-] ${c.fg.blue}COLLATE${m.reset} DATABASE_DEFAULT ${c.fg.blue}IN${m.reset} (${c.fg.red}'O'${m.reset},${c.fg.red}'o'${m.reset}) ${c.fg.blue}THEN${m.reset} ${c.fg.red}'--E'${m.reset}
                       ${c.fg.blue}WHEN${m.reset} C.[-] ${c.fg.blue}COLLATE${m.reset} DATABASE_DEFAULT ${c.fg.blue}IN${m.reset} (${c.fg.red}'I'${m.reset},${c.fg.red}'i'${m.reset}) ${c.fg.blue}THEN${m.reset} ${c.fg.red}'--I'${m.reset}
                       ${c.fg.blue}WHEN${m.reset} ISNUMERIC(C.[-]) = 1 ${c.fg.blue}THEN${m.reset}
                           ${c.fg.blue}CASE${m.reset} C.[-]
                               ${c.fg.blue}WHEN${m.reset} 0 ${c.fg.blue}THEN${m.reset} ${c.fg.red}'/*E*/'${m.reset}
                               ${c.fg.blue}WHEN${m.reset} 1 ${c.fg.blue}THEN${m.reset} ${c.fg.red}'/*I*/'${m.reset}
                           ${c.fg.blue}END${m.reset}
                   ${c.fg.blue}END${m.reset}
               ${c.fg.blue}FROM${m.reset} [téngtòng].[dbo].[/*CHECK--] C
               ${c.fg.blue}INNER${m.reset} ${c.fg.blue}JOIN${m.reset} [téngtòng].[dbo].[--USER*/] U ${c.fg.blue}ON${m.reset} -C.[USERID] = -U.[USERID]`;

    t.is(output, expected);
});

test('no comment style', t => {
    const options = {
        rules: {
            numbers: {
                style: { mode: 'italic' },
            },
            constants: {
                style: { fg: 'yellow' },
            },
            delimitedIdentifiers: {
                style: { bg: 'yellow', fg: 'black' },
            },
            operators: {
                style: { fg: 'red' },
            },
            dataTypes: {
                style: { fg: 'blue' },
            },
            standardKeywords: {
                style: { fg: 'blue' },
            },
            lesserKeywords: {
                style: { fg: 'blue' },
            },
        },
    };

    const print = igniculus(Object.assign(options, echo));

    const output = print(statement_i);
    const expected =
        dedent`/*
               THE SCRIPT - BUILDING A QUERY WITHOUT SANITIZING DATA
               $sql = "SELECT first_name, last_name, email FROM members WHERE username='".$value."' AND showpublic=1"
               */

               /*
               ATTACKER INPUT USING LINE COMMENTING
               admin' -- 
               */

               -- QUERY GENERATED --
               ${c.fg.blue}SELECT${m.reset} first_name, last_name, email
               ${c.fg.blue}FROM${m.reset} members
               ${c.fg.blue}WHERE${m.reset} username${c.fg.red}=${m.reset}${c.fg.yellow}'admin'${m.reset} -- '
               ${c.fg.blue}AND${m.reset} showpublic${c.fg.red}=${m.reset}${m.italic}1${m.reset}`;

    t.is(output, expected);
});

test('constants', t => {
    const options = {
        rules: {
            constants: {
                style: { fg: 'red' },
            },
        },
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
        rules: {
            numbers: {
                style: { fg: 'blue' },
            },
        },
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
        rules: {
            operators: {
                style: { fg: 'black' },
            },
        },
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
        rules: {
            delimitedIdentifiers: {
                style: { fg: 'yellow' },
            },
        },
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

test('variables', t => {
    const options = {
        rules: {
            variables: {
                style: { fg: 'magenta' },
            },
        },
    };

    const print = igniculus(Object.assign(options, echo));

    const output = print(statement_e);
    const expected =
        dedent`DECLARE ${c.fg.magenta}@name${m.reset} VARCHAR(50)
               DECLARE ${c.fg.magenta}@path${m.reset} VARCHAR(256)
               DECLARE ${c.fg.magenta}@stamp${m.reset} VARCHAR(20)
               DECLARE ${c.fg.magenta}@fileName${m.reset} VARCHAR(256)

               SET ${c.fg.magenta}@path${m.reset} = 'U:\\Ark\\'
               SET ${c.fg.magenta}@stamp${m.reset} = CONVERT(VARCHAR(20), GETDATE(), 112)

               DECLARE db_cursor CURSOR FOR
               SELECT name
               FROM master.dbo.sysdatabases
               WHERE name NOT IN ('monitor', 'index', 'library')

               OPEN db_cursor
               FETCH NEXT FROM db_cursor INTO ${c.fg.magenta}@name${m.reset}

               WHILE ${c.fg.magenta}@@FETCH_STATUS${m.reset} = 0
               BEGIN
                   SET ${c.fg.magenta}@fileName${m.reset} = ${c.fg.magenta}@path${m.reset} + ${c.fg.magenta}@name${m.reset} + '_' + ${c.fg.magenta}@stamp${m.reset} + '.bak'
                   BACKUP DATABASE ${c.fg.magenta}@name${m.reset} TO DISK = ${c.fg.magenta}@fileName${m.reset}

                   FETCH NEXT FROM db_cursor INTO ${c.fg.magenta}@name${m.reset}
               END

               CLOSE db_cursor
               DEALLOCATE db_cursor`;

    t.is(output, expected);
});

test('dataTypes', t => {
    const options = {
        rules: {
            dataTypes: {
                style: { fg: 'green' },
            },
        },
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
        rules: {
            standardKeywords: {
                style: { fg: 'cyan' },
            },
        },
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
        rules: {
            lesserKeywords: {
                style: { fg: 'magenta' },
            },
        },
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
        rules: {
            prefix: {
                style: { fg: 'white' },
                text: '(query) ',
            },
        },
    };

    const print = igniculus(Object.assign(options, echo));

    const output = print(statement_b);
    const expected = `${c.fg.white}(query) ${m.reset}SELECT CURRENT_TIMESTAMP`;

    t.is(output, expected);
});

test('postfix', t => {
    const options = {
        rules: {
            postfix: {
                style: { fg: 'white' },
                text: ' █\n',
            },
        },
    };

    const print = igniculus(Object.assign(options, echo));

    const output = print(statement_b);
    const expected = `SELECT CURRENT_TIMESTAMP${c.fg.white} █\n${m.reset}`;

    t.is(output, expected);
});

test('data types and keywords', t => {
    const options = {
        rules: {
            dataTypes: {
                style: { mode: 'dim', fg: 'green' },
            },
            standardKeywords: {
                style: { mode: 'dim', fg: 'cyan' },
            },
            lesserKeywords: {
                style: { mode: 'bold', fg: 'black' },
            },
        },
    };

    const print = igniculus(Object.assign(options, echo));

    const output = print(statement_c);
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
               ${m.dim}${c.fg.cyan}FOR${m.reset} JSON PATH`;

    t.is(output, expected);
});

test('data types and keywords without case', t => {
    const options = {
        rules: {
            dataTypes: {
                style: { mode: 'dim', fg: 'green' },
            },
            standardKeywords: {
                style: { mode: 'dim', fg: 'cyan' },
            },
            lesserKeywords: {
                style: { mode: 'bold', fg: 'black' },
            },
        },
    };

    const print = igniculus(Object.assign(options, echo));

    const output = print(statement_f);
    const expected =
        dedent`${m.dim}${c.fg.cyan}cReAtE${m.reset} ${m.dim}${c.fg.cyan}fUnCtIoN${m.reset} get_child_schemas (@schema_id ${m.dim}${c.fg.green}iNtEgEr${m.reset})
               ${m.dim}${c.fg.cyan}ReTuRnS${m.reset} ${m.dim}${c.fg.cyan}tAbLe${m.reset} ${m.bold}${c.fg.black}As${m.reset} ${m.dim}${c.fg.cyan}ReTuRn${m.reset}

               ${m.dim}${c.fg.cyan}SeLeCt${m.reset} name, schema_id ${m.bold}${c.fg.black}As${m.reset} 'id'
               ${m.dim}${c.fg.cyan}FrOm${m.reset} sys.schemas
               ${m.dim}${c.fg.cyan}WhErE${m.reset} schema_id <> principal_id ${m.bold}${c.fg.black}aNd${m.reset} principal_id = @schema_id`;

    t.is(output, expected);
});

test('lowercase data types and keywords', t => {
    const options = {
        rules: {
            dataTypes: {
                style: { mode: 'dim', fg: 'green' },
                casing: 'lowercase',
            },
            standardKeywords: {
                style: { mode: 'dim', fg: 'cyan' },
                casing: 'lowercase',
            },
            lesserKeywords: {
                style: { mode: 'bold', fg: 'black' },
                casing: 'lowercase',
            },
        },
    };

    const print = igniculus(Object.assign(options, echo));

    const output = print(statement_f);
    const expected =
        dedent`${m.dim}${c.fg.cyan}create${m.reset} ${m.dim}${c.fg.cyan}function${m.reset} get_child_schemas (@schema_id ${m.dim}${c.fg.green}integer${m.reset})
               ${m.dim}${c.fg.cyan}returns${m.reset} ${m.dim}${c.fg.cyan}table${m.reset} ${m.bold}${c.fg.black}as${m.reset} ${m.dim}${c.fg.cyan}return${m.reset}

               ${m.dim}${c.fg.cyan}select${m.reset} name, schema_id ${m.bold}${c.fg.black}as${m.reset} 'id'
               ${m.dim}${c.fg.cyan}from${m.reset} sys.schemas
               ${m.dim}${c.fg.cyan}where${m.reset} schema_id <> principal_id ${m.bold}${c.fg.black}and${m.reset} principal_id = @schema_id`;

    t.is(output, expected);
});

test('uppercase data types and keywords', t => {
    const options = {
        rules: {
            dataTypes: {
                style: { mode: 'dim', fg: 'green' },
                casing: 'uppercase',
            },
            standardKeywords: {
                style: { mode: 'dim', fg: 'cyan' },
                casing: 'uppercase',
            },
            lesserKeywords: {
                style: { mode: 'bold', fg: 'black' },
                casing: 'uppercase',
            },
        },
    };

    const print = igniculus(Object.assign(options, echo));

    const output = print(statement_f);
    const expected =
        dedent`${m.dim}${c.fg.cyan}CREATE${m.reset} ${m.dim}${c.fg.cyan}FUNCTION${m.reset} get_child_schemas (@schema_id ${m.dim}${c.fg.green}INTEGER${m.reset})
               ${m.dim}${c.fg.cyan}RETURNS${m.reset} ${m.dim}${c.fg.cyan}TABLE${m.reset} ${m.bold}${c.fg.black}AS${m.reset} ${m.dim}${c.fg.cyan}RETURN${m.reset}

               ${m.dim}${c.fg.cyan}SELECT${m.reset} name, schema_id ${m.bold}${c.fg.black}AS${m.reset} 'id'
               ${m.dim}${c.fg.cyan}FROM${m.reset} sys.schemas
               ${m.dim}${c.fg.cyan}WHERE${m.reset} schema_id <> principal_id ${m.bold}${c.fg.black}AND${m.reset} principal_id = @schema_id`;

    t.is(output, expected);
});

test('styleless lower and uppercase data types and keywords', t => {
    const options = {
        rules: {
            dataTypes:        { casing: 'uppercase' },
            standardKeywords: { casing: 'lowercase' },
            lesserKeywords:   { casing: 'lowercase' },
        },
    };

    const print = igniculus(Object.assign(options, echo));

    const output = print(statement_f);
    const expected =
        dedent`create function get_child_schemas (@schema_id INTEGER)
               returns table as return

               select name, schema_id as 'id'
               from sys.schemas
               where schema_id <> principal_id and principal_id = @schema_id`;

    t.is(output, expected);
});

test('uppercase keywords and compound sql-92 data types', t => {
    const options = {
        rules: {
            numbers: {
                style: { mode: 'dim', fg: 'white' },
            },
            dataTypes: {
                style: { mode: 'dim', fg: 'yellow' },
                casing: 'lowercase',
            },
            standardKeywords: {
                style: { mode: 'dim', fg: 'red' },
                casing: 'uppercase',
            },
            lesserKeywords: {
                style: { mode: 'dim', fg: 'blue' },
                casing: 'lowercase',
            },
        },
    };

    const print = igniculus(Object.assign(options, echo));

    const output = print(statement_l);
    const expected =
        dedent`${m.dim}${c.fg.red}CREATE${m.reset} ${m.dim}${c.fg.red}TABLE${m.reset} roid_logs (
                 id ${m.dim}${c.fg.yellow}integer${m.reset},
                 roid ${m.dim}${c.fg.yellow}character${m.reset} ${m.dim}${c.fg.yellow}varying${m.reset}(${m.dim}${c.fg.white}64${m.reset}) ${m.dim}${c.fg.blue}not${m.reset} ${m.dim}${c.fg.blue}null${m.reset},
                 assessment_ts ${m.dim}${c.fg.yellow}timestamp${m.reset} ${m.dim}${c.fg.red}WITH${m.reset} ${m.dim}${c.fg.yellow}time zone${m.reset} ${m.dim}${c.fg.blue}not${m.reset} ${m.dim}${c.fg.blue}null${m.reset},
                 albedo ${m.dim}${c.fg.yellow}double precision${m.reset} ${m.dim}${c.fg.blue}not${m.reset} ${m.dim}${c.fg.blue}null${m.reset},
                 SMASS_C ${m.dim}${c.fg.yellow}national${m.reset} ${m.dim}${c.fg.yellow}character${m.reset} ${m.dim}${c.fg.yellow}varying${m.reset}(${m.dim}${c.fg.white}2${m.reset}),
                 estimated_mass ${m.dim}${c.fg.yellow}dec${m.reset}(${m.dim}${c.fg.white}10${m.reset},${m.dim}${c.fg.white}5${m.reset}),
                 estimated_velocity ${m.dim}${c.fg.yellow}numeric${m.reset}(${m.dim}${c.fg.white}9${m.reset}),
                 ${m.dim}${c.fg.red}CONSTRAINT${m.reset} pk_roid_logs ${m.dim}${c.fg.red}PRIMARY${m.reset} ${m.dim}${c.fg.red}KEY${m.reset} (id),
                 ${m.dim}${c.fg.red}CONSTRAINT${m.reset} fk_roids ${m.dim}${c.fg.red}FOREIGN${m.reset} ${m.dim}${c.fg.red}KEY${m.reset} (roid) ${m.dim}${c.fg.red}REFERENCES${m.reset} roids (id)
               )`;

    t.is(output, expected);
});

test('data types and keywords among constant and identifiers', t => {
    const options = {
        rules: {
            constants: {
                style: { mode: 'dim', fg: 'red' },
            },
            delimitedIdentifiers: {
                style: { mode: 'dim', fg: 'yellow' },
            },
            dataTypes: {
                style: { mode: 'dim', fg: 'green' },
            },
            standardKeywords: {
                style: { mode: 'dim', fg: 'cyan' },
            },
            lesserKeywords: {
                style: { mode: 'bold', fg: 'black' },
            },
        },
    };

    const print = igniculus(Object.assign(options, echo));

    const output = print(statement_c);
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
               ${m.dim}${c.fg.cyan}FOR${m.reset} JSON PATH`;

    t.is(output, expected);
});

test('custom data types and keywords', t => {
    const options = {
        rules: {
            dataTypes: {
                style: { mode: 'dim', fg: 'green' },
                types: ['GEOMETRY', 'POINT', 'JSON'],
            },
            standardKeywords: {
                style: { mode: 'bold', fg: 'black' },
                keywords: ['SELECT', 'FROM', 'INNER', 'JOIN', 'ON', 'WHERE', 'AS', 'FOR', 'PATH'],
            },
            lesserKeywords: {
                style: { mode: 'dim', fg: 'red' },
                keywords: ['FORMAT', 'FORMATMESSAGE', 'STX', 'STY', 'FEATURE', 'QUERY'],
            },
        },
    };

    const print = igniculus(Object.assign(options, echo));

    const output = print(statement_c);
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

test('custom included and excluded data types and keywords', t => {
    const options = {
        rules: {
            dataTypes: {
                style: { mode: ['bold', 'underline'], fg: 'magenta' },
                types: {
                    include: ['JSON', 'JSON_QUERY', 'FOR JSON PATH', 'STX', 'STY', 'FORMAT'],
                    exclude: ['FORMAT'],
                },
            },
            standardKeywords: {
                style: { mode: ['bold'], fg: 'yellow' },
                keywords: {
                    exclude: ['ON'],
                },
            },
            lesserKeywords: {
                style: { mode: ['bold'], fg: 'blue' },
                casing: 'lowercase',
                keywords: {
                    include: ['ON'],
                },
            },
        },
    };

    const print = igniculus(Object.assign(options, echo));

    const output = print(statement_c);
    const expected =
        dedent`${m.bold}${c.fg.yellow}SELECT${m.reset} 'Feature' ${m.bold}${c.fg.blue}as${m.reset} type, 'Point' ${m.bold}${c.fg.blue}as${m.reset} [geometry.type],
                   ${m.bold + m.underline}${c.fg.magenta}JSON_QUERY${m.reset}(FORMATMESSAGE('[%s,%s]',
                       FORMAT(L.position.${m.bold + m.underline}${c.fg.magenta}STY${m.reset}, N'0.##################################################'),
                       FORMAT(L.position.${m.bold + m.underline}${c.fg.magenta}STX${m.reset}, N'0.##################################################')
                   )) ${m.bold}${c.fg.blue}as${m.reset} [geometry.coordinates],
                   L.descriptor ${m.bold}${c.fg.blue}as${m.reset} [properties.descriptor],
                   C.name ${m.bold}${c.fg.blue}as${m.reset} [properties.class]
               ${m.bold}${c.fg.yellow}FROM${m.reset} Locators L
               ${m.bold}${c.fg.yellow}INNER${m.reset} ${m.bold}${c.fg.yellow}JOIN${m.reset} Locator_Classes C ${m.bold}${c.fg.blue}on${m.reset} L.lcid = C.lcid
               ${m.bold}${c.fg.yellow}WHERE${m.reset} L.lid = 20295
               ${m.bold + m.underline}${c.fg.magenta}FOR JSON PATH${m.reset}`;

    t.is(output, expected);
});

test('custom data types and keywords among constant and identifiers', t => {
    const options = {
        rules: {
            constants: {
                style: { mode: 'inverse', bg: 'black', fg: 'red' },
            },
            delimitedIdentifiers: {
                style: { mode: 'italic', bg: 'yellow', fg: 'black' },
            },
            dataTypes: {
                style: { mode: 'dim', fg: 'green' },
                types: ['GEOMETRY', 'POINT', 'JSON'],
            },
            standardKeywords: {
                style: { mode: 'bold', fg: 'black' },
                keywords: ['SELECT', 'FROM', 'INNER', 'JOIN', 'ON', 'WHERE', 'AS', 'FOR', 'PATH'],
            },
            lesserKeywords: {
                style: { mode: 'dim', fg: 'red' },
                keywords: ['FORMAT', 'FORMATMESSAGE', 'STX', 'STY', 'FEATURE', 'QUERY'],
            },
        },
    };

    const print = igniculus(Object.assign(options, echo));

    const output = print(statement_c);
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

test('colliding data types and keywords', t => {
    const options = {
        rules: {
            dataTypes: {
                style: { fg: 'magenta' },
                types: ['DATE', 'DB'],
            },
            standardKeywords: {
                style: { mode: 'hidden', bg: 'black', fg: 'black' },
                keywords: ['SELECT', 'CREATE', 'FROM', 'WHERE', 'USER', 'MASTER', 'DATE'],
            },
            lesserKeywords: {
                style: { mode: 'bold', fg: 'black' },
                keywords: ['CONVERT', 'AS', 'MASTER'],
            },
        },
    };

    const print = igniculus(Object.assign(options, echo));

    const output = print(statement_d);
    const expected =
        dedent`${m.hidden}${c.bg.black}${c.fg.black}SELECT${m.reset} name ${m.bold}${c.fg.black}AS${m.reset} 'user', ${m.bold}${c.fg.black}CONVERT${m.reset}(${c.fg.magenta}DATE${m.reset}, createdate, 102) ${m.bold}${c.fg.black}AS${m.reset} 'created'
               ${m.hidden}${c.bg.black}${c.fg.black}FROM${m.reset} ${m.hidden}${c.bg.black}${c.fg.black}master${m.reset}..syslogins
               ${m.hidden}${c.bg.black}${c.fg.black}WHERE${m.reset} dbname = 'master'`;

    t.is(output, expected);
});

test('wrongful options for data types and keywords', t => {
    const wrongs = [{
        types: null,
        casing: null,
    }, {
        types: {},
        keywords: {},
        casing: 'low',
    }, {
        types: { include: NaN, exclude: '' },
        keywords: { include: 0, exclude: 1 },
        casing: '',
    }];

    const expected =
        dedent`cReAtE fUnCtIoN get_child_schemas (@schema_id iNtEgEr)
               ReTuRnS tAbLe As ReTuRn

               SeLeCt name, schema_id As 'id'
               FrOm sys.schemas
               WhErE schema_id <> principal_id aNd principal_id = @schema_id`;

    t.is(igniculus({
        rules: {
            dataTypes: wrongs[0],
            standardKeywords: wrongs[1],
            lesserKeywords: wrongs[2],
        },
        ...echo,
    })(statement_f), expected);

    t.is(igniculus({
        rules: {
            dataTypes: wrongs[1],
            standardKeywords: wrongs[2],
            lesserKeywords: wrongs[0],
        },
        ...echo,
    })(statement_f), expected);

    t.is(igniculus({
        rules: {
            dataTypes: wrongs[2],
            standardKeywords: wrongs[0],
            lesserKeywords: wrongs[1],
        },
        ...echo,
    })(statement_f), expected);
});

test('numbers and data types among variables', t => {
    const options = {
        rules: {
            numbers: {
                style: { mode: 'italic' },
            },
            constants: {
                style: { mode: 'dim', fg: 'white' },
            },
            variables: {
                style: { fg: 'red' },
            },
            dataTypes: {
                style: { fg: 'blue' },
                types: ['char', 'varchar', 'decimal', 'uid'],
                casing: 'lowercase',
            },
            standardKeywords: {
                style: { fg: 'yellow' },
            },
            lesserKeywords: {
                style: { mode: 'bold', fg: 'black' },
            },
        },
    };

    const print = igniculus(Object.assign(options, echo));

    const output = print(statement_g);
    const expected =
        dedent`${c.fg.yellow}declare${m.reset} ${c.fg.red}@@${m.reset} ${c.fg.blue}char${m.reset}(${m.italic}2${m.reset}) = ${m.dim}${c.fg.white}'B0'${m.reset}
               ${c.fg.yellow}declare${m.reset} ${c.fg.red}@0${m.reset} ${c.fg.blue}decimal${m.reset}(${m.italic}3${m.reset},${m.italic}3${m.reset}) = ${m.italic}0.326${m.reset}
               ${c.fg.yellow}declare${m.reset} ${c.fg.red}@#${m.reset} ${c.fg.blue}varchar${m.reset}(${m.italic}32${m.reset}) = ${m.dim}${c.fg.white}'@nix'${m.reset}

               ${c.fg.yellow}select${m.reset} ${c.fg.red}@@${m.reset} ${m.bold}${c.fg.black}as${m.reset} category, [@nima_uid_1], [@nima_uid_2]
               ${c.fg.yellow}from${m.reset} [ARCs]
               ${c.fg.yellow}where${m.reset} domain=${c.fg.red}@#${m.reset} ${m.bold}${c.fg.black}and${m.reset} exposure<=${c.fg.red}@0${m.reset} ${m.bold}${c.fg.black}and${m.reset} g@ ${m.bold}${c.fg.black}is${m.reset} ${m.bold}${c.fg.black}null${m.reset}`;

    t.is(output, expected);
});

test('extended latin variables, constants and identifiers', t => {
    const options = {
        rules: {
            numbers: {
                style: { mode: 'italic' },
            },
            constants: {
                style: { mode: 'dim', fg: 'white' },
            },
            delimitedIdentifiers: {
                style: { fg: 'blue' },
            },
            variables: {
                style: { fg: 'red' },
            },
            standardKeywords: {
                style: { fg: 'yellow' },
            },
            lesserKeywords: {
                style: { mode: 'bold', fg: 'black' },
            },
        },
    };

    const print = igniculus(Object.assign(options, echo));

    const output = print(statement_h);
    const expected =
        dedent`${c.fg.yellow}declare${m.reset} ${c.fg.red}@Æőn${m.reset} char(${m.italic}2${m.reset}) = ${m.dim}${c.fg.white}'ƀ2'${m.reset}
               ${c.fg.yellow}declare${m.reset} ${c.fg.red}@nìma_ünûlak${m.reset} char(${m.italic}36${m.reset}) = ${m.dim}${c.fg.white}'1147D009-466B-4B50-BCA0-DFF1F1573899'${m.reset}
               ${c.fg.yellow}declare${m.reset} ${c.fg.red}@ŴāłŤż@Đėśiğnator${m.reset} varchar(${m.italic}32${m.reset}) = ${m.dim}${c.fg.white}'@ÕçÝ'${m.reset}
               ${c.fg.yellow}declare${m.reset} ${c.fg.red}@Ø${m.reset} decimal(${m.italic}3${m.reset},${m.italic}3${m.reset}) = ${m.italic}0.901${m.reset}
               ${c.fg.yellow}declare${m.reset} ${c.fg.red}@ĶValue${m.reset} decimal(${m.italic}2${m.reset},${m.italic}2${m.reset}) = ${m.italic}0.76${m.reset}

               ${c.fg.yellow}select${m.reset} ${c.fg.red}@Æőn${m.reset} ${m.bold}${c.fg.black}as${m.reset} category, ${c.fg.blue}[@nimüid_1]${m.reset}, ${c.fg.blue}[@nimüid_2]${m.reset}
               ${c.fg.yellow}from${m.reset} ${c.fg.blue}"ÁRCs"${m.reset}
               ${c.fg.yellow}where${m.reset} ${c.fg.blue}[@nimüid_2]${m.reset} = ${c.fg.red}@nìma_ünûlak${m.reset} ${m.bold}${c.fg.black}and${m.reset} domain=${c.fg.red}@ŴāłŤż@Đėśiğnator${m.reset} ${m.bold}${c.fg.black}and${m.reset} exposure>=${c.fg.red}@Ø${m.reset} ${m.bold}${c.fg.black}and${m.reset} ${c.fg.blue}[ƶ@]${m.reset}>${c.fg.red}@ĶValue${m.reset}`;

    t.is(output, expected);
});

test('prefix string replace', t => {
    const options = {
        rules: {
            prefix: {
                text: '',
                replace: 'SELECT CURRENT',
            },
        },
    };

    const print = igniculus(Object.assign(options, echo));

    const output = print(statement_b);
    const expected = '_TIMESTAMP';

    t.is(output, expected);
});

test('prefix regexp replace', t => {
    const options = {
        rules: {
            constants: {
                style: { fg: 'red' },
            },
            dataTypes: {
                style: { fg: 'magenta' },
            },
            standardKeywords: {
                style: { mode: 'bold', fg: 'black' },
            },
            lesserKeywords: {
                style: { mode: 'bold', fg: 'black' },
                keywords: ['DEALLOCATE', 'CURSOR', 'OPEN', 'CLOSE', 'FOR', 'FETCH', 'NEXT', 'BACKUP', 'TO', 'DISK', 'NOT', 'IN'],
            },
            prefix: {
                style: { fg: 'red' },
                text: '$&',
                replace: /[\s\S]*\('monitor', 'index', 'library'\)/,
            },
        },
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
        rules: {
            constants: {
                style: { fg: 'red' },
            },
            operators: {
                style: { fg: 'yellow' },
            },
            standardKeywords: {
                style: { mode: 'bold', fg: 'black' },
            },
            lesserKeywords: {
                style: { mode: 'bold', fg: 'black' },
                keywords: ['DEALLOCATE', 'CURSOR', 'OPEN', 'CLOSE', 'FOR', 'FETCH', 'NEXT', 'BACKUP', 'TO', 'DISK', 'NOT', 'IN'],
            },
            prefix: {
                replace: /[\s\S]*\('monitor', 'index', 'library'\)\n\n/,
            },
        },
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

test('custom-built rules', t => {
    const options = {
        rules: {
            constants: {
                style: { mode: 'bold', fg: 'red' },
            },
            delimitedIdentifiers: {
                style: { mode: 'bold', fg: 'cyan' },
            },
            standardKeywords: {
                style: { fg: 'blue' },
                casing: 'uppercase',
            },
            lesserKeywords: {
                style: { mode: 'bold', fg: 'red' },
                casing: 'uppercase',
            },
        },
        own: {
            _: {
                regexp: /$/,
                transform: null,
            },
            nop: {
                regexp: /\u0000/,
            },
            comments: {
                regexp: /(-{2}.*)|(\/\*(.|[\r\n])*?\*\/)[\r\n]*/g,
                transform: '',
            },
            uuidv4s: {
                style: { mode: 'bold', fg: 'black' },
                regexp: /'[A-F\d]{8}-[A-F\d]{4}-4[A-F\d]{3}-[89AB][A-F\d]{3}-[A-F\d]{12}'/gi,
                transform: (uuid) => uuid.replace(/\w{1}/g, 'x'),
            },
        },
    };

    const print = igniculus(Object.assign(options, echo));

    const output = print(statement_k);
    const expected =
        dedent`${c.fg.blue}SELECT${m.reset} ${m.bold}${c.fg.cyan}[username]${m.reset}, ${m.bold}${c.fg.cyan}[password]${m.reset} ${c.fg.blue}FROM${m.reset} Users ${c.fg.blue}WHERE${m.reset} ${m.bold}${c.fg.cyan}[_uuid]${m.reset} = ${m.bold}${c.fg.black}'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'${m.reset} ${m.bold}${c.fg.red}AND${m.reset} ${m.bold}${c.fg.cyan}[status]${m.reset} = ${m.bold}${c.fg.red}'active'${m.reset}`;

    t.is(output, expected);
});

test('custom-built nyan portrait', t => {
    const options = {
        own: {
            cyan: {
                style: { mode: 'dim', bg: 'blue', fg: 'blue' },
                regexp: /,+/g,
                transform: (v) => '█'.repeat(v.length),
            },
            black: {
                style: { mode: 'dim', fg: 'black' },
                regexp: /'+/g,
                transform: (v) => '█'.repeat(v.length),
            },
            halfblack: {
                style: { mode: 'bold', bg: 'black', fg: 'black' },
                regexp: /:+/g,
                transform: (v) => '▀'.repeat(v.length),
            },
            gray: {
                style: { mode: 'bold', fg: 'black' },
                regexp: /\*+/g,
                transform: (v) => '█'.repeat(v.length),
            },
            white: {
                style: { mode: 'bold', bg: 'white', fg: 'white' },
                regexp: /\?+/g,
                transform: (v) => '█'.repeat(v.length),
            },
            spray: {
                style: { mode: 'bold', bg: 'blue', fg: 'white' },
                regexp: /\.+/g,
                transform: (v) => '░'.repeat(v.length),
            },
            bread: {
                style: { mode: 'bold', bg: 'red', fg: 'white' },
                regexp: /@+/g,
                transform: (v) => '░'.repeat(v.length),
            },
            red: {
                style: { mode: 'bold', fg: 'red' },
                regexp: />+/g,
                transform: (v) => '█'.repeat(v.length),
            },
            orange: {
                style: { mode: 'bold', bg: 'red', fg: 'yellow' },
                regexp: /&+/g,
                transform: (v) => '▒'.repeat(v.length),
            },
            yellow: {
                style: { mode: 'bold', bg: 'yellow', fg: 'yellow' },
                regexp: /\++/g,
                transform: (v) => '█'.repeat(v.length),
            },
            green: {
                style: { mode: 'bold', bg: 'green', fg: 'green' },
                regexp: /#+/g,
                transform: (v) => '█'.repeat(v.length),
            },
            blue: {
                style: { mode: 'bold', bg: 'blue', fg: 'blue' },
                regexp: /=+/g,
                transform: (v) => '█'.repeat(v.length),
            },
            purple: {
                style: { mode: 'dim', bg: 'blue', fg: 'magenta' },
                regexp: /;+/g,
                transform: (v) => '▓'.repeat(v.length),
            },
            cranberry: {
                style: { mode: 'bold', bg: 'black', fg: 'magenta' },
                regexp: /-+/g,
                transform: (v) => '▒'.repeat(v.length),
            },
            pink: {
                style: { mode: 'dim', bg: 'magenta', fg: 'magenta' },
                regexp: /\$+/g,
                transform: (v) => '█'.repeat(v.length),
            },
            blush: {
                style: { mode: 'bold', bg: 'red', fg: 'black' },
                regexp: /%+/g,
                transform: (v) => '▓'.repeat(v.length),
            },
        },
    };

    const print = igniculus(Object.assign(options, echo));

    const output = print(nyan);
    const expected =
        dedent`${m.dim}${c.bg.blue}${c.fg.blue}████████████████████████████████████████████████████████████████${m.reset}
               ${m.dim}${c.bg.blue}${c.fg.blue}████████████████████████████████████████████████████████████████${m.reset}
               ${m.dim}${c.bg.blue}${c.fg.blue}████████████████████████████████████████████████████████████████${m.reset}
               ${m.dim}${c.bg.blue}${c.fg.blue}█████████████████████████████████████████████████████████${m.reset}${m.bold}${c.bg.blue}${c.fg.white}░${m.reset}${m.dim}${c.bg.blue}${c.fg.blue}██████${m.reset}
               ${m.dim}${c.bg.blue}${c.fg.blue}████████████████████████████████████████████████████████${m.reset}${m.bold}${c.bg.blue}${c.fg.white}░${m.reset}${m.bold}${c.bg.white}${c.fg.white}█${m.reset}${m.bold}${c.bg.blue}${c.fg.white}░${m.reset}${m.dim}${c.bg.blue}${c.fg.blue}█████${m.reset}
               ${m.dim}${c.bg.blue}${c.fg.blue}█████████████████████████████████████████████████████████${m.reset}${m.bold}${c.bg.blue}${c.fg.white}░${m.reset}${m.dim}${c.bg.blue}${c.fg.blue}██████${m.reset}
               ${m.dim}${c.bg.blue}${c.fg.blue}████████████████████████████████████████████████████████████████${m.reset}
               ${m.dim}${c.bg.blue}${c.fg.blue}████████████████████████████████████████████████████████████████${m.reset}
               ${m.dim}${c.bg.blue}${c.fg.blue}█${m.reset}${m.bold}${c.bg.blue}${c.fg.white}░${m.reset}${m.dim}${c.bg.blue}${c.fg.blue}██████████████████████████████████████████████████████████████${m.reset}
               ${m.bold}${c.bg.blue}${c.fg.white}░${m.reset}${m.bold}${c.bg.white}${c.fg.white}█${m.reset}${m.bold}${c.bg.blue}${c.fg.white}░${m.reset}${m.dim}${c.bg.blue}${c.fg.blue}█████████████████████████████████████████████████████████████${m.reset}
               ${m.dim}${c.bg.blue}${c.fg.blue}█${m.reset}${m.bold}${c.bg.blue}${c.fg.white}░${m.reset}${m.dim}${c.bg.blue}${c.fg.blue}██████████████████████████████████████████████████████████████${m.reset}
               ${m.dim}${c.bg.blue}${c.fg.blue}████████████████████████████████████████████████████████████████${m.reset}
               ${m.dim}${c.bg.blue}${c.fg.blue}█████████████████████████${m.reset}${m.dim}${c.fg.black}███████████████${m.reset}${m.dim}${c.bg.blue}${c.fg.blue}████████████████████████${m.reset}
               ${m.dim}${c.bg.blue}${c.fg.blue}██${m.reset}${m.bold}${c.fg.red}████████${m.reset}${m.dim}${c.bg.blue}${c.fg.blue}████████${m.reset}${m.bold}${c.fg.red}██████${m.reset}${m.dim}${c.fg.black}█${m.reset}${m.bold}${c.bg.red}${c.fg.white}░░░░░░░░░░░░░░░${m.reset}${m.dim}${c.fg.black}█${m.reset}${m.dim}${c.bg.blue}${c.fg.blue}███████████████████████${m.reset}
               ${m.bold}${c.fg.red}███████████████████████${m.reset}${m.dim}${c.fg.black}█${m.reset}${m.bold}${c.bg.red}${c.fg.white}░░░${m.reset}${m.dim}${c.bg.magenta}${c.fg.magenta}███████████${m.reset}${m.bold}${c.bg.red}${c.fg.white}░░░${m.reset}${m.dim}${c.fg.black}█${m.reset}${m.dim}${c.bg.blue}${c.fg.blue}██████████████████████${m.reset}
               ${m.bold}${c.fg.red}██${m.reset}${m.bold}${c.bg.red}${c.fg.yellow}▒▒▒▒▒▒▒▒${m.reset}${m.bold}${c.fg.red}████████${m.reset}${m.bold}${c.bg.red}${c.fg.yellow}▒▒▒▒▒${m.reset}${m.dim}${c.fg.black}█${m.reset}${m.bold}${c.bg.red}${c.fg.white}░░${m.reset}${m.dim}${c.bg.magenta}${c.fg.magenta}█████${m.reset}${m.bold}${c.bg.black}${c.fg.magenta}▒${m.reset}${m.dim}${c.bg.magenta}${c.fg.magenta}██${m.reset}${m.bold}${c.bg.black}${c.fg.magenta}▒${m.reset}${m.dim}${c.bg.magenta}${c.fg.magenta}████${m.reset}${m.bold}${c.bg.red}${c.fg.white}░░${m.reset}${m.dim}${c.fg.black}█${m.reset}${m.dim}${c.bg.blue}${c.fg.blue}██████████████████████${m.reset}
               ${m.bold}${c.bg.red}${c.fg.yellow}▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒${m.reset}${m.dim}${c.fg.black}█${m.reset}${m.bold}${c.bg.red}${c.fg.white}░${m.reset}${m.dim}${c.bg.magenta}${c.fg.magenta}██${m.reset}${m.bold}${c.bg.black}${c.fg.magenta}▒${m.reset}${m.dim}${c.bg.magenta}${c.fg.magenta}██████${m.reset}${m.dim}${c.fg.black}██${m.reset}${m.dim}${c.bg.magenta}${c.fg.magenta}█${m.reset}${m.bold}${c.bg.black}${c.fg.magenta}▒${m.reset}${m.dim}${c.bg.magenta}${c.fg.magenta}██${m.reset}${m.bold}${c.bg.red}${c.fg.white}░${m.reset}${m.dim}${c.fg.black}█${m.reset}${m.dim}${c.bg.blue}${c.fg.blue}█${m.reset}${m.dim}${c.fg.black}██${m.reset}${m.dim}${c.bg.blue}${c.fg.blue}███████████████████${m.reset}
               ${m.bold}${c.bg.red}${c.fg.yellow}▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒${m.reset}${m.dim}${c.fg.black}█${m.reset}${m.bold}${c.bg.red}${c.fg.white}░${m.reset}${m.dim}${c.bg.magenta}${c.fg.magenta}████████${m.reset}${m.dim}${c.fg.black}█${m.reset}${m.bold}${c.fg.black}██${m.reset}${m.dim}${c.fg.black}█${m.reset}${m.dim}${c.bg.magenta}${c.fg.magenta}███${m.reset}${m.bold}${c.bg.red}${c.fg.white}░${m.reset}${m.dim}${c.fg.black}██${m.reset}${m.bold}${c.fg.black}██${m.reset}${m.dim}${c.fg.black}█${m.reset}${m.dim}${c.bg.blue}${c.fg.blue}██████████████████${m.reset}
               ${m.bold}${c.bg.red}${c.fg.yellow}▒▒${m.reset}${m.bold}${c.bg.yellow}${c.fg.yellow}████████${m.reset}${m.bold}${c.bg.red}${c.fg.yellow}▒▒▒▒▒▒▒▒${m.reset}${m.dim}${c.fg.black}███${m.reset}${m.bold}${c.bg.yellow}${c.fg.yellow}██${m.reset}${m.dim}${c.fg.black}█${m.reset}${m.bold}${c.bg.red}${c.fg.white}░${m.reset}${m.dim}${c.bg.magenta}${c.fg.magenta}█████${m.reset}${m.bold}${c.bg.black}${c.fg.magenta}▒${m.reset}${m.dim}${c.bg.magenta}${c.fg.magenta}██${m.reset}${m.dim}${c.fg.black}█${m.reset}${m.bold}${c.fg.black}███${m.reset}${m.dim}${c.bg.magenta}${c.fg.magenta}███${m.reset}${m.bold}${c.bg.red}${c.fg.white}░${m.reset}${m.dim}${c.fg.black}█${m.reset}${m.bold}${c.fg.black}███${m.reset}${m.dim}${c.fg.black}█${m.reset}${m.dim}${c.bg.blue}${c.fg.blue}██████████████████${m.reset}
               ${m.bold}${c.bg.yellow}${c.fg.yellow}██████████████████${m.reset}${m.bold}${c.fg.black}██${m.reset}${m.dim}${c.fg.black}██${m.reset}${m.bold}${c.bg.yellow}${c.fg.yellow}█${m.reset}${m.dim}${c.fg.black}█${m.reset}${m.bold}${c.bg.red}${c.fg.white}░${m.reset}${m.dim}${c.bg.magenta}${c.fg.magenta}████████${m.reset}${m.dim}${c.fg.black}█${m.reset}${m.bold}${c.fg.black}███${m.reset}${m.dim}${c.fg.black}████${m.reset}${m.bold}${c.fg.black}████${m.reset}${m.dim}${c.fg.black}█${m.reset}${m.dim}${c.bg.blue}${c.fg.blue}██████████████████${m.reset}
               ${m.bold}${c.bg.yellow}${c.fg.yellow}██████████████████${m.reset}${m.dim}${c.fg.black}█${m.reset}${m.bold}${c.fg.black}██${m.reset}${m.dim}${c.fg.black}███${m.reset}${m.bold}${c.bg.red}${c.fg.white}░${m.reset}${m.dim}${c.bg.magenta}${c.fg.magenta}████████${m.reset}${m.dim}${c.fg.black}█${m.reset}${m.bold}${c.fg.black}███████████${m.reset}${m.dim}${c.fg.black}█${m.reset}${m.dim}${c.bg.blue}${c.fg.blue}██████████████████${m.reset}
               ${m.bold}${c.bg.yellow}${c.fg.yellow}██${m.reset}${m.bold}${c.bg.green}${c.fg.green}████████${m.reset}${m.bold}${c.bg.yellow}${c.fg.yellow}████████${m.reset}${m.dim}${c.fg.black}██${m.reset}${m.bold}${c.fg.black}██${m.reset}${m.dim}${c.fg.black}██${m.reset}${m.bold}${c.bg.red}${c.fg.white}░${m.reset}${m.dim}${c.bg.magenta}${c.fg.magenta}██████${m.reset}${m.bold}${c.bg.black}${c.fg.magenta}▒${m.reset}${m.dim}${c.fg.black}█${m.reset}${m.bold}${c.fg.black}█████████████${m.reset}${m.dim}${c.fg.black}█${m.reset}${m.dim}${c.bg.blue}${c.fg.blue}█████████████████${m.reset}
               ${m.bold}${c.bg.green}${c.fg.green}███████████████████${m.reset}${m.dim}${c.fg.black}██${m.reset}${m.bold}${c.fg.black}██${m.reset}${m.dim}${c.fg.black}█${m.reset}${m.bold}${c.bg.red}${c.fg.white}░${m.reset}${m.dim}${c.bg.magenta}${c.fg.magenta}█${m.reset}${m.bold}${c.bg.black}${c.fg.magenta}▒${m.reset}${m.dim}${c.bg.magenta}${c.fg.magenta}█████${m.reset}${m.dim}${c.fg.black}█${m.reset}${m.bold}${c.fg.black}███${m.reset}${m.bold}${c.bg.white}${c.fg.white}█${m.reset}${m.dim}${c.fg.black}█${m.reset}${m.bold}${c.fg.black}████${m.reset}${m.bold}${c.bg.white}${c.fg.white}█${m.reset}${m.dim}${c.fg.black}█${m.reset}${m.bold}${c.fg.black}██${m.reset}${m.dim}${c.fg.black}█${m.reset}${m.dim}${c.bg.blue}${c.fg.blue}█████████████████${m.reset}
               ${m.bold}${c.bg.green}${c.fg.green}████████████████████${m.reset}${m.dim}${c.fg.black}████${m.reset}${m.bold}${c.bg.red}${c.fg.white}░${m.reset}${m.dim}${c.bg.magenta}${c.fg.magenta}███████${m.reset}${m.dim}${c.fg.black}█${m.reset}${m.bold}${c.fg.black}███${m.reset}${m.dim}${c.fg.black}██${m.reset}${m.bold}${c.fg.black}██${m.reset}${m.bold}${c.bg.black}${c.fg.black}▀${m.reset}${m.bold}${c.fg.black}█${m.reset}${m.dim}${c.fg.black}██${m.reset}${m.bold}${c.fg.black}██${m.reset}${m.dim}${c.fg.black}█${m.reset}${m.dim}${c.bg.blue}${c.fg.blue}█████████████████${m.reset}
               ${m.bold}${c.bg.green}${c.fg.green}██${m.reset}${m.bold}${c.bg.blue}${c.fg.blue}████████${m.reset}${m.bold}${c.bg.green}${c.fg.green}████████${m.reset}${m.bold}${c.bg.blue}${c.fg.blue}████${m.reset}${m.dim}${c.fg.black}██${m.reset}${m.bold}${c.bg.red}${c.fg.white}░░${m.reset}${m.dim}${c.bg.magenta}${c.fg.magenta}███${m.reset}${m.bold}${c.bg.black}${c.fg.magenta}▒${m.reset}${m.dim}${c.bg.magenta}${c.fg.magenta}██${m.reset}${m.dim}${c.fg.black}█${m.reset}${m.bold}${c.fg.black}█${m.reset}${m.bold}${c.bg.red}${c.fg.black}▓▓${m.reset}${m.bold}${c.fg.black}████████${m.reset}${m.bold}${c.bg.red}${c.fg.black}▓▓${m.reset}${m.dim}${c.fg.black}█${m.reset}${m.dim}${c.bg.blue}${c.fg.blue}█████████████████${m.reset}
               ${m.bold}${c.bg.blue}${c.fg.blue}███████████████████████${m.reset}${m.dim}${c.fg.black}█${m.reset}${m.bold}${c.bg.red}${c.fg.white}░░░${m.reset}${m.dim}${c.bg.magenta}${c.fg.magenta}██████${m.reset}${m.dim}${c.fg.black}█${m.reset}${m.bold}${c.fg.black}███${m.reset}${m.dim}${c.fg.black}█${m.reset}${m.bold}${c.bg.black}${c.fg.black}▀▀${m.reset}${m.dim}${c.fg.black}█${m.reset}${m.bold}${c.bg.black}${c.fg.black}▀${m.reset}${m.dim}${c.fg.black}█${m.reset}${m.bold}${c.fg.black}██${m.reset}${m.dim}${c.fg.black}█${m.reset}${m.dim}${c.bg.blue}${c.fg.blue}██████████████████${m.reset}
               ${m.bold}${c.bg.blue}${c.fg.blue}██${m.reset}${m.dim}${c.bg.blue}${c.fg.magenta}▓▓▓▓▓▓▓▓${m.reset}${m.bold}${c.bg.white}${c.fg.white}█${m.reset}${m.bold}${c.bg.blue}${c.fg.blue}███████${m.reset}${m.dim}${c.bg.blue}${c.fg.magenta}▓▓▓▓${m.reset}${m.dim}${c.fg.black}███${m.reset}${m.bold}${c.bg.red}${c.fg.white}░░░░░░░░░${m.reset}${m.dim}${c.fg.black}█${m.reset}${m.bold}${c.fg.black}█████████${m.reset}${m.dim}${c.fg.black}█${m.reset}${m.dim}${c.bg.blue}${c.fg.blue}███████████████████${m.reset}
               ${m.dim}${c.bg.blue}${c.fg.magenta}▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓${m.reset}${m.dim}${c.fg.black}█${m.reset}${m.bold}${c.fg.black}███${m.reset}${m.dim}${c.fg.black}███████████████████${m.reset}${m.dim}${c.bg.blue}${c.fg.blue}████████████████████${m.reset}
               ${m.dim}${c.bg.blue}${c.fg.magenta}▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓${m.reset}${m.bold}${c.bg.white}${c.fg.white}█${m.reset}${m.dim}${c.bg.blue}${c.fg.magenta}▓▓▓${m.reset}${m.dim}${c.fg.black}█${m.reset}${m.bold}${c.fg.black}██${m.reset}${m.dim}${c.fg.black}██${m.reset}${m.dim}${c.bg.blue}${c.fg.blue}█${m.reset}${m.dim}${c.fg.black}█${m.reset}${m.bold}${c.fg.black}█${m.reset}${m.dim}${c.fg.black}█${m.reset}${m.dim}${c.bg.blue}${c.fg.blue}█████${m.reset}${m.dim}${c.fg.black}█${m.reset}${m.bold}${c.fg.black}█${m.reset}${m.dim}${c.fg.black}█${m.reset}${m.dim}${c.bg.blue}${c.fg.blue}█${m.reset}${m.dim}${c.fg.black}█${m.reset}${m.bold}${c.fg.black}██${m.reset}${m.dim}${c.fg.black}█${m.reset}${m.dim}${c.bg.blue}${c.fg.blue}█████████████████████${m.reset}
               ${m.dim}${c.bg.blue}${c.fg.magenta}▓▓${m.reset}${m.dim}${c.bg.blue}${c.fg.blue}█████${m.reset}${m.bold}${c.bg.white}${c.fg.white}█${m.reset}${m.bold}${c.bg.blue}${c.fg.white}░${m.reset}${m.dim}${c.bg.blue}${c.fg.blue}█${m.reset}${m.dim}${c.bg.blue}${c.fg.magenta}▓▓▓▓${m.reset}${m.bold}${c.bg.white}${c.fg.white}█${m.reset}${m.dim}${c.bg.blue}${c.fg.magenta}▓▓▓${m.reset}${m.dim}${c.bg.blue}${c.fg.blue}███${m.reset}${m.dim}${c.fg.black}████${m.reset}${m.dim}${c.bg.blue}${c.fg.blue}██${m.reset}${m.dim}${c.fg.black}██${m.reset}${m.dim}${c.bg.blue}${c.fg.blue}███████${m.reset}${m.dim}${c.fg.black}██${m.reset}${m.dim}${c.bg.blue}${c.fg.blue}██${m.reset}${m.dim}${c.fg.black}██${m.reset}${m.dim}${c.bg.blue}${c.fg.blue}██████████████████████${m.reset}
               ${m.dim}${c.bg.blue}${c.fg.blue}████████████████████████████████████████████████████████████████${m.reset}
               ${m.dim}${c.bg.blue}${c.fg.blue}██████████${m.reset}${m.bold}${c.bg.white}${c.fg.white}█${m.reset}${m.bold}${c.bg.blue}${c.fg.white}░${m.reset}${m.dim}${c.bg.blue}${c.fg.blue}████████████████████████████████████████████████████${m.reset}
               ${m.dim}${c.bg.blue}${c.fg.blue}████████████████████████████████████████████████████████████████${m.reset}
               ${m.dim}${c.bg.blue}${c.fg.blue}████████████████████████████████████████${m.reset}${m.bold}${c.bg.blue}${c.fg.white}░${m.reset}${m.dim}${c.bg.blue}${c.fg.blue}███████████████████████${m.reset}
               ${m.dim}${c.bg.blue}${c.fg.blue}███████████████████████████████████████${m.reset}${m.bold}${c.bg.blue}${c.fg.white}░${m.reset}${m.bold}${c.bg.white}${c.fg.white}█${m.reset}${m.bold}${c.bg.blue}${c.fg.white}░${m.reset}${m.dim}${c.bg.blue}${c.fg.blue}██████████████████████${m.reset}
               ${m.dim}${c.bg.blue}${c.fg.blue}████████████████████████████████████████${m.reset}${m.bold}${c.bg.blue}${c.fg.white}░${m.reset}${m.dim}${c.bg.blue}${c.fg.blue}███████████████████████${m.reset}
               ${m.dim}${c.bg.blue}${c.fg.blue}████████████████████████████████████████████████████████████████${m.reset}
               ${m.dim}${c.bg.blue}${c.fg.blue}████████████████████████████████████████████████████████████████${m.reset}
               ${m.dim}${c.bg.blue}${c.fg.blue}████████████████████████████████████████████████████████████████${m.reset}
               ${m.dim}${c.bg.blue}${c.fg.blue}████████████████████████████████████████████████████████████████${m.reset}
               ${m.dim}${c.bg.blue}${c.fg.blue}████████████████████████████████████████████████████████████████${m.reset}`;

    t.is(output, expected);
});
