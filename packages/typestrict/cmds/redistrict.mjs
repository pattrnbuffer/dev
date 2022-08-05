import { inspect } from 'util';
import { $, fs } from 'zx';
import { createStrictMap } from '../src/create-strict-map.mjs';
import { ora } from '../src/ora.mjs';
import { exit, useCLI } from '../src/tools.mjs';
import { typecheck } from '../src/typecheck.mjs';

export default useCLI({
  name: 'redistrict',
  params: ['[path]'],
  describe: 'Redistrict your strictness',
  handler: redistrict,
  builder: yargs =>
    yargs
      .positional('path', {
        type: 'string',
        default: './',
        describe: 'the source path',
      })
      .option({
        'dry-run': { type: 'boolean', describe: 'show changes to be made' },
        verbose: { type: 'boolean', describe: 'shows shell command calls' },
      })
      .conflicts({
        // 'dryRun'
      }),
});

async function redistrict(props) {
  $.verbose = Boolean(props.verbose);
  // const errors = await ora(typecheck(props.path));
  const errors = JSON.parse(String(await fs.readFile('./check.stdout')));
  console.log(errors.files.map(v => v.file));
  const strictMap = await createStrictMap(errors);

  await exit(0, inspect(strictMap, false, 4, true));
  await exit(0, inspect(strictMap, false, 4, true));

  return strictMap;
}
