const DesignsFtpTask = require('../../bin/tasks/download_ftp_designs').DesignsFtpTask;
const testBase = require('./test_base');

const taskName = DesignsFtpTask.getTaskName();

it('Should not throw an error if the required args are present.', () => {
  const config = {
    username: 'user',
    password: 'password',
    portalId: 123,
    [taskName]: {
      outDir: 'designs'
    }
  };
  testBase.setupMocks(config);
  new DesignsFtpTask();
});

it('Should throw an error if the required args are absent.', () => {
  const config = {
    username: null,
    password: null,
    portalId: null,
    [taskName]: {
      outDir: null
    }
  };
  testBase.setupMocks(config);
  expect(() => new DesignsFtpTask()).toThrow();
});