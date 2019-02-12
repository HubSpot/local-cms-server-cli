#!/usr/bin/env node

const browserSync = require('browser-sync');
const fs = require('fs');
const opn = require('opn');
const retry = require('requestretry');
const shell = require('shelljs');
const yaml = require('js-yaml');

const CONFIG_FILE = 'server-config.yaml';
const cwd = process.cwd();
const URL = "http://localhost:8080";

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
  shell.exec(cmd, { async: true } );
  openBrowser();
}

function openBrowser() {
  retry({
    url: URL,
    json: true,
    maxAttempts: 100,
    retryDelay: 1000
  })
  .then(() => {
    browserSync.init({
      proxy: URL,
      files: [
        './designs/**',
        './context/**'
      ]
    });
  })
  .catch(() => {
    console.log(`Unable to open browser. Try manually navigating to ${URL}`);
  });
}

module.exports = {
  run
};