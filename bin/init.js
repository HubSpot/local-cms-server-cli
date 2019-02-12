#!/usr/bin/env node

const _ = require('underscore');
const fs = require('fs');
const inquirer = require('inquirer');
const shell = require('shelljs');
const yaml = require('js-yaml');

const projectRoot = process.cwd();
const scriptRoot = __dirname;

const CLI_CONF_FILENAME = 'cli-config.yaml';
const SERVER_CONF_FILENAME = 'server-config.yaml';
const CONFIG_QUESTIONS = [
  {
    type: 'input',
    name: 'hapikey',
    message: 'Enter hapikey (default null)',
  },
  {
    type: 'input',
    name: 'portalId',
    message: 'Enter portalId (default 123)',
  },
  {
    type: 'input',
    name: 'username',
    message: 'Enter FTP username (default null)',
  },
  {
    type: 'password',
    name: 'password',
    message: 'Enter FTP password (default null)',
  }
];

function copyFromPackage(fileName) {
  shell.cp("-R", `${scriptRoot}/../defaults/${fileName}`, projectRoot);
}

function initConfigs() {
  inquirer
    .prompt(CONFIG_QUESTIONS)
    .then(answers => {
      console.log("Initializing config files");
      copyFromPackage("cli-config.yaml");
      copyFromPackage("server-config.yaml");

      const cliConf = yaml.safeLoad(fs.readFileSync(`${projectRoot}/${CLI_CONF_FILENAME}`, 'utf8'));
      const serverConf = yaml.safeLoad(fs.readFileSync(`${projectRoot}/${SERVER_CONF_FILENAME}`, 'utf8'));
      if (answers.hapikey) cliConf.hapikey = answers.hapikey;
      if (answers.portalId) cliConf.portalId = answers.portalId;
      if (answers.username) cliConf.username = answers.username;
      if (answers.password) cliConf.password = answers.password;
      if (answers.portalId) serverConf.portalId = answers.portalId;
      fs.writeFileSync(`./${CLI_CONF_FILENAME}`, yaml.safeDump(cliConf));
      fs.writeFileSync(`./${SERVER_CONF_FILENAME}`, yaml.safeDump(serverConf));
      console.log("Done initializing config files");
    });
}

function initDesigns() {
  console.log('Initializing designs directory');
  copyFromPackage("designs");
  console.log('Done initializing designs directory');
}

function initContext() {
  console.log('Initializing context directory');
  copyFromPackage("context");
  console.log('Done initializing context directory');
}

function run(args) {
  if (_.size(args) === 0 || args.all) {
    args = {
      config: true,
      designs: true,
      context: true
    };
  }

  if (args.config) {
    initConfigs();
  }

  if (args.designs) {
    initDesigns();
  }

  if (args.context) {
    initContext();
  }
}

module.exports = {
  run
};