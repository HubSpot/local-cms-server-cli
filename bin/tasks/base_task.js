const _ = require('underscore');
const fs = require('fs');
const logger = require('gulplog');
const request = require('request-promise');
const shell = require('shelljs');
const yaml = require('js-yaml');

class BaseTask {
  constructor(name, requiredArgs) {
    this.taskName = name;
    this.project_root = process.env.project_root || process.cwd();
    const conf = yaml.safeLoad(fs.readFileSync(this.project_root + '/cli-config.yaml', 'utf8'));
    const taskArgs = conf[name];
    this.assertHasRequiredArgs(conf, taskArgs, requiredArgs);
    this.args = { ...conf, ...taskArgs };
  }

  async getObjects(baseUrl, path, additionalParams) {
    const paramsHash = additionalParams || {};
    const query = _.map(paramsHash, (val, key) => key + '=' + val).join('&');
    const url = baseUrl + path + '?' + query;
    return request
      .get(url)
      .then(response => JSON.parse(response))
      .then(parsedResponse => {
        if (parsedResponse.total > parsedResponse.limit) {
          logger.warn("Fetched %s objects out of %s", parsedResponse.limit, parsedResponse.total);
          logger.warn("Consider increasing the limit parameter if you want to use all of these objects.");
        }
        return parsedResponse.objects;
      });
  }

  writeObjects(objects, objectName, contextPath, portalId) {
    const outDir = this.project_root + '/' + contextPath + '/' + objectName + '/' + portalId;
    logger.info('Writing %s to %s', objectName, outDir);
    shell.mkdir('-p', outDir);
    objects.forEach(object => {
      const writeToFile = outDir + '/' + object.id + '.json';
      fs.writeFileSync(writeToFile, JSON.stringify(object, null, 2));
    })
  }

  assertHasRequiredArgs(globalArgs, taskArgs, requiredArgs) {
    const missingArgs = [];
    requiredArgs.forEach((requiredArg) => {
      const globalArgExists = requiredArg in globalArgs && globalArgs[requiredArg] !== null;
      const taskArgExists = requiredArg in taskArgs && taskArgs[requiredArg] !== null;
      if (!(globalArgExists || taskArgExists)) {
        missingArgs.push(requiredArg);
      }
    });
  
    if (missingArgs.length > 0) {
      throw new Error("Missing/null required arg(s) in gulp.yaml: " + JSON.stringify(missingArgs));
    }
  }
}

module.exports = { BaseTask }
