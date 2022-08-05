import _yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { fs } from 'zx';
import { invariant } from './invariant.mjs';

export const useCLI = (
  /** @type { import("./types").CommandModule } */
  cmd,
) => ({
  command: {
    command: `${cmd.name} ${cmd.params?.join(' ')}`,
    ...cmd,
    filename: cmd.name,
  },
  spawn: () => execute(cmd),
});

export const execute =
  /** @type { import("./types").CommandModule } */
  cmd =>
    yargs
      .command({ ...cmd, command: `$0 ${cmd.params?.join(' ') ?? ''}` })
      .help().argv;

export const yargs = _yargs(hideBin(process.argv));

export const exit = async (code = 0, message = '') => {
  if (message) {
    console[code ? 'error' : 'log'](message);
  }

  await new Promise(next => setTimeout(next, 1));

  process.exit(code);
};

export const readJSON = async path => {
  const content = invariant(
    String(await fs.readFile(path)),
    `Could not find file "${path}"`,
  );

  return JSON.parse(content);
};
