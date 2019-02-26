const BaseTask = require('./base_task').BaseTask;
const { getApiUrl, BLOGS_API } = require('../utils/api');
const logger = require('gulplog');

const taskName = 'download-blogs';

class BlogTask extends BaseTask {
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
    logger.info('Fetching blogs');
    const blogObjects = await this.getObjects(
      getApiUrl(`${BLOGS_API}/blogs`, { env: args.env }),
      requestArgs
    );
    const portalId = blogObjects[0].portal_id;
    this.writeObjects(blogObjects, 'blogs', args.pathToContextDir, portalId);
  }
}

module.exports = { BlogTask }
