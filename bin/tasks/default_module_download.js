const _ = require('underscore');
const BaseTask = require('./base_task').BaseTask;
const CONSTANTS = require('./constants');
const fs = require('fs');
const logger = require('gulplog');
const shell = require('shelljs');

class DefaultModulesTask extends BaseTask {
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
    const path = 'custom-widgets/default';
    logger.info("Fetching default modules");
    const defaultModules = await this.getObjects(CONSTANTS.BASE_DESIGN_MANAGER_API_URL, path, requestArgs);
    const portalId = defaultModules[0].portal_id;
    this.writeModules(defaultModules, args.pathToContextDir, portalId);
  }

  writeModules(modules, contextDir, portalId) {
    const moduleBaseDir = this.project_root + "/" + contextDir + '/default-modules/' + portalId;
    logger.info('Writing default modules to %s', moduleBaseDir);
    modules.forEach(module => {
      const moduleDir = moduleBaseDir + '/' + module.module_id;
      const metaFields = _.omit(module, ['fields', 'css', 'source', 'js', 'messages']);
      shell.mkdir('-p', moduleDir);
      fs.writeFileSync(moduleDir + '/fields.json', JSON.stringify(module.fields, null, 2));
      fs.writeFileSync(moduleDir + '/meta.json', JSON.stringify(metaFields, null, 2));
      fs.writeFileSync(moduleDir + '/module.css', module.css || "");
      fs.writeFileSync(moduleDir + '/module.html', module.source || "");
      fs.writeFileSync(moduleDir + '/module.js', module.js || "");
      this.writeModuleLocales(moduleDir, module.messages);
    });
  }

  writeModuleLocales(moduleDir, messages) {
    const localeDir = moduleDir + '/_locales';
    shell.mkdir('-p', localeDir);
    _.each(messages, (message, language) => {
      const languageDir = localeDir + '/' + language;
      shell.mkdir('-p', languageDir);
      fs.writeFileSync(languageDir + '/messages.json', JSON.stringify(message, null, 2));
    });

  }
}

module.exports = { DefaultModulesTask }