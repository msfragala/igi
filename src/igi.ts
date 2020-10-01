#!/usr/bin/env node

import sade from 'sade';
import { version } from '../package.json';
import cherryPick from './lib/cherry-pick';
import checkout from './lib/checkout';
import rebase from './lib/rebase';
import deleteBranch from './lib/delete-branch';
import deleteTag from './lib/delete-tag';
import merge from './lib/merge';

const program = sade('igi').version(version);

program
   .command('checkout')
   .describe('Select a branch to switch to')
   .alias('switch')
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

program.parse(process.argv);
