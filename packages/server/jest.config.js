module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: [
    '<rootDir>/src/**/**/*.ts',
    '!<rootDir>/src/main/**/*.ts',
    '!<rootDir>/node_modules'
  ],
  coverageDirectory: 'coverage',
  clearMocks: true,
  testEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest'
  }
}
