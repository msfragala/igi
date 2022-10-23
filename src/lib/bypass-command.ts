import execa from 'execa';

export async function bypassCommand(command: string) {
   const index = process.argv.indexOf(command);

   if (index === -1) return;

   const overflow = process.argv.slice(index + 1);

   if (overflow.length === 0) return;

   const res = await execa('git', [command, ...overflow], {
      stdout: process.stdout,
      stderr: process.stderr,
   });

   process.exit(res.exitCode);
}
