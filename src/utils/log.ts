import kleur from 'kleur';

export const log = {
   error(message: string, error?: Error) {
      let output = kleur.red(message);
      if (error) output += `\n${error}`;
      console.error(output);
   },
   success(...messages: string[]) {
      console.log(kleur.green(messages.join('')));
   },
   panic(message: string, error?: Error): never {
      this.error(message, error);
      return process.exit(1);
   },
};
