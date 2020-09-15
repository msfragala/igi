import sade from 'sade';
import { version } from '../package.json';

const program = sade('igi').version(version);
const run = m => m.default();

program
   .command('cherry-pick')
   .describe('')
   .action(() => import('./lib/cherry-pick').then(run));

program
   .command('checkout')
   .describe('')
   .action(() => import('./lib/checkout').then(run));

program
   .command('rebase')
   .describe('')
   .action(() => import('./lib/rebase').then(run));

program
   .command('delete branch')
   .describe('')
   .action(() => import('./lib/delete-branch').then(run));

program
   .command('delete tag')
   .describe('')
   .action(() => import('./lib/delete-tag').then(run));

program
   .command('merge')
   .describe('')
   .action(() => import('./lib/merge').then(run));

// deleteCommand.command('branch');
// deleteCommand.command('tag');

program.parse(process.argv);
