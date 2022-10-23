import prompts from 'prompts';

type PromptOptions = Omit<prompts.PromptObject, 'name'>;

export function prompt<T>(options: PromptOptions): Promise<T> {
   return prompts({ ...options, name: 'value' }).then(
      answer => answer?.value as T
   );
}
