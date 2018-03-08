# Igniculus
SQL Syntax Highlighter and Logger. Unadorned and customizable.

[![version](https://img.shields.io/npm/v/igniculus.svg?style=flat-square)](https://www.npmjs.com/package/igniculus)
[![build status](https://img.shields.io/travis/Undre4m/igniculus.svg?style=flat-square)](https://travis-ci.org/Undre4m/igniculus)
[![node](https://img.shields.io/node/v/igniculus.svg?style=flat-square)](https://nodejs.org/en/download/releases)
[![downloads](https://img.shields.io/npm/dt/igniculus.svg?style=flat-square)](https://www.npmjs.com/package/igniculus)
[![license](https://img.shields.io/npm/l/igniculus.svg?style=flat-square)](https://github.com/Undre4m/igniculus/blob/master/LICENSE)

## Install

```console
$ npm install igniculus
```

## Usage

```js
const igniculus = require('igniculus')();

igniculus('SELECT [port] AS Printer, \'on fire\' AS Status ' +
          'FROM [Printers] P ' +
          'WHERE P."online" = 1 AND P."check" = 1');
```

![Simple Query Default](https://raw.githubusercontent.com/Undre4m/igniculus/master/media/simple-query.png)

## Table of Contents
- [Logger](#logger)
- [Options](#options)
    - [Rules](#rules)
    - [Styles](#styles)
- [Examples](#examples)
- [Integration](#integration)
    - [Sequelize](#sequelize)

## Logger

A reference to the log function is returned on initialization but can be accessed anywhere through `.log`

```js
// config.js
const igniculus = require('igniculus');
const options = { ... };

igniculus(options);
```

```js
// any.js
const igniculus = require('igniculus');

let query = 'SELECT ...';
igniculus.log(query);
```

## Options

A default color scheme is provided. However, you can define the highlight style for each rule when instantiating:

```js
const igniculus = require('igniculus');
/* White constants over red background using inverse mode.
 * Gray keywords.
 * Prefixed by white '(query)' message.
 */
const options = {
    constants:         { mode: 'inverse', fg: 'red', bg: 'white' },
    standardKeywords:  { mode: 'bold', fg: 'black' },
    lesserKeywords:    { mode: 'bold', fg: 'black' },
    prefix:            { mode: 'bold', fg: 'white', text: '(query) '}
};
const illumine = igniculus(options);

illumine('SELECT * FROM Student s ' +
         'WHERE s.programme = \'IT\' AND EXISTS (' +
             'SELECT * FROM Enrolled e ' +
             'JOIN Class c ON c.code = e.code ' +
             'JOIN Tutor t ON t.tid = c.tid ' +
             'WHERE e.sid = s.sid AND t.name LIKE \'%Hoffman\')');
```

![Subquery](https://raw.githubusercontent.com/Undre4m/igniculus/master/media/subquery.png)

The _options_ argument is optional and each property should be one of the following.

### Rules

- options.**constants** - Values surrounded by single quotes. _E.g:_ `'static'`
- options.**numbers** - Numeric values. _E.g:_ `2.5`
- options.**operators** - Arithmetic, Bitwise and Comparison operators. _E.g:_ `+` or `>=`
- options.**variables** - Local variables and parameters. _E.g:_ `@name` or `@@IDENTITY`
- options.**delimitedIdentifiers** - Text between brackets or double quotes. _E.g:_ `[Employee]` or `"salary"`
- options.**dataTypes** - One of the included data types. _E.g:_ `INTEGER` or `VARCHAR`
  - dataTypes.**types** - Array of custom data types. Replaces the ones by default. _E.g:_ `['SERIAL', 'TIMESTAMP']`
  - dataTypes.**casing** - Either `'lowercase'` or `'uppercase'`. If not defined data types won't be capitalized.
- options.**standardKeywords** - One the included keywords. _E.g:_ `SELECT` or `CONSTRAINT`
  - standardKeywords.**keywords** - Array of custom standard keywords. Replaces the ones by default. _E.g:_ `['CLUSTER', 'NATURAL']`
  - standardKeywords.**casing** - Either `'lowercase'` or `'uppercase'`. If not defined standard keywords won't be capitalized.
- options.**lesserKeywords** - One of the included lesser keywords. _E.g:_ `ANY`, `AVG` or `DESC`
  - lesserKeywords.**keywords** - Array of custom lesser keywords. Replaces the ones by default. _E.g:_ `['VOLATILE', 'ASYMMETRIC']`
  - lesserKeywords.**casing** - Either `'lowercase'` or `'uppercase'`. If not defined lesser keywords won't be capitalized.
- options.**prefix**
  - prefix.**text** - A prefix can be appended to every log through this option. This prefix can be styled like any previous options.
  - prefix.**replace** - Also, a _string_ or _regular expression_ can be provided and it will replace (if a prefix.**text** was given) or remove a prefix that matches such parameter. _E.g:_ [Sequelize](https://www.npmjs.com/package/sequelize) prefixes every _SQL statement_ with `Executing (default|transaction_id):` This is removed by **default** by the option `prefix: { replace: /.*?: / }`
- options.**postfix**
  - postfix.**text** - A postfix can be appended to every log through this option. This postfix can be styled like any previous options.
- options.**output** - Output function for the highlighted statements, `console.log` by default. _E.g:_ `process.stdout`, `st => st`

If defined, the _options_ argument takes precedence over _default_ options. If a rule or it´s style is missing it won't be applied. This allows to _"enable"_ or _"disable"_ certain syntax highlighting as you see fit. _[(Examples below)](#examples)_

>#### A word on types and keywords
>Most often, highlighting every reserved keyword can make syntax difficult to read, defeating the purpose altogether. Therefore, three distinct rules are provided: _dataTypes_, _standardKeywords_ and _lesserKeywords_.
Each of these rules can be customized individually and come with a [predefined list](https://github.com/Undre4m/igniculus/blob/master/index.js#L3) of most widely used T-SQL and SQL-92 keywords and data types. Furthermore each of this lists can be customized as described above.
>
>Starting from [v1.1.0](https://github.com/Undre4m/igniculus/blob/master/CHANGELOG.md#110--26-feb-2018) _types_ and _keywords_ are no longer uppercased by default. Custom styles should use the `casing: 'uppercase'` option for this behaviour. Predefined style already provides this option so no changes should be required.

### Styles

All of the previous rule styles can be defined like this:

```js
/* options = {"rule": style, ... } where
 * style = { mode: "modifier", fg: "color", bg: "color"}
 */
const options = {
    constants: {
        mode: 'inverse',
        fg: 'red',
        bg: 'white'
    },
    ...
};
```

Each style having an optional:

- style.**mode** - Modifier. _E.g:_ `'bold'`
- style.**fg** - Foreground text color. _E.g:_ `'red'`
- style.**bg** - Background color. _E.g:_ `'black'`

These can be one of the following.

#### Modifiers

- `reset`
- `bold`
- `dim`
- `italic`
- `underline`
- `blink`
- `inverse`
- `hidden`
- `strikethrough`

#### Colors (Foreground and Background)

- `black`
- `red`
- `green`
- `yellow`
- `blue`
- `magenta`
- `cyan`
- `white`

## Examples

```js
/* Predifined style */
const defaults = {
    constants:              { mode: 'dim', fg: 'red' },
    delimitedIdentifiers:   { mode: 'dim', fg: 'yellow' },
    variables:              { mode: 'dim', fg: 'magenta' },
    dataTypes:              { mode: 'dim', fg: 'green', casing: 'uppercase' },
    standardKeywords:       { mode: 'dim', fg: 'cyan', casing: 'uppercase' },
    lesserKeywords:         { mode: 'bold', fg: 'black', casing: 'uppercase' },
    prefix:                 { replace: /.*?: / }
};
```

![Defaults](https://raw.githubusercontent.com/Undre4m/igniculus/master/media/default.png)

```js
const igniculus = require('igniculus')(
    {
        constants:             { mode: 'bold', fg: 'yellow' },
        numbers:               { mode: 'bold', fg: 'magenta' },
        delimitedIdentifiers:  { mode: 'bold', fg: 'red' },
        standardKeywords:      { mode: 'bold', fg: 'blue' }
    }
);

igniculus("INSERT INTO [Printers] ([port], [name], [ready], [online], [check]) " +
          "VALUES ('lp0', 'Bob Marley', 0, 1, 1)");
```

![Custom Insert](https://raw.githubusercontent.com/Undre4m/igniculus/master/media/simple-insert-custom.png)

```js
const igniculus = require('igniculus');

const options = {
    delimitedIdentifiers: {
        fg: 'yellow'
    },
    dataTypes: {
        fg: 'magenta',
        types: ['VARBINARY']
    },
    standardKeywords: {
        fg: 'red',
        keywords: ['CREATE', 'PRIMARY', 'KEY']
    },
    lesserKeywords: {
        mode: 'bold',
        fg: 'black',
        keywords: ['TABLE', 'NOT', 'NULL']
    },
    prefix: {
        text: '\n'
    }
};
igniculus(options);

igniculus.log('CREATE TABLE User (' +
              '[username] VARCHAR(20) NOT NULL, ' +
              '[password] BINARY(64) NOT NULL, ' +
              '[avatar] VARBINARY(MAX), PRIMARY KEY ([username]))');
```

![Custom Create](https://raw.githubusercontent.com/Undre4m/igniculus/master/media/simple-create-custom.png)

## Integration

Igniculus' logger is a _drop in_ replacement on any tool that passes the log function either a `string` or `Object` paramater. In the latest case the `toString()` method will be called to obtain a `string` primitive.

### Sequelize

Using igniculus with sequelize is straightforward.

```js
const Sequelize = require('sequelize');
const igniculus = require('igniculus')();

const sequelize = new Sequelize('database', 'username', 'password', {
    logging: igniculus
});
```

```js
/* Or add some customizations */
const Sequelize = require('sequelize');
const igniculus = require('igniculus')(
    {
        constants:             { fg: 'red' },
        delimitedIdentifiers:  { fg: 'yellow' },
        dataTypes:             { fg: 'red' },
        standardKeywords:      { fg: 'magenta' },
        lesserKeywords:        { mode: 'bold', fg: 'black' },
        prefix:                {
                                   mode: 'bold',
                                   fg: 'white',
                                   replace: /.*?:/,
                                   text: '(Sequelize)'
                               },
        postfix:               { text: '\r\n' }
    }
);
const sequelize = new Sequelize('database', 'username', 'password', {
    logging: igniculus
});

...

sequelize.sync({ logging: igniculus});
```

#### Before
![Before](https://raw.githubusercontent.com/Undre4m/igniculus/master/media/sequelize-without.png)

#### After
![After](https://raw.githubusercontent.com/Undre4m/igniculus/master/media/sequelize-with.png)

## Notes

### Changes
For a full list of changes please refer to the [changelog](https://github.com/Undre4m/igniculus/blob/master/CHANGELOG.md).

### Future Upgrades
Planned support for custom rules.

## Maintainers

[Lucas Astrada](https://github.com/undre4m)

## License

[MIT](https://github.com/Undre4m/igniculus/blob/master/LICENSE)