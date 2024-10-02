import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  testPathIgnorePatterns: ['/node_modules/'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest', // Use SWC, which increases the speed almost 4x
  },
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/__tests__/',
    '/coverage/',
    '.config.ts',
    '.wac.ts',
  ],
  collectCoverageFrom: ['<rootDir>/**/*.ts'],
  moduleDirectories: ['node_modules', 'src'],
};

export default config;
