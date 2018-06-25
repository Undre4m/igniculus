## Changelog

### 1.5.0 ~ _24 Jun 2018_
- Extended data types
    - Added all sql-99 standard data types plus some t-sql data types
- Keyword sets pruning
    - Included non standard commonly used keywords [AFTER, AUTHORIZATION, BEFORE, BREAK, CLOSE, COLUMN, CURSOR, EACH, ELSEIF, EXIT, FETCH, FIRST, FOR, GRANT, LIMIT, LAST, LOOP, NEXT, OFFSET, OPEN, RELATIVE, REPLACE, REVOKE, ROLLBACK, ROW, ROWS, SCHEMA, USING, WITHOUT] and lesser keywords [ESCAPE, TO]
    - Excluded seldom used dbms-specific keywords [PREPARE]
- Merged __1.4.0-0__ (Experimental support for custom-built rules)

#### 1.4.0-0 _(rc)_ ~ _15 May 2018_
- Experimental support for custom-built rules

#### 1.3.0 ~ _12 May 2018_
- Basic support for single and multi-line comments
- Extended support for latin script unicode characters

#### 1.2.0 ~ _08 Mar 2018_
- Support for local variables and parameters

#### 1.1.0 ~ _26 Feb 2018_
- Fixed types and keywords matching inside constants
- Support for optional types and keywords casing
- Performance improvements

#### 1.0.1 ~ _03 Jan 2018_
- LICENSE and README updates
- CHANGELOG

#### 1.0.0 ~ _29 Dec 2017_
- Promotion to stable release
- Fixed compound operators mismatch
- Fixed keywords and data types breaking format if inside delimited identifiers
- Custom pluggable output support

#### 0.5.0 ~ _17 Sep 2017_
- Custom keywords and data types support
- Module improvements

#### 0.4.0 ~ _29 Jul 2017_
- Postfix support

#### 0.3.0 ~ _27 Jul 2017_
- Module improvements
- README update and image examples

#### 0.2.0 ~ _25 Jul 2017_
- Minimal fixes
- README

#### 0.1.0 ~ _23 Jul 2017_
- Base syntax highlighter release

#### 0.0.2 ~ _20 Jul 2017_
- Numbers and operators support
- Improved prefix substitution

#### 0.0.1 ~ _19 Jul 2017_
- Initial release