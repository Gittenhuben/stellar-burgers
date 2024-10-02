import type { Config } from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
  collectCoverage: true,
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    './src/services/*/**',
    './src/services/root-reducer.ts'
  ],
  verbose: true,
  testEnvironment: 'jsdom',
  transform: {
    '\\.jsx?$': 'babel-jest',
    '^.+\\.tsx?$': 'ts-jest',
    '.+\\.(css|styl|less|sass|scss)$': 'jest-css-modules-transform'
  },
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'jest-css-modules-transform'
  }
};
export default config;
