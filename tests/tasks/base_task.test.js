const BaseTask = require('../../bin/tasks/base_task').BaseTask;
const Promise = require('promise');
const request = require('request-promise');
const testBase = require('./test_base');

beforeAll(() => {
  testBase.setupMocks({});
  const mockResponse = {
    total: 3,
    objects: [{
      id: 1,
    }]
  };
  request.get = jest.fn().mockResolvedValue(JSON.stringify(mockResponse));
});

it('Should return the number of objects specified by limit', async () => {
  const objects = await new BaseTask('test-task', []).getObjects('https://test.com/', 'entity', { limit: 1 });
  expect(objects).toHaveLength(1);
});

it('Should return all objects if limit is null', async () => {
  const objects = await new BaseTask('test-task', []).getObjects('https://test.com/', 'entity', { limit: null });
  expect(objects).toHaveLength(3);
});