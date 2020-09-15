const { green, red, yellow } = require('kleur');
const { version } = require('./package.json');
const execa = require('execa');
const prompts = require('prompts');
const sade = require('sade');

const fail = (message, error) => {
   const output = red(message);
   if (error) output += `\n${error}`;
   console.error(output);
   process.exit(1);
};

const program = sade('igi', true).version(version);

program
   .command('cherry-pick')
   .describe('')
   .action(() => require('./cherry-pick')());

program.command('delete').command('branch');
program.command('delete').command('tag');

program
   .command('checkout')
   .describe('')
   .action(() => require('./checkout')());

program
   .command('rebase')
   .describe('')
   .action(() => require('./rebase')());

program
   .command('branch-delete')
   .describe('')
   .action(() => require('./delete-branch')());

program
   .command('merge')
   .describe('')
   .action(() => require('./merge')());

program.parse(process.argv);
