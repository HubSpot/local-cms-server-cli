const BaseTask = require('./base_task').BaseTask;
const { getApiUrl, DESIGN_MANAGER_API } = require('../utils/api');
const logger = require('gulplog');

const taskName = 'download-layouts';

class LayoutTask extends BaseTask {
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
    logger.info('Fetching layouts');
    const layouts = await this.getObjects(
      getApiUrl(`${DESIGN_MANAGER_API}/layouts`, { env: args.env }),
      requestArgs
    );
    const portalId = layouts[0].portal_id;
    this.writeObjects(layouts, 'layouts', args.pathToContextDir, portalId);
  }
}

module.exports = { LayoutTask }
