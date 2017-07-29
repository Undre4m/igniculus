# Igniculus
SQL Syntax Highlighter and Logger. Unadorned and customizable.

[![version](https://img.shields.io/npm/v/igniculus.svg?style=flat-square)](https://www.npmjs.com/package/igniculus)
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

igniculus('SELECT [port] AS Printer, \'on fire\' AS Status FROM [Printers] P WHERE P."online" AND P."check"');
```

![Simple Query Default](https://raw.githubusercontent.com/Undre4m/igniculus/master/media/simple-query.png)

## Options

A default color scheme is provided. However, you can define the highlight style for each rule, passing them along when instantiating the logger function:

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

illumine('SELECT * FROM Student s WHERE s.programme = \'IT\' AND EXISTS (SELECT * FROM Enrolled e JOIN Class c ON c.code = e.code JOIN Tutor t ON t.tid = c.tid WHERE e.sid = s.sid AND t.name LIKE \'%Hoffman\')');
```

![Simple Query Custom](https://raw.githubusercontent.com/Undre4m/igniculus/master/media/subquery.png)

The _options_ argument is optional and each property should be one of the following.

### Rules

- options.**constants** - Values surrounded by single quotes. _E.g:_ `'static'` 
- options.**numbers** - Numeric values. _E.g:_ `2.5`
- options.**operators** - Arithmetic, Bitwise and Comparison operators. _E.g:_ `+` or `>=` 
- options.**delimitedIdentifiers** - Text between brackets or double quotes. _E.g:_ `[Employee]` or `"salary"` 
- options.**dataTypes** - One of the included data types. For now it contains those defined in T-SQL. _E.g:_ `INTEGER` or `VARCHAR`
- options.**standardKeywords** - One the included keywords. Contains the most widely used T-SQL and SQL-92 Standard keywords. _E.g:_ `SELECT` or `CONSTRAINT`
- options.**lesserKeywords** - One of the included subset of keywords. _E.g:_ `ANY`, `AVG` or `DESC` 
- options.**prefix**
  - prefix.**text** - A prefix can be appended to every log through this option. This prefix can be styled like any previous options.
  - prefix.**replace** - Also, a _string_ or _regular expression_ can be provided and it will replace (if a prefix.**text** was given) or remove a prefix that matches such parameter. _E.g:_ [Sequelize](https://www.npmjs.com/package/sequelize) prefixes every _SQL statement_ with `Executing (default):` This is removed by **default** by the option `prefix: { replace: /.*?: / }`
- options.**postfix**
  - postfix.**text** - A postfix can be appended to every log through this option. This postfix can be styled like any previous options.

If defined, the _options_ argument takes precedence over _default_ options. If a rule or it´s style is missing it won't be applied. This allows to _"enable"_ or _"disable"_ certain syntax highlighting as you see fit. _[(Examples below)](https://www.npmjs.com/package/igniculus#examples)_

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

### Modifiers

- `reset`
- `bold`
- `dim`
- `italic`
- `underline`
- `blink`
- `inverse`
- `hidden`
- `strikethrough`

### Colors (Foreground and Background)

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
    dataTypes:              { mode: 'dim', fg: 'green' },
    standardKeywords:       { mode: 'dim', fg: 'cyan' },
    lesserKeywords:         { mode: 'bold', fg: 'black' },
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

igniculus("INSERT INTO [Printers] ([port], [name], [ready], [online], [check]) VALUES ('lp0', 'Bob Marley', 0, 1, 1)");
```

![Custom Insert](https://raw.githubusercontent.com/Undre4m/igniculus/master/media/simple-insert-custom.png)

### Integration

Igniculus' logger is a _drop in_ replacement on any tool that passes the logging function either a `string` or `Object` paramater. In the latest case the `toString()` method will be called to obtain a `string` primitive.

#### Sequelize

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
        postfix:               { text:'\r\n' }
    }
);
const sequelize = new Sequelize('database', 'username', 'password',
{
    logging: igniculus
});

...

sequelize.sync({ logging: igniculus});
```

#### Before
![Before](https://raw.githubusercontent.com/Undre4m/igniculus/master/media/sequelize-without.png)

#### After
![After](https://raw.githubusercontent.com/Undre4m/igniculus/master/media/sequelize-with.png)

## Future Upgrades

- Custom keywords
- Custom rules
- Selecting log stream _E.g:_ `process.stdout`

## Maintainers

- [Lucas Astrada](https://github.com/undre4m)

## License

MIT