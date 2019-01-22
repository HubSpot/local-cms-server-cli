#!/usr/bin/env node

const shell = require('shelljs');

function runTasks(tasks, printTasks) {
  process.env.project_root = process.cwd();
  process.chdir(__dirname);

  const cmd = printTasks ? 'gulp --tasks' : 'gulp ' + tasks.join(' ');
  shell.exec(cmd);
}

module.exports = {
  runTasks
};