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
    const limit = additionalParams.limit;
    const paramsHash = additionalParams || {};
    const query = _.map(paramsHash, (val, key) => key + '=' + val).join('&');
    const url = baseUrl + path + '?' + query;
    return this.getObjectsPaginated(url, limit);
  }

  async getObjectsPaginated(url, limit) {
    if (limit === null) {
      logger.info(`No limit set, fetching all objects from ${url}`);
    } else {
      logger.info(`Fetching ${limit} objects from ${url}`);
      return request.get(url).then(response => JSON.parse(response).objects);
    }

    let objects = [];
    let count = 0;
    let totalObjects = null;
    let offset = 0;
    while((totalObjects === null) || (count < totalObjects)) {
      const response = await request.get(`${url}&offset=${offset}`).then(response => JSON.parse(response));
      if (totalObjects === null) {
        totalObjects = response.total;
      }

      logger.info(`Fetched ${response.objects.length} objects`);
      count += response.objects.length;
      offset += response.objects.length;
      objects = objects.concat(response.objects);
    }

    return Promise.resolve(objects);
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
