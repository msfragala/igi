import execa from 'execa';
import { log } from '@/utils/log';
import { getTags } from '@/utils/get-tags';
import { prompt } from '@/lib/prompt';

export default async () => {
   const allTags = await getTags();

   const tags = await prompt<string[]>({
      type: 'multiselect',
      message: 'Which tags do you want to delete?',
      instructions: false,
      hint: 'Space to select. Return to submit\n',
      choices: allTags.map(tag => ({
         title: tag.name,
         value: tag.name,
      })),
   }).catch(error => log.panic('Error choosing tags', error));

   if (!tags?.length) {
      log.panic('No tags chosen');
   }

   const res = await execa('git', ['tag', '--delete', ...tags]).catch(error =>
      log.panic('Error deleting tags', error)
   );

   if (res.exitCode !== 0) {
      log.panic('Error deleting tags');
   }

   log.success(
      `Successfully deleted the following tags:\n\n${tags.join('\n')}`
   );
};
