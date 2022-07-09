import { Box, Heading, Text } from '@chakra-ui/react';
import { useMountedEffect, useMountedRef } from '@dev/hooks';
import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useMemo } from 'react';
import {
  LightBox,
  LightState,
  toLightStateFromCommand,
  useAllLights,
  useLightState,
} from '~/frontend';

const Lights: NextPage = () => {
  const mounted = useMountedRef();
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
        mounted.guard(() =>
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
                onChange={mounted.guard(command => pushState([command]))}
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

export default Lights;
