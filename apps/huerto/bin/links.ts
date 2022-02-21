#! /usr/bin/env yarn ts-node
import * as path from 'path';
import * as fs from 'fs/promises';
import { inspect } from 'util';
import findRoot from 'find-root';
import { Bridge } from './types';

export const Links = {
  read: resolveLinks,
  path: resolveLinksPath,
};

/**
 * Read and manage links … maybe?
 */
require.main === module && main();
async function main() {
  const links = await Links.read();

  console.log(inspect(links, false, 4, true));
}

export type Link = LinkCreated | LinkFailed;

export type LinkCreated = {
  status: 'link:created';
  bridge: Bridge;
  user: {
    username: string;
    clientKey: string;
  };
};

export type LinkFailed = {
  status: 'link:failed';
  bridge: Bridge;
};

async function resolveLinks() {
  let links: Link[] = [];

  try {
    const file = await fs.readFile(await resolveLinksPath());
    const string = file ? String(file) : undefined;

    links = JSON.parse(string ?? '[]');
  } catch (error) {}

  return links;
}

async function resolveLinksPath() {
  return path.resolve(findRoot(process.cwd()), 'links.local.json');
}
