import { findUp } from 'find-up';
import { groupBy } from 'lodash-es';
import { $, path } from 'zx';
import { invariant } from './invariant.mjs';

/**
 * @typedef {import('./types').TypeCheck.Line[]} Line
 * @typedef {import('./types').TypeCheck.File[]} File
 */

/**
 * locate nearest tsconfig and compile under --strict
 */
export async function typecheck(sourcePath) {
  const configPath = invariant(
    await tsconfigPathFrom(sourcePath),
    `Could not find tsconfig.*.json near ${sourcePath}`,
  );
  const projectPath = path.dirname(configPath);

  /** @type {Line[]} */
  let lines = [];
  /** @type {File[]} */
  let files = [];

  try {
    await $`
      cd ${projectPath}
      yarn run tsc --noEmit --strict --project ${configPath}
    `;
  } catch (process) {
    [lines, files] = mapTSErrors(process.stdout);
  }

  return {
    configPath,
    projectPath,
    lines,
    files,
  };
}

/**
 * parse the errors from process output
 * @type  {(stdout: string) => [Line[], File[]]}
 */
export function mapTSErrors(stdout) {
  const lines = stdout
    .split(/\n/)
    .filter(line => /\.tsx?\(\d+,\d+\):/gi.test(line))
    .map(point => {
      let [file, line, column] = point
        .replace(/:\s+error\s+TS.+/g, '')
        .replace(/(\.*)\((\d+),(\d+)\)/, '$1…$2…$3')
        .split(/…/);

      return { file, line, column };
    });

  const files = Object.entries(groupBy(lines, src => src.file)).map(
    ([file, lines]) => ({ file, lines }),
  );

  return [lines, files];
}

async function tsconfigPathFrom(/**@type{string}*/ sourcePath) {
  const source = path.parse(sourcePath);
  const filename =
    source.name.startsWith('tsconfig') && source.ext.endsWith('.json')
      ? source.name + source.ext
      : 'tsconfig.json';

  return findUp(filename, { cwd: sourcePath });
}
