const fs = require('fs');
const yaml = require('js-yaml');

function setupMocks(config) {
  fs.readFileSync = jest.fn().mockReturnValue();
  yaml.safeLoad = jest.fn().mockReturnValue(config);
}

module.exports = {
  setupMocks
}