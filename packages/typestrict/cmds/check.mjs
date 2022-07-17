#! /usr/bin/env node
import { $, path } from 'zx';
import { typecheck } from '../src/typecheck.mjs';
import { useCLI } from '../src/tools.mjs';
import { ora } from '../src/ora.mjs';

export default useCLI({
  command: 'check',
  describe: 'Type check source path for errors',
  handler: check,
  builder: (yargs) =>
    yargs
      .positional('path', {
        type: 'string',
        default: './',
        describe: 'the source path',
      })
      .option({
        report: { type: 'boolean', describe: 'reports error summary' },
        list: { type: 'boolean', describe: 'print line delimited list' },
        lines: { type: 'boolean', describe: 'return errors by lines' },
        files: { type: 'boolean', describe: 'return errors by file' },
        pretty: { type: 'boolean', describe: 'pretty print JSON' },
        verbose: { type: 'boolean', describe: 'shows shell command calls' },
      })
      .conflicts({
        files: 'lines',
        lines: 'files',
        list: 'pretty',
        report: ['files', 'lines', 'list', 'pretty'],
      }),
});

async function check(argv) {
  $.verbose = Boolean(argv.verbose);
  const [__source__] = argv._;

  const result = await ora(typecheck(path.resolve(process.cwd(), __source__)));

  // report stats
  if (argv.report) {
    report(result);
  }
  // print files
  else if (argv.files) {
    print(result.files, (v) => v.file);
  }
  // print lines
  else if (argv.lines) {
    print(result.lines, (v) => `${v.file}:${v.line}:${v.column}`);
  }
  // output everything as JSON
  else print(result, null, { ...argv, json: true });
}

function print(content, format, opts) {
  format ??= (v) => v;
  opts ??= argv;

  opts.list
    ? Array.isArray(content)
      ? console.log(...content.map((v) => format(v) + '\n'))
      : console.log(format(content))
    : console.log(
        opts.pretty ? JSON.stringify(content, null, 2) : JSON.stringify(content)
      );
}

function report(result) {
  // report errors
  if (result.files.length) {
    console.log(
      '⛈\t',
      'Oh dear, there are',
      result.lines.length,
      'errors across',
      result.files.length,
      'files'
    );
  }
  // imagine a beach, a type safe beach
  else {
    console.log('🏖\t', 'inhale, all is well');
  }
}
