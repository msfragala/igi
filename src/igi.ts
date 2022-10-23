import sade from 'sade';
import { version } from '../package.json';
import cherryPick from '@/commands/cherry-pick';
import checkout from '@/commands/checkout';
import rebase from '@/commands/rebase';
import deleteBranch from '@/commands/delete-branch';
import deleteTag from '@/commands/delete-tag';
import merge from '@/commands/merge';
import pruneBranches from '@/commands/prune-branches';

const program = sade('igi').version(version);

program
   .command('switch')
   .describe('Select a branch to switch to')
   .alias('checkout')
   .action(checkout);

program
   .command('cherry-pick')
   .describe('Select a branch and commit whose changes to apply')
   .action(cherryPick);

program
   .command('delete branch')
   .describe('Select branches to (force) delete')
   .action(deleteBranch);

program
   .command('delete tag')
   .describe('Select tags to delete')
   .action(deleteTag);

program
   .command('merge')
   .describe('Select a branch to merge into the current branch')
   .action(merge);

program
   .command('rebase')
   .describe('Select a branch to reapply commits on top of')
   .action(rebase);

program
   .command('prune-branches')
   .describe('Delete local branches with no upstream')
   .action(pruneBranches);

program.parse(process.argv);
