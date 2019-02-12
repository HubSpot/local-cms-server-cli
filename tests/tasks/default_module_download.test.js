const DefaultModulesTask = require('../../bin/tasks/default_module_download').DefaultModulesTask
const testBase = require('./test_base');

const taskName = DefaultModulesTask.getTaskName();

it('Should not throw an error if the required args are present.', () => {
  const config = {
    hapikey: 12345,
    pathToContextDir: 'context',
    [taskName]: {
      limit: null
    }
  };
  testBase.setupMocks(config);
  new DefaultModulesTask();
});

it('Should throw an error if the required args are absent.', () => {
  const config = {
    hapikey: null,
    pathToContextDir: null,
    [taskName]: {
      limit: null
    }
  };
  testBase.setupMocks(config);
  expect(() => new DefaultModulesTask()).toThrow();
});