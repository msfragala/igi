import execa from 'execa';
import { log } from './log';

type Tag = {
   name: string;
};

export async function getTags(): Promise<Tag[]> {
   const res = await execa('git', ['tag', '--list']).catch(error =>
      log.panic('Error getting tags', error)
   );

   return res.stdout.split('\n').map(line => ({
      name: line.replace('*', '').trim(),
   }));
}
