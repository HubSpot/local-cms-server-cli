#!/usr/bin/env node

const _ = require('underscore');
const packageJson = require('../package.json');
const shell = require('shelljs');

const DOWNLOAD_URL_BASE = packageJson.repository + "/trunk/defaults/";

function downloadFromGit(path) {
  shell.exec("svn export " + DOWNLOAD_URL_BASE + path);
}

function initConfigs() {
  console.log("Initializing config files");
  downloadFromGit("cli-config.yaml");
  downloadFromGit("server-config.yaml");
  console.log("Done initializing config files");
}

function initDesigns() {
  console.log('Initializing designs directory');
  downloadFromGit("designs");
  console.log('Done initializing designs directory');
}

function initContext() {
  console.log('Initializing context directory');
  downloadFromGit("context");
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