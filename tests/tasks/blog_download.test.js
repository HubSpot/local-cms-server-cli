const BlogTask = require('../../bin/tasks/blog_download').BlogTask;
const testBase = require('./test_base');

const taskName = BlogTask.getTaskName();

it('Should not throw an error if the required args are present.', () => {
  const config = {
    hapikey: 12345,
    pathToContextDir: 'context',
    [taskName]: {
      limit: null
    }
  };
  testBase.setupMocks(config);
  new BlogTask();
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
  expect(() => new BlogTask()).toThrow();
});