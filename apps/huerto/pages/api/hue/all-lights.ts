import type { NextApiRequest, NextApiResponse } from 'next';
import { Lights } from '~/bin/lights';
import { Links } from '~/bin/links';

export type AllLightsResponseData = Awaited<
  ReturnType<typeof resolveAllLights>
>;

export default async function allLights(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const result = await resolveAllLights();

  res.status(200).json(result);
}

async function resolveAllLights() {
  const links = await Links.read();
  const lights = await Lights.all(links);

  return lights.map(({ light, link }) => ({
    bridge: link.bridge.config as NonNullable<typeof link.bridge.config>,
    light: light['data'],
  }));
}
