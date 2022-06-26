/* eslint-disable max-len */

import { union } from './util';

/**
 * SQL-92 standard data types and keywords
 * @see http://www.frontbase.com/docs/5.3.html
 */
export const sql92 = {
  defaultDataTypes: ['SMALLINT', 'INTEGER', 'INT', 'NUMERIC', 'DECIMAL', 'DEC', 'FLOAT', 'REAL', 'DOUBLE PRECISION', 'CHARACTER', 'CHAR', 'NCHAR', 'VARCHAR', 'BIT', 'DATE', 'TIME', 'TIMESTAMP', 'INTERVAL', 'NATIONAL', 'VARYING', 'TIME ZONE'],
};

/**
 * Oracle data types
 * @see https://docs.oracle.com/en/database/oracle/oracle-database/18/sqlrf/Data-Types.html#GUID-7B72E154-677A-4342-A1EA-C74C1EA928E6
 */
export const oracle = {
  defaultDataTypes: ['VARCHAR2', 'NVARCHAR2', 'NUMBER', 'FLOAT', 'LONG', 'DATE', 'BINARY_FLOAT', 'BINARY_DOUBLE', 'TIMESTAMP', 'INTERVAL', 'RAW', 'ROWID', 'UROWID', 'CHAR', 'NCHAR', 'CLOB', 'NCLOB', 'BLOB', 'BFILE', 'BYTE', 'LOCAL', 'TIME ZONE'],
};

/**
 * T-SQL data types and keywords
 * @see https://docs.microsoft.com/en-us/sql/t-sql/data-types/data-types-transact-sql?view=sql-server-2017
 */
export const tsql = {
  defaultDataTypes: ['BIGINT', 'NUMERIC', 'BIT', 'SMALLINT', 'DECIMAL', 'SMALLMONEY', 'INT', 'TINYINT', 'MONEY', 'FLOAT', 'REAL', 'DATE', 'DATETIMEOFFSET', 'DATETIME2', 'SMALLDATETIME', 'DATETIME', 'TIME', 'CHAR', 'VARCHAR', 'TEXT', 'NCHAR', 'NVARCHAR', 'NTEXT', 'BINARY', 'VARBINARY', 'IMAGE', 'GEOMETRY', 'GEOGRAPHY', 'UNIQUEIDENTIFIER', 'XML'],
};

/**
 * PostgreSQL data types and keywords
 * @see https://www.postgresql.org/docs/10/static/datatype.html
 */
export const postgresql = {
  defaultDataTypes: ['SMALLINT', 'INTEGER', 'BIGINT', 'DECIMAL', 'NUMERIC', 'REAL', 'DOUBLE PRECISION', 'SMALLSERIAL', 'SERIAL', 'BIGSERIAL', 'MONEY', 'CHAR', 'CHARACTER', 'VARCHAR', 'TEXT', 'BYTEA', 'TIMESTAMP', 'TIMESTAMPTZ', 'DATE', 'TIME', 'INTERVAL', 'BOOLEAN', 'ENUM', 'POINT', 'LINE', 'LSEG', 'BOX', 'PATH', 'POLYGON', 'CIRCLE', 'CIDR', 'INET', 'MACADDR', 'MACADDR8', 'BIT', 'UUID', 'XML', 'JSON', 'JSONB', 'TSQUERY', 'TSVECTOR', 'INT4RANGE', 'INT8RANGE', 'NUMRANGE', 'TSRANGE', 'TSTZRANGE', 'DATERANGE', 'ARRAY', 'TIME ZONE'],
};

/**
 * MariaDB data types and keywords
 * @see https://mariadb.com/kb/en/library/data-types
 */
export const mariadb = {
  defaultDataTypes: ['TINYINT', 'BOOLEAN', 'SMALLINT', 'MEDIUMINT', 'INT', 'INTEGER', 'BIGINT', 'DECIMAL', 'DEC', 'NUMERIC', 'FIXED', 'FLOAT', 'DOUBLE', 'DOUBLE PRECISION', 'REAL', 'BIT', 'CHAR', 'VARCHAR', 'BINARY', 'CHAR BYTE', 'VARBINARY', 'TINYBLOB', 'BLOB', 'MEDIUMBLOB', 'LONGBLOB', 'TINYTEXT', 'TEXT', 'MEDIUMTEXT', 'LONGTEXT', 'JSON', 'ENUM', 'SET', 'ROW', 'DATE', 'TIME', 'DATETIME', 'TIMESTAMP', 'YEAR', 'POINT', 'LINESTRING', 'POLYGON', 'MULTIPOINT', 'MULTILINESTRING', 'MULTIPOLYGON', 'GEOMETRYCOLLECTION', 'GEOMETRY'],
};

/**
 * Base data types and keywords
 * @todo implement lang selection for extended types and keywords
 * @todo make SQL-92 or SQL:2016 the default lang
 */
export const base = {
  defaultDataTypes: union(sql92.defaultDataTypes, tsql.defaultDataTypes),
  defaultStandardKeywords: ['ACTION', 'ADD', 'AFTER', 'ALTER', 'AUTHORIZATION', 'BEFORE', 'BEGIN', 'BREAK', 'BY', 'CASCADE', 'CASE', 'CHECK', 'CHECKPOINT', 'CLOSE', 'COLUMN', 'COMMIT', 'CONSTRAINT', 'CONTINUE', 'CREATE', 'CROSS', 'CURSOR', 'DATABASE', 'DECLARE', 'DEFAULT', 'DELETE', 'DISTINCT', 'DROP', 'EACH', 'ELSE', 'ELSEIF', 'END', 'EXCEPT', 'EXEC', 'EXECUTE', 'EXIT', 'FETCH', 'FIRST', 'FOR', 'FOREIGN', 'FROM', 'FULL', 'FUNCTION', 'GO', 'GRANT', 'GROUP', 'HAVING', 'IDENTITY', 'IF', 'INDEX', 'INNER', 'INSERT', 'INTERSECT', 'INTO', 'JOIN', 'KEY', 'LEFT', 'LIMIT', 'LAST', 'LOOP', 'MERGE', 'MODIFY', 'NEXT', 'NO', 'OFFSET', 'ON', 'OPEN', 'ORDER', 'OUTER', 'PRIMARY', 'PROC', 'PROCEDURE', 'REFERENCES', 'RELATIVE', 'REPLACE', 'RETURN', 'RETURNS', 'REVOKE', 'RIGHT', 'ROLLBACK', 'ROW', 'ROWS', 'SAVE', 'SCHEMA', 'SELECT', 'SET', 'TABLE', 'THEN', 'TOP', 'TRAN', 'TRANSACTION', 'TRIGGER', 'TRUNCATE', 'UNION', 'UNIQUE', 'UPDATE', 'USE', 'USING', 'VALUES', 'VIEW', 'WHEN', 'WHERE', 'WHILE', 'WITH', 'WITHOUT'],
  defaultLesserKeywords: ['ALL', 'AND', 'ANY', 'AS', 'ASC', 'AVG', 'BETWEEN', 'COLLATE', 'COUNT', 'DESC', 'ESCAPE', 'EXISTS', 'FALSE', 'IN', 'IS', 'LIKE', 'MAX', 'MIN', 'NOT', 'NULL', 'OR', 'SOME', 'SUM', 'TO', 'TRUE'],
};
