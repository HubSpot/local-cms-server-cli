const BaseTask = require('./base_task').BaseTask;
const { getApiUrl, CONTENT_API } = require('../utils/api');
const logger = require('gulplog');

const taskName = 'download-content';

class ContentTask extends BaseTask {
  constructor() {
    const requiredArgs = ['hapikey', 'pathToContextDir'];
    super(taskName, requiredArgs);
  }

  static getTaskName() {
    return taskName;
  }

  async run() {
    const args = this.args;
    const requestArgs = {
      hapikey: args.hapikey,
      casing: 'snake_r',
      limit: args.limit
    };
    logger.info('Fetching content');
    const contentObjects = await this.getObjects(
      getApiUrl(`${CONTENT_API}/contents`, { env: args.env }),
      requestArgs
)
    const portalId = contentObjects[0].portal_id;
    this.writeObjects(contentObjects, 'content', args.pathToContextDir, portalId);
  }
}

module.exports = { ContentTask }
