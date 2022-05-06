import type { NextPage } from 'next';
import Head from 'next/head';
import React, {
  useEffect,
  useMemo,
  useState,
  VoidFunctionComponent,
} from 'react';
import filter from 'lodash/filter';
import { Box, Text, Heading } from '@chakra-ui/react';
import { useInterval, useMountedEffect, useMountedRef } from '@dev/hooks';
import { useAllLights, AllLightsResult } from '~/frontend';
import { ColorConverter } from '~/common/npm-cie-rgb-color-converter';
import {
  useLightState,
  UseLightStateProps,
  UseLightStateResponse,
  LightState,
  toLightStateFromCommand,
} from '~/frontend/providers/api/use-light-state';

const Lights: NextPage = () => {
  const [history, pushState, remove] = useLightState();
  const [allLights, update] = useAllLights();

  const resolved = useMemo(
    () => history.find(v => v.type === 'resolved'),
    [history],
  );

  useMountedEffect(
    mounted => {
      if (!resolved) return;

      const batch = history.filter(
        v => v.type === 'resolved' || v.type === 'rejected',
      );

      update().then(
        mounted.callback(() =>
          remove(({ request }) => batch.some(c => request === c.request)),
        ),
      );
    },
    [resolved],
  );

  const stateMap = useMemo(() => {
    const oldest = [...history].reverse();
    const acc = {
      ...allLights?.data?.reduce((acc, { light: { id, state } }) => {
        acc[id] = state;
        return acc;
      }, {} as Record<string | number, LightState>),
    };

    oldest?.forEach(({ request }) =>
      request?.forEach(({ command, targets }) => {
        for (const id of targets) {
          acc[id] = {
            ...acc[id],
            ...toLightStateFromCommand(acc[id], command),
          };
        }
      }),
    );

    oldest.forEach(state => {
      state.type === 'resolved' &&
        state.data.forEach(v =>
          v.results.forEach(v => {
            acc[v.id] = {
              ...acc[v.id],
              ...v.state,
            };
          }),
        );
    });

    return acc;
  }, [allLights, history]);

  return (
    <>
      <Head>
        <title>👻</title>
      </Head>
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        alignItems="center"
        justifyContent="flex-start"
        flexDirection="column"
        overflowX="hidden"
      >
        {allLights?.type === 'resolved' ? (
          <Box
            display="flex"
            flex="0 1 1"
            flexFlow="row wrap"
            gridGap="2rem"
            p="2rem"
          >
            {allLights?.data?.map(({ light, bridge }) => (
              <LightBox
                key={light.id}
                light={light}
                bridge={bridge}
                state={{ ...light.state, ...stateMap[light.id] }}
                onChange={command => pushState([command])}
              />
            ))}
          </Box>
        ) : //
        // on failed start
        allLights?.type === 'rejected' ? (
          <Box p="2rem">
            <Heading mb="1rem">Something went wrong</Heading>
            <Text as="code" mb="1rem">
              {allLights?.error?.message ?? JSON.stringify(allLights?.error)}
            </Text>
          </Box>
        ) : (
          <></>
        )}
      </Box>
    </>
  );
};

const LightBox: VoidFunctionComponent<
  AllLightsResult[number] & {
    state: LightState;
    onChange: (command: UseLightStateProps[number]) => unknown;
  }
> = ({ light: { id, name }, bridge, state, onChange }) => {
  return (
    <Box
      flex="1 1 auto"
      key={id}
      onClick={() => {
        onChange({
          targets: [id].filter(v => v != null),
          command: { on: !state.on },
        });
      }}
    >
      <Box
        display="flex"
        flexFlow="column nowrap"
        justifyContent="flex-end"
        gridRowGap=".25rem"
        boxShadow={'0 0 0 0.125rem ' + rgbForLightState(state)}
        minWidth="16rem"
        minHeight="8rem"
        p="1rem"
        borderRadius=".625rem"
      >
        <Text fontSize="0.75rem" fontWeight="500">
          {bridge.name}
        </Text>
        <Box flex={1} />
        <Text
          fontSize="0.75rem"
          fontWeight="900"
          color={state.on ? 'pink' : 'gray'}
        >
          {state.on ? 'ON' : 'OFF'}
        </Text>

        <Text>{name}</Text>
      </Box>
    </Box>
  );
};

function mergeState(
  source: { id: string | number; state: any },
  response?: UseLightStateResponse,
) {
  const flattered = (response?.data ?? [])
    ?.map(v => v.results.filter(res => source.id === res.id))
    ?.map(v => v.map(v => v.state))
    ?.flat(2);

  return Object.assign({}, source.state, ...flattered);
}

function rgbForLightState(state: {
  on: boolean;
  xy: [number, number];
  bri: number;
}) {
  const { r, g, b } = ColorConverter.xyBriToRgb(...state.xy, state.bri);

  return `rgba(${r}, ${g}, ${b}, ${state.on ? 1 : 0.5})`;
}

export default Lights;
