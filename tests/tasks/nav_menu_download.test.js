const NavMenuTask = require('../../bin/tasks/nav_menu_download').NavMenuTask;
const testBase = require('./test_base');

const taskName = NavMenuTask.getTaskName();

it('Should not throw an error if the required args are present.', () => {
  const config = {
    hapikey: 12345,
    pathToContextDir: 'context',
    [taskName]: {
      limit: null
    }
  };
  testBase.setupMocks(config);
  new NavMenuTask();
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
  expect(() => new NavMenuTask()).toThrow();
});