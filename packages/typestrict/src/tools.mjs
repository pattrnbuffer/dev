import _yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

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
