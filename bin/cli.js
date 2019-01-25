#!/usr/bin/env node

const _ = require('underscore');
const hubtasks = require('./hubtasks');
const init = require('./init');
const program = require('commander');
const server = require('./main.js');

program
  .command('run-tasks [tasks...]')
  .option('--tasks', 'List available tasks')
  .action((tasks, cmd) => {
    hubtasks.runTasks(tasks, cmd.tasks);
  });

program
  .command('init')
  .option('--config', 'Initializes config files')
  .option('--designs', 'Initializes an example designs directory')
  .option('--context', 'Initializes an example context directory')
  .option('--all', 'Initializes config, designs, and context (same as omitting the flag altogether)')
  .action(cmd => {
    const options = _.pick(cmd, 'config', 'designs', 'context', 'all');
    init.run(options);
  });

program
  .command('start')
  .action(() => {
    server.run();
  });

program.parse(process.argv);