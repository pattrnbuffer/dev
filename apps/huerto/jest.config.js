const next = require('next/jest');

module.exports = next({ dir: './' })({
  roots: ['<rootDir>'],
  moduleNameMapper: {
    '^~/(.*)$': `<rootDir>/$1`,
  },
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ]
});
