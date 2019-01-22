#!/usr/bin/env node

const hubtasks = require('./hubtasks');
const program = require('commander');

program
  .command('run-tasks [tasks...]')
  .option('--tasks', 'List available tasks')
  .action((tasks, cmd) => {
    hubtasks.runTasks(tasks, cmd.tasks);
  });

program.parse(process.argv);