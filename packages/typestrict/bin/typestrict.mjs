#! /usr/bin/env node
import { yargs } from '../src/tools.mjs';
import check from '../cmds/check.mjs';
import configure from '../cmds/configure.mjs';

yargs
  .scriptName('typestrict')
  .describe('Grow stricter code. 🪴')
  .command(check.command)
  .command(configure.command)
  .help().argv;
