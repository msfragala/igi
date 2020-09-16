import execa from 'execa';
import { log } from './log';

type Commit = {
   hash: string;
   subject: string;
   date: string;
};

export async function getCommits(branch: string): Promise<Commit[]> {
   const divider = Date.now();
   const child = await execa('git', [
      'log',
      branch,
      `--format=%h${divider}%s${divider}%cr`,
   ]).catch(error => log.panic('Error getting commits', error));

   return child.stdout.split('\n').map(line => {
      const [hash, subject, date] = line.split(divider.toString());
      return { hash, subject, date };
   });
}
