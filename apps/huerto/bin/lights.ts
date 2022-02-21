#! /usr/bin/env yarn ts-node

import prompts from 'prompts';
import { all } from '../common';
import { Links, Link } from './links';
import { Connections, LinkConnected } from './connections';
import { LightsType } from './types';
import { inspect } from 'util';

export const Lights = {
  all: resolveAllLights,
};

require.main === module && main();
async function main() {
  const lights = await resolveAllLights(await Links.read());

  console.log(inspect(lights, false, 5, true));
}

export type LightLink = {
  light: LightsType;
  link: LinkConnected;
};

export async function resolveAllLights(links: Link[]) {
  const allLinks = await Connections.connect(links);
  const lights = await all(allLinks, async link => {
    const allLights = await link.api.lights.getAll();
    return all(allLights, light => {
      return { light, link };
    });
  });

  return lights.flat(1);
}
