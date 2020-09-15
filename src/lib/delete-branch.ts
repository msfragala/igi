import execa from 'execa';
import prompts from 'prompts';
import { log } from '../utils/fail';
import { getBranches } from '../utils/get-branches';

export default async () => {
   const branches = await getBranches();

   const $branches = await prompts({
      type: 'multiselect',
      name: 'values',
      message: 'Which branches do you want to delete?',
      instructions: false,
      hint: 'Space to select. Return to submit\n',
      choices: branches.map(b => ({
         disabled: b.current,
         title: b.current ? `${b.name} (current)` : b.name,
         value: b.name,
      })),
   }).catch(error => log.panic('Error choosing branches', error));

   if (!$branches?.values) {
      log.panic('No branches chosen');
   }

   const $result = await execa('git', [
      'branch',
      '-D',
      ...$branches.values,
   ]).catch(error => log.panic('Error deleting branches', error));

   if ($result.exitCode !== 0) {
      log.panic('Error deleting branches');
   }

   log.success(
      'Successfully deleted the following branches:\n\n',
      $branches.values.join('\n')
   );
};
