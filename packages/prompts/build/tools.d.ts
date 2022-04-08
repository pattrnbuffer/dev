import { PromptObject, Options } from 'prompts';
export declare function promptFor<R, T extends string = string>(question: PromptObject<T>, options?: Options): Promise<R>;
export declare function promptType<K extends string, V extends PromptObject<K>>(prompt: V): V;
