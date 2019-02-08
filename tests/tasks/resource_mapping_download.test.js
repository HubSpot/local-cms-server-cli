const ResourceMappingTask = require('../../bin/tasks/resource_mapping_download').ResourceMappingTask;
const testBase = require('./test_base');

const taskName = ResourceMappingTask.getTaskName();

it('Should not throw an error if the required args are present.', () => {
  const config = {
    hapikey: 12345,
    pathToContextDir: 'context',
    [taskName]: {
      limit: null
    }
  };
  testBase.setupMocks(config);
  new ResourceMappingTask();
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
  expect(() => new ResourceMappingTask()).toThrow();
});