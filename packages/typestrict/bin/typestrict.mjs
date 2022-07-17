#! /usr/bin/env node
import { yargs } from '../src/tools.mjs';
import check from '../cmds/check.mjs';

yargs
  .scriptName('typestrict')
  .describe('Grow stricter code. 🪴')
  .command(check)
  .help().argv;
