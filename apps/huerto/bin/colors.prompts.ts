import { PromptObject } from 'prompts';

export type PromptReturnObject<
  V extends PromptObject & { name: any } = PromptObject<any>,
  K extends string = V['name'],
> = {
  [key in K]: V['format'] extends (...params: any[]) => any
    ? ReturnType<V['format']>
    : any;
};

export type PromptReturn<V extends PromptObject = PromptObject<any>> =
  V['format'] extends () => infer R ? R : any;

export type XYReturnObject = PromptReturnObject<typeof xy>;
export type XYReturnValue = void | [number, number];

export const xy = create({
  name: 'xy',
  type: 'text',
  message: 'x, y',
  format(text: string): XYReturnValue {
    if (text?.length > 0) {
      const [x = '5', y = x] = text.match(/(\d+)/g) ?? ([] as string[]);

      return [Number(`0.${x}`), Number(`0.${y}`)];
    }
  },
});

function create<K extends string, V extends PromptObject<K>>(prompt: V) {
  return prompt;
}

export const colorPrompt = {
  xy: xy,
};
