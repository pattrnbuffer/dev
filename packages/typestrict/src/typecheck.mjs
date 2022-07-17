import { findUp } from 'find-up';
import { groupBy } from 'lodash-es';
import { $, path } from 'zx';
import { invariant } from './invariant.mjs';

export async function typecheck(sourcePath) {
  const configPath = invariant(
    await tsconfigPathFrom(sourcePath),
    `Could not find tsconfig.*.json near ${sourcePath}`
  );
  const projectPath = path.dirname(configPath);

  let lines = [];
  let files = [];

  try {
    await $`
      cd ${projectPath}
      yarn run tsc --noEmit --strict --project ${configPath}
    `;
  } catch (process) {
    // parse the errors from process output
    lines = process.stdout
      .split(/\n/)
      .filter((line) => /\.tsx?\(\d+,\d+\):/gi.test(line))
      .map((point) => {
        let [file, line, column] = point
          .replace(/:\s+error\s+TS.+/g, '')
          .replace(/(\.*)\((\d+),(\d+)\)/, '$1…$2…$3')
          .split(/…/);

        return { file, line, column };
      });

    files = Object.entries(groupBy(lines, (src) => src.file)).map(
      ([file, lines]) => ({ file, lines })
    );
  }

  return {
    configPath,
    projectPath,
    lines,
    files,
  };
}

async function tsconfigPathFrom(sourcePath) {
  const source = path.parse(sourcePath);
  const filename =
    source.name.startsWith('tsconfig') && source.ext.endsWith('.json')
      ? source.name + source.ext
      : 'tsconfig.json';

  return findUp(filename, { cwd: sourcePath });
}
