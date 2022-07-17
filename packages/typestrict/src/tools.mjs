import _yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

export const useCLI = (
  /**
   * @type { import("yargs").CommandModule }
   */
  command
) => ({ command, spawn: () => execute(command) });

export const execute = (cmd) =>
  yargs.command({ ...cmd, command: '$0' }).help().argv;

export const yargs = _yargs(hideBin(process.argv));
