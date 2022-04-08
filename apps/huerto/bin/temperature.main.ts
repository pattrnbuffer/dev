#! /usr/bin/env yarn ts-node
import { argv } from 'zx';
import { DateTime } from 'luxon';
// TODO: definitely call it "@dev/promps"
import { PT } from '@dev/prompts';

// does this explain the props from the prompts? or the arguments to the script?
const MainProps = {};
const TemperaturePromps = {};

async function main() {
  // TODO: check for shell argument enabling prompt
  if (argv.p ?? argv.prompt) prompt();
}

async function prompt() {
  while (
    await PT.for<unknown>(
      PT.type({
        type: 'text',
        name: 'time',
        message: 'What time is it?',
      }),
      {
        async onSubmit(_, answer?: string) {
          console.log(interpret(answer)?.toISO());
        },
      },
    )
  );
}

const AM = /am/i;
const PM = /pm/i;
function interpret(input?: string) {
  if (!input) return;
  let [hour, minute] = input.match(/(\d+)/g)?.map(v => Number(v)) ?? [];

  hour +=
    hour > 12
      ? 0
      : PM.test(input)
      ? 12
      : AM.test(input) && hour === 12
      ? -12
      : 0;
  console.log(hour, minute);
  const now = DateTime.now();
  return DateTime.fromObject({ ...now.toObject(), hour, minute });
}

require.main === module && main();
