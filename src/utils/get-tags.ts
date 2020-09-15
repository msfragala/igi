import execa from 'execa';
import { fail } from './fail';

type Tag = {
   name: string;
};

export async function getTags(): Promise<Tag[]> {
   const res = await execa('git', ['tag', '--list']).catch(error =>
      fail('Error getting tags', error)
   );

   return res.stdout.split('\n').map(line => ({
      name: line.replace('*', '').trim(),
   }));
}
