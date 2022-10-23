import execa from 'execa';
import { log } from '@/utils/log';
import { getBranches } from '@/utils/get-branches';
import { prompt } from '@/lib/prompt';
import { bypassCommand } from '@/lib/bypass-command';

export default async () => {
   await bypassCommand('merge');

   const branches = await getBranches();

   const branch = await prompt<string>({
      type: 'select',
      message: 'Choose a branch to merge',
      choices: branches
         .filter(b => !b.current)
         .map(b => ({
            disabled: b.current,
            value: b.name,
            title: b.current ? `${b.name} (current)` : b.name,
         })),
   }).catch(error => log.panic('Error choosing branch', error));

   if (!branch) {
      log.error('No branch chosen');
      return process.exit(1);
   }

   const res = await execa('git', ['merge', branch]).catch(error =>
      log.panic(`Error merging branch`, error)
   );

   if (res.exitCode !== 0) {
      log.panic(`Error merging branch`);
   }

   log.success(`Merged branch ${branch}`);
};
