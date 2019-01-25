#!/usr/bin/env node

const fs = require('fs');
const shell = require('shelljs');
const yaml = require('js-yaml');

const CONFIG_FILE = 'server-config.yaml';
const cwd = process.cwd();

function run() {
  if (!fs.existsSync(`${process.cwd()}/${CONFIG_FILE}`)) {
    console.log(`No ${CONFIG_FILE} found in the current directory. Exiting`);
    return;
  }

  const conf = yaml.safeLoad(fs.readFileSync(`${cwd}/${CONFIG_FILE}`));
  const designsDir = conf.templateBaseDir;
  const contextDir = conf.contextBaseDir;

  const cmd = `
    docker run -p 8080:8080 \
    -v ${cwd}/${designsDir}:/local-cms-server/${designsDir} \
    -v ${cwd}/${contextDir}:/local-cms-server/${contextDir} \
    -v ${cwd}/${CONFIG_FILE}:/local-cms-server/${CONFIG_FILE} \
    hubspot/local-cms-server
  `;

  console.log("Running: " + cmd);
  shell.exec(cmd);
}

module.exports = {
  run
};