import { getBranches } from '../utils/get-branches';
import prompts from 'prompts';
import { log } from '../utils/log';
import execa from 'execa';
import { getCommits } from '../utils/get-commits';

export default async () => {
   const branches = await getBranches();

   const $branch = await prompts({
      type: 'select',
      name: 'value',
      message: 'Choose a branch to select a commit from',
      choices: branches.map(b => ({
         disabled: b.current,
         value: b.name,
         title: b.current ? `${b.name} (current)` : b.name,
      })),
   }).catch(error => log.panic('Error choosing branch', error));

   if (!$branch?.value) {
      log.panic('No branch chosen');
   }

   const commits = await getCommits($branch.value);

   const $commit = await prompts({
      type: 'select',
      name: 'value',
      message: 'Choose a commit to cherry-pick',
      choices: commits.map(c => ({
         value: c.hash,
         title: `${c.hash} ${c.subject} (${c.date})`,
      })),
   }).catch(error => log.panic('Error choosing commit', error));

   if (!$commit?.value) {
      log.panic('No commit chosen');
   }

   const $result = await execa('git', [
      'cherry-pick',
      $commit.value,
   ]).catch(error => log.panic('Error cherry-picking commit', error));

   if ($result.exitCode !== 0) {
      log.panic('Error cherry-picking commit');
   }

   log.success(`Cherry-picked commit ${$commit.value}`);
};
