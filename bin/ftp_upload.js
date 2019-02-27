const _ = require('underscore');
const BaseTask = require('./tasks/base_task').BaseTask;
const CONSTANTS = require('./tasks/constants');
const Ftp = require('easy-ftp');
const inquirer = require('inquirer');

const taskName = 'ftp-upload';

class FtpUploadTask extends BaseTask {
  constructor() {
    const requiredArgs = ['username', 'password', 'designsPath', 'portalId', 'files'];
    super(taskName, requiredArgs);
  }

  static getTaskName() {
    return taskName;
  }

  async run() {
    const args = this.args;
    const designsPath = args[taskName].designsPath;
    const files = _.filter(args[taskName].files, file => file !== null);
    if (_.size(files) === 0) {
      console.log('No files to upload. Add them to the ftp-upload config in cli-config.yaml');
      return;
    }
    const ftpPrefix = `portals/${args.portalId}/content/designs`;
    const uploads = _.map(files, file => ({
      local: `${designsPath}/${file}`,
      remote: `${ftpPrefix}/${file}`
    }));
    const confirmed = await this.confirmUpload(uploads);
    if (!confirmed) return;

    console.log('Starting FTP upload...');
    const config = {
      host: CONSTANTS.FTP_HOST,
      username: args.username,
      password: args.password,
      secure: true,
      port: 3200
    };
    const client = new Ftp();
    client.connect(config);
    try {
      await this.uploadToFtp(client, uploads);
    } catch (err) {
      console.log('Error uploading to FTP: ', err);
    } finally {
      client.close();
    }

    console.log('Finished with FTP upload.');
  }

  confirmUpload(uploads) {
    let uploadStr = '\nLocal File --> FTP Destination\n\n';
    uploads.forEach(upload => {
      uploadStr += `${upload.local} --> ${upload.remote}\n`;
    });
    console.log(uploadStr);
    return inquirer
      .prompt([{
        type: 'confirm',
        name: 'confirmed',
        message: 'Does this look ok?',
        default: true,
      }])
      .then(answer => answer.confirmed);
  }

  uploadToFtp(client, uploads) {
    return new Promise((resolve, reject) => {
      client.upload(uploads, err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

module.exports = { FtpUploadTask }
