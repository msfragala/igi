import execa from 'execa';
import { log } from '@/utils/log';
import { type Branch, getBranches } from '@/utils/get-branches';
import { prompt } from '@/lib/prompt';
import { isProtected } from '@/lib/protected-branch';

export default async () => {
   const allBranches = await getBranches();

   const branches = await prompt<string[]>({
      type: 'multiselect',
      message: 'Which branches do you want to delete?',
      instructions: false,
      hint: 'Space to select. Return to submit',
      choices: allBranches.map(b => ({
         disabled: b.current || isProtected(b.name),
         title: branchLabel(b),
         value: b.name,
      })),
   }).catch(error => log.panic('Error choosing branches', error));

   if (!branches?.length) {
      log.panic('No branches chosen');
   }

   const res = await execa('git', ['branch', '-D', ...branches]).catch(error =>
      log.panic('Error deleting branches', error)
   );

   if (res.exitCode !== 0) {
      log.panic('Error deleting branches');
   }

   log.success(
      `Successfully deleted the following branches:\n\n${branches.join('\n')}`
   );
};

function branchLabel(branch: Branch) {
   if (branch.current) {
      return `${branch.name} (cannot delete current branch)`;
   }

   if (isProtected(branch.name)) {
      return `${branch.name} (cannot delete protected branch)`;
   }

   return branch.name;
}
