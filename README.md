# Igniculus
SQL Syntax Highlighter and Logger. Unadorned and customizable.

## Install

```console
$ npm install igniculus
```

## Usage

```js
const igniculus = require('igniculus')();

igniculus('SELECT [port] AS Printer, \'on fire\' AS Status FROM [Printers] P WHERE P."online" AND P."check"');
```

## Options

A default color scheme is provided. However, you can define the highlight style for each rule, passing them along when instantiating the logger function:

```js
const igniculus = require('igniculus');
const options = {
    constants:         { fg: 'red'},
    standardKeywords:  { fg: 'cyan' },
    lesserKeywords:    { mode: 'bold', fg: 'black' },
    dataTypes:         { fg: 'cyan' }
};

const illumine = igniculus(options);
illumine('SELECT * FROM Student s WHERE s.programme = \'IT\' AND EXISTS (SELECT * FROM Enrolled e JOIN Class c ON c.code = e.code JOIN Tutor t ON t.tid = c.tid WHERE e.sid = s.sid AND t.name LIKE \'%Hoffman\');');
```

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

If defined, the _options_ argument takes precedence over _default_ options. If a rule or it´s style is missing it won't be applied. This allows to _"enable"_ or _"disable"_ certain syntax highlighting as you see fit. _(Examples below)_

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

## Maintainers

- [Lucas Astrada](https://github.com/undre4m)

## License

MIT