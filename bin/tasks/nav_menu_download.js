const BaseTask = require('./base_task').BaseTask;
const CONSTANTS = require('./constants');
const logger = require('gulplog');

class NavMenuTask extends BaseTask {
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
    logger.info('Fetching nav menus');
    const menus = await this.getObjects(CONSTANTS.BASE_DESIGN_MANAGER_API_URL, 'menus', requestArgs);
    const portalId = menus[0].portal_id;
    this.writeObjects(menus, 'menus', args.pathToContextDir, portalId);
  }
}

module.exports = { NavMenuTask }
