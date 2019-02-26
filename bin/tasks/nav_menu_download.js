const BaseTask = require('./base_task').BaseTask;
const { getApiUrl, DESIGN_MANAGER_API } = require('../utils/api');
const logger = require('gulplog');

const taskName = 'download-menus';

class NavMenuTask extends BaseTask {
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
    logger.info('Fetching nav menus');
    const menus = await this.getObjects(
      getApiUrl(`${DESIGN_MANAGER_API}/menus`, { env: args.env }),
      requestArgs
    );
    const portalId = menus[0].portal_id;
    this.writeObjects(menus, 'menus', args.pathToContextDir, portalId);
  }
}

module.exports = { NavMenuTask }
