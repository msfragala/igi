import { getBranches } from '@/utils/get-branches';
import { log } from '@/utils/log';
import execa from 'execa';
import { getCommits } from '@/utils/get-commits';
import { prompt } from '@/lib/prompt';

export default async () => {
   const branches = await getBranches();

   const branch = await prompt<string>({
      type: 'select',
      message: 'Choose a branch to select a commit from',
      choices: branches.map(b => ({
         disabled: b.current,
         value: b.name,
         title: b.current ? `${b.name} (current)` : b.name,
      })),
   }).catch(error => log.panic('Error choosing branch', error));

   if (!branch) {
      log.panic('No branch chosen');
   }

   const commits = await getCommits(branch);

   const commit = await prompt<string>({
      type: 'select',
      message: 'Choose a commit to cherry-pick',
      choices: commits.map(c => ({
         value: c.hash,
         title: `${c.hash} ${c.subject} (${c.date})`,
      })),
   }).catch(error => log.panic('Error choosing commit', error));

   if (!commit) {
      log.panic('No commit chosen');
   }

   const res = await execa('git', ['cherry-pick', commit]).catch(error =>
      log.panic('Error cherry-picking commit', error)
   );

   if (res.exitCode !== 0) {
      log.panic('Error cherry-picking commit');
   }

   log.success(`Cherry-picked commit ${commit}`);
};
