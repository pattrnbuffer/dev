#! /usr/bin/env yarn ts-node

import { mapValues, reduce, omit } from 'lodash';
import { config, DailyDatabase, Supplement } from '../backend';
import { read } from './db';
import { Choice, PromptObject } from 'prompts';
import { promptLoop } from './prompt-loop';
import { fs, path } from 'zx';
import { inspect } from 'util';
import Q from 'js-quantities';

type Options<T> = Record<string, Choice>;
type Selection = Record<string, Supplement>;
/**
 * Add things up
 */
require.main === module && main();
export async function main() {
  const db = await read<DailyDatabase>(config.DB_PATH);
  const choices: Options<Supplement> = mapValues(
    db.data.supplements,
    supplement => ({
      title: supplement.name,
      value: supplement.name,
      disable: false,
    }),
  );

  // const selection: Selection = {};

  // for (let done = false; !done; ) {
  //   await promptFor(
  //     {
  //       message: 'Add supplement',
  //       name: 'selection',
  //       type: 'autocomplete',

  //       choices: [...Object.values(choices), { title: 'done', value: 'done' }],
  //     },
  //     {
  //       async onSubmit(_, choice?: string) {
  //         if (choice && choice !== 'done')
  //           selection[choice] = db.data.supplements[choice];
  //         else done = true;
  //       },
  //     },
  //   );
  // }

  type State = {
    answers: Supplement[];
    options: Options<Supplement>;
  };

  const formulation = await promptLoop<State, string>((state, choice) => {
    if (state && choice === 'done') return [state];

    let { answers, options } = state ?? {
      answers: [],
      options: choices,
    };

    if (choice) {
      answers = [...answers, db.data.supplements[choice]];
      options = omit(options, choice);
    }

    return [
      { ...state, answers: answers, options },
      {
        message: 'Add supplement',
        name: 'selection',
        type: 'autocomplete',
        choices: Object.values(options).concat({
          title: 'done',
          value: 'done',
        }),
      },
    ];
  });

  console.log(formulation.answers);

  const sum = reduce(
    formulation.answers,
    (sum, supplement) => sum.add(Q(supplement.mass)),
    Q('0 g'),
  );

  console.log(sum.toString());
}

const whatever = (
  state: {
    answers: Supplement[];
    options: Options<Supplement>;
  },
  answer: string,
) => {
  if (answer === 'done') {
    return [state];
  }
  if (!state && !answer) {
    state ??= {
      answers: [],
      options: { ...choices },
    };
  }

  // if (answer === 'done') {
  //   return [, state];
  // }

  // if (answer && answer in state.options) {
  //   delete state.options[answer];
  // }

  return [
    state,
    {
      name: 'anything',
      type: 'text',
    },
  ] as const;
};
