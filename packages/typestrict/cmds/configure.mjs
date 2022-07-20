import { $, fs, path } from 'zx';
import { mapTSErrors, typecheck } from '../src/typecheck.mjs';
import { useCLI } from '../src/tools.mjs';
import { ora } from '../src/ora.mjs';
import { mapFolderConfigs } from '../src/map-folder-configs.mjs';
import { inspect } from 'util';
import { partition } from 'lodash-es';

export default useCLI({
  name: 'configure',
  params: ['[path]'],
  describe: 'Configure project for strict mode',
  handler: configure,
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

async function configure(props) {
  $.verbose = Boolean(props.verbose);
  const errors = await ora(typecheck(props.path));
  const config = mapFolderConfigs(errors);

  if (props['dry-run']) {
    console.log(inspect(config, false, 4, true));
  } else {
    const [fulfilled, rejected] = partition(
      await Promise.allSettled(
        config.map(async ({ file, config }) =>
          fs.writeFile(file, JSON.stringify(config, null, 2)),
        ),
      ),
      v => v.status === 'fulfilled',
    );

    console.log(
      `Added ${fulfilled.length} tsconfig.json, ${rejected.length} rejected`,
    );
  }

  return config;
}
