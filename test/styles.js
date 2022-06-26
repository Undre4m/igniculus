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

const statement_a = dedent`SELECT LOWER([port]) AS Printer, 'on fire' AS Status, CONVERT(DATETIME2(0), CURRENT_TIMESTAMP) AS At
                           FROM [Printers] P
                           WHERE P."online" = 1 AND P."check" = 1;`;

const statement_b = dedent`Executing (default): IF OBJECT_ID('[Users]', 'U') IS NULL CREATE TABLE [Users] (
                               [userId] INTEGER NOT NULL,
                               [password] BINARY(60) NOT NULL,
                               [createdAt] DATETIMEOFFSET NOT NULL,
                               [deletedAt] DATETIMEOFFSET NULL,
                               [profileId] INTEGER NOT NULL,
                               PRIMARY KEY ([userId]),
                               FOREIGN KEY ([userId]) REFERENCES [Employees] ([employeeId]) ON DELETE CASCADE,
                               FOREIGN KEY ([profileId]) REFERENCES [Profiles] ([profileId]) ON DELETE NO ACTION
                           );`;

const statement_c = dedent`create procedure stop_if_combusting
                           (
                               @port char(3)
                           )
                           as
                               update [Printers]
                               set [online] = 0, [ready] = 0
                               where [online] = 1 and [check] = 1 and [port] = @port`;

test('no style', t => {
  const options = {};

  const print = igniculus(Object.assign(options, echo));

  const output = print(statement_a);
  const expected = statement_a;

  t.is(output, expected);
});

test('single modifiers', t => {
  const options = {
    rules: {
      constants: {
        style: { mode: null },
      },
      numbers: {
        style: { mode: 'bold' },
      },
      operators: {
        style: { mode: 'dim' },
      },
      delimitedIdentifiers: {
        style: { mode: 'italic' },
      },
      dataTypes: {
        style: { mode: 'underline' },
      },
      standardKeywords: {
        style: { mode: 'blink' },
      },
      lesserKeywords: {
        style: { mode: 'inverse' },
      },
      prefix: {
        style: { mode: 'hidden' },
        text: '[START]\n',
      },
      postfix: {
        style: { mode: 'strikethrough' },
        text: '\n[END]',
      },
    },
  };

  const print = igniculus(Object.assign(options, echo));

  const output = print(statement_a);
  const expected =
        dedent`${m.hidden}[START]
               ${m.reset}${m.blink}SELECT${m.reset} LOWER(${m.italic}[port]${m.reset}) ${m.inverse}AS${m.reset} Printer, 'on fire' ${m.inverse}AS${m.reset} Status, CONVERT(${m.underline}DATETIME2${m.reset}(${m.bold}0${m.reset}), CURRENT_TIMESTAMP) ${m.inverse}AS${m.reset} At
               ${m.blink}FROM${m.reset} ${m.italic}[Printers]${m.reset} P
               ${m.blink}WHERE${m.reset} P.${m.italic}"online"${m.reset} ${m.dim}=${m.reset} ${m.bold}1${m.reset} ${m.inverse}AND${m.reset} P.${m.italic}"check"${m.reset} ${m.dim}=${m.reset} ${m.bold}1${m.reset};${m.strikethrough}
               [END]${m.reset}`;

  t.is(output, expected);
});

test('multiple modifiers', t => {
  const options = {
    rules: {
      constants: {
        style: { mode: ['dim', 'italic', 'underline'] },
      },
      standardKeywords: {
        style: { mode: ['bold'] },
      },
      lesserKeywords: {
        style: { mode: [] },
      },
      prefix: {
        style: { mode: ['blink', 'inverse', 'strikethrough'] },
        text: '[START]\n',
      },
      postfix: {
        style: { mode: ['strikethrough', 'blink', 'inverse'] },
        text: '\n[END]',
      },
    },
  };

  const print = igniculus(Object.assign(options, echo));

  const output = print(statement_a);
  const expected =
        dedent`${m.blink + m.inverse + m.strikethrough}[START]
               ${m.reset}${m.bold}SELECT${m.reset} LOWER([port]) AS Printer, ${m.dim + m.italic + m.underline}'on fire'${m.reset} AS Status, CONVERT(DATETIME2(0), CURRENT_TIMESTAMP) AS At
               ${m.bold}FROM${m.reset} [Printers] P
               ${m.bold}WHERE${m.reset} P."online" = 1 AND P."check" = 1;${m.blink + m.inverse + m.strikethrough}
               [END]${m.reset}`;

  t.is(output, expected);
});

test('foreground colors', t => {
  const options = {
    rules: {
      constants: {
        style: { fg: null },
      },
      numbers: {
        style: { fg: 'black' },
      },
      operators: {
        style: { fg: 'red' },
      },
      delimitedIdentifiers: {
        style: { fg: 'green' },
      },
      dataTypes: {
        style: { fg: 'yellow' },
      },
      standardKeywords: {
        style: { fg: 'blue' },
      },
      lesserKeywords: {
        style: { fg: 'magenta' },
      },
      prefix: {
        style: { fg: 'cyan' },
        text: '[START]\n',
      },
      postfix: {
        style: { fg: 'white' },
        text: '\n[END]',
      },
    },
  };

  const print = igniculus(Object.assign(options, echo));

  const output = print(statement_a);
  const expected =
        dedent`${c.fg.cyan}[START]
               ${m.reset}${c.fg.blue}SELECT${m.reset} LOWER(${c.fg.green}[port]${m.reset}) ${c.fg.magenta}AS${m.reset} Printer, 'on fire' ${c.fg.magenta}AS${m.reset} Status, CONVERT(${c.fg.yellow}DATETIME2${m.reset}(${c.fg.black}0${m.reset}), CURRENT_TIMESTAMP) ${c.fg.magenta}AS${m.reset} At
               ${c.fg.blue}FROM${m.reset} ${c.fg.green}[Printers]${m.reset} P
               ${c.fg.blue}WHERE${m.reset} P.${c.fg.green}"online"${m.reset} ${c.fg.red}=${m.reset} ${c.fg.black}1${m.reset} ${c.fg.magenta}AND${m.reset} P.${c.fg.green}"check"${m.reset} ${c.fg.red}=${m.reset} ${c.fg.black}1${m.reset};${c.fg.white}
               [END]${m.reset}`;

  t.is(output, expected);
});

test('background colors', t => {
  const options = {
    rules: {
      constants: {
        style: { bg: null },
      },
      numbers: {
        style: { bg: 'black' },
      },
      operators: {
        style: { bg: 'red' },
      },
      delimitedIdentifiers: {
        style: { bg: 'green' },
      },
      dataTypes: {
        style: { bg: 'yellow' },
      },
      standardKeywords: {
        style: { bg: 'blue' },
      },
      lesserKeywords: {
        style: { bg: 'magenta' },
      },
      prefix: {
        style: { bg: 'cyan' },
        text: '[START]\n',
      },
      postfix: {
        style: { bg: 'white' },
        text: '\n[END]',
      },
    },
  };

  const print = igniculus(Object.assign(options, echo));

  const output = print(statement_a);
  const expected =
        dedent`${c.bg.cyan}[START]
               ${m.reset}${c.bg.blue}SELECT${m.reset} LOWER(${c.bg.green}[port]${m.reset}) ${c.bg.magenta}AS${m.reset} Printer, 'on fire' ${c.bg.magenta}AS${m.reset} Status, CONVERT(${c.bg.yellow}DATETIME2${m.reset}(${c.bg.black}0${m.reset}), CURRENT_TIMESTAMP) ${c.bg.magenta}AS${m.reset} At
               ${c.bg.blue}FROM${m.reset} ${c.bg.green}[Printers]${m.reset} P
               ${c.bg.blue}WHERE${m.reset} P.${c.bg.green}"online"${m.reset} ${c.bg.red}=${m.reset} ${c.bg.black}1${m.reset} ${c.bg.magenta}AND${m.reset} P.${c.bg.green}"check"${m.reset} ${c.bg.red}=${m.reset} ${c.bg.black}1${m.reset};${c.bg.white}
               [END]${m.reset}`;

  t.is(output, expected);
});

test('default style', t => {
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

  const print = igniculus(Object.assign(options, echo));

  const output = print(statement_b);
  const expected =
        dedent`${m.dim}${c.fg.cyan}IF${m.reset} OBJECT_ID(${m.dim}${c.fg.red}'[Users]'${m.reset}, ${m.dim}${c.fg.red}'U'${m.reset}) ${m.bold}${c.fg.black}IS${m.reset} ${m.bold}${c.fg.black}NULL${m.reset} ${m.dim}${c.fg.cyan}CREATE${m.reset} ${m.dim}${c.fg.cyan}TABLE${m.reset} ${m.dim}${c.fg.yellow}[Users]${m.reset} (
                   ${m.dim}${c.fg.yellow}[userId]${m.reset} ${m.dim}${c.fg.green}INTEGER${m.reset} ${m.bold}${c.fg.black}NOT${m.reset} ${m.bold}${c.fg.black}NULL${m.reset},
                   ${m.dim}${c.fg.yellow}[password]${m.reset} ${m.dim}${c.fg.green}BINARY${m.reset}(60) ${m.bold}${c.fg.black}NOT${m.reset} ${m.bold}${c.fg.black}NULL${m.reset},
                   ${m.dim}${c.fg.yellow}[createdAt]${m.reset} ${m.dim}${c.fg.green}DATETIMEOFFSET${m.reset} ${m.bold}${c.fg.black}NOT${m.reset} ${m.bold}${c.fg.black}NULL${m.reset},
                   ${m.dim}${c.fg.yellow}[deletedAt]${m.reset} ${m.dim}${c.fg.green}DATETIMEOFFSET${m.reset} ${m.bold}${c.fg.black}NULL${m.reset},
                   ${m.dim}${c.fg.yellow}[profileId]${m.reset} ${m.dim}${c.fg.green}INTEGER${m.reset} ${m.bold}${c.fg.black}NOT${m.reset} ${m.bold}${c.fg.black}NULL${m.reset},
                   ${m.dim}${c.fg.cyan}PRIMARY${m.reset} ${m.dim}${c.fg.cyan}KEY${m.reset} (${m.dim}${c.fg.yellow}[userId]${m.reset}),
                   ${m.dim}${c.fg.cyan}FOREIGN${m.reset} ${m.dim}${c.fg.cyan}KEY${m.reset} (${m.dim}${c.fg.yellow}[userId]${m.reset}) ${m.dim}${c.fg.cyan}REFERENCES${m.reset} ${m.dim}${c.fg.yellow}[Employees]${m.reset} (${m.dim}${c.fg.yellow}[employeeId]${m.reset}) ${m.dim}${c.fg.cyan}ON${m.reset} ${m.dim}${c.fg.cyan}DELETE${m.reset} ${m.dim}${c.fg.cyan}CASCADE${m.reset},
                   ${m.dim}${c.fg.cyan}FOREIGN${m.reset} ${m.dim}${c.fg.cyan}KEY${m.reset} (${m.dim}${c.fg.yellow}[profileId]${m.reset}) ${m.dim}${c.fg.cyan}REFERENCES${m.reset} ${m.dim}${c.fg.yellow}[Profiles]${m.reset} (${m.dim}${c.fg.yellow}[profileId]${m.reset}) ${m.dim}${c.fg.cyan}ON${m.reset} ${m.dim}${c.fg.cyan}DELETE${m.reset} ${m.dim}${c.fg.cyan}NO${m.reset} ${m.dim}${c.fg.cyan}ACTION${m.reset}
               );`;

  t.is(output, expected);
});

test('default style 2', t => {
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

  const print = igniculus(Object.assign(options, echo));

  const output = print(statement_c);
  const expected =
        dedent`${m.dim}${c.fg.cyan}CREATE${m.reset} ${m.dim}${c.fg.cyan}PROCEDURE${m.reset} stop_if_combusting
               (
                   ${m.dim}${c.fg.magenta}@port${m.reset} ${m.dim}${c.fg.green}CHAR${m.reset}(3)
               )
               ${m.bold}${c.fg.black}AS${m.reset}
                   ${m.dim}${c.fg.cyan}UPDATE${m.reset} ${m.dim}${c.fg.yellow}[Printers]${m.reset}
                   ${m.dim}${c.fg.cyan}SET${m.reset} ${m.dim}${c.fg.yellow}[online]${m.reset} = 0, ${m.dim}${c.fg.yellow}[ready]${m.reset} = 0
                   ${m.dim}${c.fg.cyan}WHERE${m.reset} ${m.dim}${c.fg.yellow}[online]${m.reset} = 1 ${m.bold}${c.fg.black}AND${m.reset} ${m.dim}${c.fg.yellow}[check]${m.reset} = 1 ${m.bold}${c.fg.black}AND${m.reset} ${m.dim}${c.fg.yellow}[port]${m.reset} = ${m.dim}${c.fg.magenta}@port${m.reset}`;

  t.is(output, expected);
});
