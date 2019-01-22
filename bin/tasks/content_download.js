const BaseTask = require('./base_task').BaseTask;
const CONSTANTS = require('./constants');
const logger = require('gulplog');

class ContentTask extends BaseTask {
  constructor(taskName) {
    const requiredArgs = ['hapikey', 'pathToContextDir'];
    super(taskName, requiredArgs);
  }

  async run() {
    const args = this.args;
    const requestArgs = {
      hapikey: args.hapikey,
      casing: 'snake_r',
      limit: args.limit
    };
    logger.info('Fetching content');
    const contentObjects = await this.getObjects(CONSTANTS.BASE_CONTENT_API_URL, 'contents', requestArgs)
    const portalId = contentObjects[0].portal_id;
    this.writeObjects(contentObjects, 'content', args.pathToContextDir, portalId);
  }
}

module.exports = { ContentTask }
