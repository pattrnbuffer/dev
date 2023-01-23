import prompts, { PromptObject, Options } from 'prompts';

export async function promptFor<R, T extends string = string>(
  question: PromptObject<T>,
  options?: Options,
) {
  const [answer] = Object.values(await prompts(question, options)) as R[];

  return answer as R;
}

export function promptType<K extends string, V extends PromptObject<K>>(
  prompt: V,
) {
  return prompt;
}

// type CreatePrompter<T, R> = () => Prompter<T, R>;
export type Prompter<S, A> = (state?: S, answer?: A) => PrompterState<S>;
export type PrompterState<S> = [S] | [S, PromptObject | undefined];
export async function promptLoop<S, A extends any = any>(
  prompter: Prompter<S, A>,
) {
  let [state, prompt] = prompter();

  while (prompt) {
    [state, prompt] = prompter(state, await promptFor<A>(prompt));
  }

  return state;
}
