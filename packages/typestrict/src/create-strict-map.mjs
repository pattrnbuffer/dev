import { groupBy } from 'lodash-es';
import { $, globby, fs } from 'zx';
import path from 'path';
import { mapFolderConfigs } from './map-folder-configs.mjs';

export async function createStrictMap(
  /** @type {import('./types').TypeCheck.Value} */
  value,
) {
  const config = JSON.parse(String(await fs.readFile(value.configPath)));
  const allFiles = await globby(config.includes ?? ['**/*.ts', '**/*.tsx'], {
    cwd: value.projectPath,
    gitignore: true,
    ignore: value.files.map(({ file }) => file),
  });
  return allFiles;

  // const errorFiles = value.files.map(({ file }) => file);
  const safeFiles = allFiles
    .filter(file => !errorFiles.includes(file))
    .map(file => ({ file }));
  return safeFiles;

  const allConfigs = mapFolderConfigs(
    {
      ...value,
      files: safeFiles,
      lines: undefined,
    },
    { strict: true },
  );

  return allConfigs;
}
