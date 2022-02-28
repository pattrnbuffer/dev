import prompts, { PromptObject, Options } from 'prompts';

export async function promptFor<R, T extends string = string>(
  question: PromptObject<T>,
  options?: Options,
) {
  const [answer] = Object.values(await prompts(question, options)) as R[];

  return answer as R;
}
