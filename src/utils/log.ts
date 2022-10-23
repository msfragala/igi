import pico from 'picocolors';
// ✖︎
export const log = {
   info(message: string) {
      console.info(message);
   },
   warn(message: string) {
      console.info(pico.red('✖︎'), message);
   },
   error(message: string, error?: Error) {
      let output = pico.red(`✖︎ ${message}`);
      if (error) output += `\n${error}`;
      console.error(output);
   },
   success(message: string) {
      console.info(pico.green('✔️'), message);
   },
   fail(message) {
      this.warn(message);
      return process.exit(1);
   },
   panic(message: string, error?: Error): never {
      this.error(message, error);
      return process.exit(1);
   },
};
