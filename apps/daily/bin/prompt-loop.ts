import { PromptObject } from 'prompts';
import { promptFor } from '@bffr/prompts';

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
