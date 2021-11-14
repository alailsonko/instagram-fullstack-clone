const config = require('./jest.config.js')

config.testMatch = ['**/*.spec.ts']
config.automock = true

module.exports = config
