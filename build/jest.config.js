"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _config = {
    preset: 'ts-jest',
    verbose: true,
    coverageDirectory: 'coverage',
    collectCoverage: true,
    testPathIgnorePatterns: ['/node_modules/'],
    transform: {
        '^.+\\.ts?$': 'ts-jest'
    },
    testMatch: ['<rootDir>/src/**/test/*.ts'],
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
        '@auth/(.*)': ['<rootDir>/src/features/auth/$1'],
        '@user/(.*)': ['<rootDir>/src/features/user/$1'],
        '@post/(.*)': ['<rootDir>/src/features/post/$1'],
        '@global/(.*)': ['<rootDir>/src/shared/globals/$1'],
        '@service/(.*)': ['<rootDir>/src/shared/services/$1'],
        '@socket/(.*)': ['<rootDir>/src/shared/sockets/$1'],
        '@worker/(.*)': ['<rootDir>/src/shared/workers/$1'],
        // '@mock/(.*)' : ['<rootDir>/src/mocks/$1 '],
        '@root/(.*)': ['<rootDir>/src/$1'],
    }
};
exports.default = _config;
//# sourceMappingURL=jest.config.js.map