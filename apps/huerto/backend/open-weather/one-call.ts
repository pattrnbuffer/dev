import got from 'got';
import { OneCallResponseType } from './types';
import { appId, dataUrl, units } from './config';

export type OneCallProps = {
  location: [string, string];
};

export const oneCall = (props: OneCallProps) =>
  got(oneCall.url(props)).json<OneCallResponseType>();

oneCall.url = ({ location: [lat, long] }: OneCallProps) =>
  `${dataUrl}/onecall?appid=${appId}&lat=${lat}&lon=${long}&units=${units}`;
