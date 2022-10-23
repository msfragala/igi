import execa from 'execa';
import { log } from '@/utils/log';

export type Branch = {
   name: string;
   current: boolean;
};

export async function getBranches(): Promise<Branch[]> {
   const res = await execa('git', ['branch']).catch(error =>
      log.panic('Error getting branch names', error)
   );

   return res.stdout.split('\n').map(line => ({
      name: line.replace('*', '').trim(),
      current: line.includes('*'),
   }));
}
