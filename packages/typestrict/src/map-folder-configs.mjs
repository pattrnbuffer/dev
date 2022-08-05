import { groupBy } from 'lodash-es';
import path from 'path';

export function mapFolderConfigs(
  /** @type {import('./types').TypeCheck.Value} */
  { configPath, projectPath, files },
  compilerOptions,
) {
  return Object.entries(groupBy(files, ({ file }) => path.dirname(file))).map(
    ([folder, files]) => {
      const filesPath = path.resolve(projectPath, folder);
      const file = path.join(filesPath, 'tsconfig.json');
      return {
        file: file,
        folder: filesPath,
        filesPath,
        config: {
          '@@score': files.length,
          compilerOptions,
          extends: path.relative(filesPath, configPath),
          include: ['*.ts', '*.tsx'],
          exclude: files.map(({ file }) => {
            const parsed = path.parse(file);

            return path.relative(filesPath, path.resolve(projectPath, file));
          }),
        },
      };
    },
  );
}
