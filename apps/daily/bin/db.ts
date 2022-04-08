#! /usr/bin/env yarn ts-node
import * as path from 'path';
import { fs } from 'zx';
import { inspect } from 'util';
import findRoot from 'find-root';
import { parse } from 'yaml';
import { config } from '../backend';

export const db = Object.assign(
  (path: string) => {
    const data = read(path);
  },
  {
    read,
    path,
    create,
  },
);

function create<T>(props: { name: string; data: T }) {
  return {
    add() {},
    remove() {},
    assign() {},
  };
}

export async function read<T>(filepath: string) {
  const reader = fs.readFile(path.resolve(filepath));
  const value = String(await reader);
  return parse(value) as T;
}

/**
 * Read and manage links … maybe?
 */
require.main === module && main();
async function main() {
  const db = await read(config.DB_PATH);

  console.log(ins);
}
