const { green, red, yellow } = require('kleur');
const { version } = require('./package.json');
const execa = require('execa');
const prompts = require('prompts');
const sade = require('sade');

const fail = (message, error) => {
   const output = red(message);
   if (error) output += `\n${error}`;
   console.error(output);
   process.exit(1);
};

const program = sade('git-burn', true)
   .version(version)
   .describe('Delete local branches via an interactive menu')
   .action(async () => {
      const res = await execa('git', ['branch']).catch(error =>
         fail('Error getting branch names', error)
      );

      let currentBranch;
      const branches = res.stdout.split('\n').map(branch => {
         const name = branch.replace('*', '').trim();
         if (branch.includes('*')) currentBranch = name;
         return name;
      });

      const { choices } = prompts({
         type: 'multiselect',
         name: 'choices',
         message: 'Which branches do you want to delete?',
         instructions: false,
         choices: branches.map(name => ({
            disabled: name === currentBranch,
            title: name === currentBranch ? `${name} (current)` : name,
            value: name,
         })),
         hint: 'Space to select. Return to submit\n',
      }).catch(error => {
         fail('Error prompting branches to delete', error);
      });

      if (!choices || !choices.length) {
         fail(yellow('No branches selected'));
      }

      const result = await execa('git', ['branch', '-D', ...choices]).catch(
         error => {
            fail('Error deleting branches', error);
         }
      );

      if (result.exitCode !== 0) {
         fail('Error deleting branches', result.stdout);
      }

      console.log(
         `${green(
            'Successfully deleted the following branches:'
         )}\n\n${choices.join('\n')}`
      );
   });

program.parse(process.argv);
