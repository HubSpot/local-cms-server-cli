const _ = require('underscore');
const BaseTask = require('./base_task').BaseTask;
const CONSTANTS = require('./constants');
const fs = require('fs');
const logger = require('gulplog');
const shell = require('shelljs');

const taskName = 'download-resource-mappings';

class ResourceMappingTask extends BaseTask {
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
    logger.info('Fetching resource mappings');
    const templates = await this.getObjects(CONSTANTS.BASE_DESIGN_MANAGER_API_URL, 'templates', requestArgs);
    const portalId = templates[0].portal_id;
    const mappings = this.getIdToPathMap(templates);
    const outDir = this.project_root + "/" + args.pathToContextDir + "/resource-mappings/" + portalId;
    shell.mkdir('-p', outDir);
    logger.info("Writing mappings to %s", outDir);
    fs.writeFileSync(outDir + "/mappings.json", JSON.stringify(mappings, null, 2));
  }

  getIdToPathMap(resources) {
    const arrayOfMappings = resources.map(resource => ({ [resource.id]: resource.path }));
    return _.reduce(arrayOfMappings,
      (idsToPaths, idToPath) => ({ ...idsToPaths, ...idToPath }),
      {});
  }
}

module.exports = { ResourceMappingTask }