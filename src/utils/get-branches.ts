import execa from 'execa';
import { fail } from './fail';

type Branch = {
   name: string;
   current: boolean;
};

export async function getBranches(): Promise<Branch[]> {
   const res = await execa('git', ['branch']).catch(error =>
      fail('Error getting branch names', error)
   );

   return res.stdout.split('\n').map(line => ({
      name: line.replace('*', '').trim(),
      current: line.includes('*'),
   }));
}
