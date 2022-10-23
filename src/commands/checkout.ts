import execa from 'execa';
import { getBranches } from '@/utils/get-branches';
import { log } from '@/utils/log';
import { prompt } from '@/lib/prompt';

export default async () => {
   const branches = await getBranches();

   const branch = await prompt<string>({
      type: 'select',
      message: 'Choose a branch to switch to',
      choices: branches
         .filter(b => !b.current)
         .map(b => ({
            value: b.name,
            title: b.current ? `${b.name} (current)` : b.name,
         })),
   }).catch(error => log.panic('Error choosing branch', error));

   if (!branch) {
      log.error('No branch chosen');
      return process.exit(1);
   }

   const res = await execa('git', ['checkout', branch]).catch(error =>
      log.panic('Error checking out branch', error)
   );

   if (res.exitCode !== 0) {
      log.panic('Error checking out branch');
   }

   log.success(`Checked out branch ${branch}`);
};
