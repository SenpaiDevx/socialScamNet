import type { Config } from '@jest/types'

const _config: Config.InitialOptions = { //
  preset: 'ts-jest',
  verbose: true, // if true, indicate whether we want each individual test to be reported during test, otherwise false, it will only report if the complete trest file os successfull
  coverageDirectory: 'coverage',
  collectCoverage: true, // cllect test coverage
  testPathIgnorePatterns: ['/node_modules/'],
  transform: {
    '^.+\\.ts?$': 'ts-jest'
  },
  testMatch: ['<rootDir>/src/**/test/*.ts'], // file search in this directory
  collectCoverageFrom: ['src/**/*.ts', '!src/**/test/*.ts?(x)', '!**/node_modules/**'],
  coverageThreshold: {
    global: {
      branches: 1,
      functions: 1,
      lines: 1,
      statements: 1
    }
  },
  coverageReporters: ['text-summary', 'lcov'],
  moduleNameMapper: {
    '@auth/(.*)': ['<rootDir>/src/features/auth/$1'], // this allow to know where the file that base on the paths we defined
    '@user/(.*)': ['<rootDir>/src/features/user/$1'],
    '@post/(.*)': ['<rootDir>/src/features/post/$1'],
    '@global/(.*)': ['<rootDir>/src/shared/globals/$1'],
    '@service/(.*)': ['<rootDir>/src/shared/services/$1'],
    '@socket/(.*)': ['<rootDir>/src/shared/sockets/$1'],
    '@worker/(.*)': ['<rootDir>/src/shared/workers/$1'], //the
    // '@mock/(.*)' : ['<rootDir>/src/mocks/$1 '],
    '@root/(.*)': ['<rootDir>/src/$1'],
  }
};

export default _config
