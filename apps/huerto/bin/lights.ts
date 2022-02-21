#! /usr/bin/env yarn ts-node

import prompts from 'prompts';
import { all, siphon } from '../common';
import { Links, Link, LinkCreated } from './links';
import { Connections } from './connections';
import { API } from './types';

export const Lights = {
  all: resolveAllLights,
};

require.main === module && main();
async function main() {
  const lights = await resolveAllLights(await Links.read());
  console.log(lights);
}

export async function resolveAllLights(links: Link[]) {
  const allLinks = await Connections.connect(links);
  const result = await all(allLinks, link => link.api.lights.getAll());

  return result.flat(1);
}
