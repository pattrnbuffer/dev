#! /usr/bin/env yarn ts-node

import * as idiots from '@dev/node-hue-api';
import got from 'got';
import { all, siphon } from '../common';
import { Links, Link, LinkCreated } from './links';
import { API } from './types';

export const Connections = {
  connect: resolveConnections,
};

require.main === module && main();
async function main() {
  const connections = await Connections.connect(await Links.read());

  const configs = await all(connections, link =>
    link.api.configuration.getConfiguration(),
  );

  for (const cfg of configs) {
    console.log({
      [cfg.ipaddress]: cfg.bridgeid,
      name: cfg.name,
    });
  }
}

export type LinkConnected = Omit<LinkCreated, 'status'> & {
  status: 'link:connected';
  api: API;
};

export async function get(link: LinkCreated, path: 'config') {
  const data = await got
    .get(`http://${link.bridge.ipaddress}/api/${link.user.username}/${path}`)
    .json();
}

export async function resolveConnections(links: Link[]) {
  const connections = await all(links, async link => {
    if (link.status === 'link:failed') return;

    try {
      return <LinkConnected>{
        ...link,
        status: 'link:connected',
        api: await idiots.api
          // TODO: use discovery per session and use stable id
          .createLocal(link.bridge.ipaddress)
          .connect(link.user.username, link.user.clientKey),
      };
    } catch (e) {}
  });

  return connections.filter(Boolean) as LinkConnected[];
}
