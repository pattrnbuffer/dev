import { groupBy } from 'lodash-es';
import path from 'path';

export function mapFolderConfigs(
  /** @type {import('./types').TypeCheck.Value} */
  { configPath, projectPath, files },
) {
  return Object.entries(groupBy(files, ({ file }) => path.dirname(file))).map(
    ([folder, files]) => {
      folder = path.resolve(projectPath, folder);

      return {
        file: path.join(folder, 'tsconfig.json'),
        config: {
          extends: path.relative(folder, configPath),
          compilerOptions: {
            strict: false,
          },
          files: files.map(({ file }) => path.parse(file).base),
        },
      };
    },
  );
}
