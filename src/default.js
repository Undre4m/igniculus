export const defaultConfig = {
  rules: {
    comments: {
      style: { mode: ['dim'], fg: 'white' },
    },
    constants: {
      style: { mode: ['dim'], fg: 'red' },
    },
    delimitedIdentifiers: {
      style: { mode: ['dim'], fg: 'yellow' },
    },
    variables: {
      style: { mode: ['dim'], fg: 'magenta' },
    },
    dataTypes: {
      style: { mode: ['dim'], fg: 'green' },
      casing: 'uppercase',
    },
    standardKeywords: {
      style: { mode: ['dim'], fg: 'cyan' },
      casing: 'uppercase',
    },
    lesserKeywords: {
      style: { mode: ['bold'], fg: 'black' },
      casing: 'uppercase',
    },
    prefix: {
      replace: /^.*?: /,
    },
  },
};
