import execa from 'execa';
import { log } from '@/utils/log';
import { getBranches } from '@/utils/get-branches';
import { prompt } from '@/lib/prompt';
import { isProtected } from '@/lib/protected-branch';

export default async () => {
   const branches = await getBranches();
   const upstreams = await Promise.all(branches.map(b => hasUpstream(b.name)));
   const prunable = branches
      .filter((b, i) => {
         if (b.current) return false;
         if (isProtected(b.name)) return false;
         if (upstreams[i]) return false;
         return true;
      })
      .map(b => b.name);

   if (prunable.length === 0) {
      log.fail('No branches to prune');
   }

   console.info(prunable.join('\n'));

   const answer = await prompt<boolean>({
      type: 'confirm',
      message: 'Delete the branches above?',
      instructions: false,
   });

   if (!answer) return process.exit(1);

   try {
      const res = await execa('git', ['branch', '-D', ...prunable]);
      if (res.exitCode > 0) log.panic('Error deleting prunable branches');
      process.stdout.moveCursor(0, -prunable.length - 1);
      process.stdout.clearLine(0);
      prunable.forEach(b => log.success(`Deleted branch ${b}`));
   } catch (error) {
      log.panic('Error deleting prunable branches', error);
   }
};

function hasUpstream(branch: string) {
   return execa('git', ['rev-parse', '--abbrev-ref', `${branch}@{upstream}`])
      .then(() => true)
      .catch(error => {
         if (error?.stderr?.includes('no upstream')) return false;
         throw error;
      });
}
