const BaseTask = require('./base_task').BaseTask;
const CONSTANTS = require('./constants');
const Ftp = require('easy-ftp');
const logger = require('gulplog');
const Promise = require('promise')

class DesignsFtpTask extends BaseTask {
  constructor(taskName) {
    const requiredArgs = ['password', 'username', 'portalId', 'outDir'];
    super(taskName, requiredArgs);
  }

  async run() {
    const args = this.args;

    const config = {
      host: CONSTANTS.FTP_HOST,
      username: args.username,
      password: args.password,
      secure: true,
      port: 3200
    };
    const client = new Ftp();
    client.connect(config);
    const remoteDir = "/portals/" + args.portalId + "/content/designs/";
    const localDir = this.project_root + "/" + args.outDir;
    await this.downloadPromise(client, [{remote: remoteDir, local: localDir}]);
    logger.info("Done with FTP download");
    client.close();
  }

  async downloadPromise(ftpClient, downloadDirs) {
    return new Promise((fulfill) => {
      ftpClient.download(downloadDirs, err => {
        if (err) {
          logger.warn("Error: %s", JSON.stringify(err, null, 2));
        }
        fulfill();
      });
    });
  }
}

module.exports = { DesignsFtpTask };