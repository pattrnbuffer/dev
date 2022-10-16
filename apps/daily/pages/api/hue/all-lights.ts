import type { NextApiRequest, NextApiResponse } from 'next';
import * as idiots from '@bffr/node-hue-api';

export default async function lights(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  res.status(200).json(await resolveLights());
}

export const resolveLights = async () => {
  const [bridge] = await resolveBridges();

  return bridge.lights.getAll();
};

export const resolveBridges = async () => {
  const results = await idiots.discovery.nupnpSearch();

  return Promise.all(
    results.map(bridge =>
      idiots.api.createLocal(bridge.ipaddress).connect('huerto', 'one'),
    ),
  );
};
