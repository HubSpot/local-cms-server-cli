const FtpUploadTask = require('../bin/ftp_upload').FtpUploadTask;
const testBase = require('./tasks/test_base');

const taskName = FtpUploadTask.getTaskName();

it('Should not throw an error if the required args are present.', () => {
  const config = {
    portalId: 123,
    username: 'user',
    password: 'password',
    [taskName]: {
      designsPath: 'designs',
      files: [ 'test.txt' ] 
    }
  };
  testBase.setupMocks(config);
  new FtpUploadTask();
});

it('Should throw an error if the required args are absent.', () => {
  const config = {
    portalId: null,
    username: null,
    password: null,
    [taskName]: {
      designsPath: null,
      files: null
    }
  };
  testBase.setupMocks(config);
  expect(() => new FtpUploadTask()).toThrow();
});