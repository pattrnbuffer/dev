import { NextApiHandler } from 'next';
import { setColorForAllLights } from '~/bin/color';
import { Links } from '~/bin/links';

const links = Links.read();
const allLightColorsEndpoint: NextApiHandler = async (req, res) => {
  const [x, y] = req.query.slugs.slice(0, 2);

  console.log(x, y);

  await setColorForAllLights(await links, next => {
    return next.xy(Number(x), Number(y));
  });

  res.status(200).json({ x, y });
};

export default allLightColorsEndpoint;
