import execa from 'execa';
import prompts from 'prompts';
import { log } from '../utils/log';
import { getTags } from '../utils/get-tags';

export default async () => {
   const tags = await getTags();

   const $tags = await prompts({
      type: 'multiselect',
      name: 'values',
      message: 'Which tags do you want to delete?',
      instructions: false,
      hint: 'Space to select. Return to submit\n',
      choices: tags.map(tag => ({
         title: tag.name,
         value: tag.name,
      })),
   }).catch(error => log.panic('Error choosing tags', error));

   if (!$tags?.values) {
      log.panic('No tags chosen');
   }

   const $result = await execa('git', [
      'tag',
      '--delete',
      ...$tags.values,
   ]).catch(error => log.panic('Error deleting tags', error));

   if ($result.exitCode !== 0) {
      log.panic('Error deleting tags');
   }

   log.success(
      'Successfully deleted the following tags:\n\n',
      $tags.values.join('\n')
   );
};
