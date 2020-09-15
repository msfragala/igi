import { green, red, yellow } from 'kleur';

export function fail(message: string, error?: Error) {
   let output = red(message);
   if (error) output += `\n${error}`;
   console.error(output);
   return process.exit(1);
}

export const log = {
   warn(...messages: string[]) {
      console.warn(yellow(messages.join('')));
   },
   error(message: string, error?: Error) {
      let output = red(message);
      if (error) output += `\n${error}`;
      console.error(output);
   },
   success(...messages: string[]) {
      console.log(green(messages.join('')));
   },
   panic(message: string, error?: Error): never {
      this.error(message, error);
      return process.exit(1);
   },
};
