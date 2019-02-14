const HubDbTask = require('../../bin/tasks/hubdb_download').HubDbTask;
const testBase = require('./test_base');

const taskName = HubDbTask.getTaskName();

it('Should not throw an error if the required args are present.', () => {
  const config = {
    hapikey: 12345,
    pathToContextDir: 'context',
    [taskName]: {
      batchSize: 1
    }
  };
  testBase.setupMocks(config);
  new HubDbTask();
});

it('Should throw an error if the required args are absent.', () => {
  const config = {
    hapikey: null,
    pathToContextDir: null,
    [taskName]: {
      batchSize: 1
    }
  };
  testBase.setupMocks(config);
  expect(() => new HubDbTask()).toThrow();
});