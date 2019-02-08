const BaseTask = require('./base_task').BaseTask;
const CONSTANTS = require('./constants');
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
    const layouts = await this.getObjects(CONSTANTS.BASE_DESIGN_MANAGER_API_URL, 'layouts', requestArgs);
    const portalId = layouts[0].portal_id;
    this.writeObjects(layouts, 'layouts', args.pathToContextDir, portalId);
  }
}

module.exports = { LayoutTask }