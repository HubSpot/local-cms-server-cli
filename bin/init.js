#!/usr/bin/env node

const _ = require('underscore');
const packageJson = require('../package.json');
const shell = require('shelljs');

const projectRoot = process.cwd();
const scriptRoot = __dirname;

function copyFromPackage(fileName) {
  shell.cp("-R", `${scriptRoot}/../defaults/${fileName}`, projectRoot);
}

function initConfigs() {
  console.log("Initializing config files");
  copyFromPackage("cli-config.yaml");
  copyFromPackage("server-config.yaml");
  console.log("Done initializing config files");
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