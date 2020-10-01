import execa from 'execa';
import prompts from 'prompts';
import { log } from '../utils/log';
import { getBranches } from '../utils/get-branches';

export default async () => {
   const branches = await getBranches();

   const $branch = await prompts({
      type: 'select',
      name: 'value',
      message: 'Choose a branch to merge',
      choices: branches.map(b => ({
         disabled: b.current,
         value: b.name,
         title: b.current ? `${b.name} (current)` : b.name,
      })),
   }).catch(error => log.panic('Error choosing branch', error));

   if (!$branch?.value) {
      log.error('No branch chosen');
      return process.exit(1);
   }

   const $result = await execa('git', ['merge', $branch.value]).catch(error =>
      log.panic(`Error merging branch`, error)
   );

   if ($result.exitCode !== 0) {
      log.panic(`Error merging branch`);
   }

   log.success(`Merged branch ${$branch.value}`);
};
