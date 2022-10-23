/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  ...require('@bffr/preset/jest-preset'),
  testEnvironment: 'jsdom',
};
