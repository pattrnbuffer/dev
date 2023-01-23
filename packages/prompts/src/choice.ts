import { Choice, PromptObject } from 'prompts';
import { promp } from './promp';

export type PromptChoiceProps<T extends Choice> = Partial<
  PromptObject<T['title']>
> & {
  name: string;
  message?: string;
  choices?: T[];
};

type PromptChoice = {
  async<T extends Choice>(props: PromptChoiceProps<T>): Promise<T['value']>;
  async<T extends Choice>(name: string, choices?: T[]): Promise<T['value']>;
  async<T extends Choice>(
    ...args: [props: PromptChoiceProps<T>] | [name: string, choices?: T[]]
  ): Promise<T['value']>;
  from: <
    T extends Record<string, any> & { name?: string; description?: string },
    R extends ChoiceWithValue<T>,
  >(
    source: T[] | null | undefined,
    transform: (value: T, index: number, source: T[]) => R,
  ) => Promise<R>;
};

export type ChoiceWithValue<T> = Choice & {
  // differentiated by requiring reflective value
  value: T;
};
export function choicesFrom<
  T extends Record<string, any> & { name?: string; description?: string },
  R extends ChoiceWithValue<T>,
>(
  source?: T[] | null | undefined,
  transform: (value: T, index: number, source: T[]) => R,
): R[] {
  return source?.map(transform) ?? <R[]>[];
}

export async function promptChoice<T extends Choice>(
  props: PromptChoiceProps<T>,
): Promise<T['value']>;
export async function promptChoice<T extends Choice>(
  name: string,
  choices?: T[],
): Promise<T['value']>;
export async function promptChoice<T extends Choice>(
  ...[$1, $2]: [props: PromptChoiceProps<T>] | [name: string, choices?: T[]]
) {
  const props: PromptChoiceProps<T> =
    typeof $1 !== 'string' ? $1 : { name: $1, choices: $2 };

  return await promp.for<T['value'], T['title']>({
    ...props,
    type: 'autocomplete',
    message: props.message ?? `Which ${props.name}?`,
  });
}
promptChoice.from = choicesFrom;
