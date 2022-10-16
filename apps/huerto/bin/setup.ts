#! /usr/bin/env yarn ts-node
import * as fs from 'fs/promises';
import prompts from 'prompts';
import * as idiots from '@bffr/node-hue-api';
import * as pkg from '../package.json';
import { prom } from '../common';

type Bridge = Awaited<ReturnType<typeof idiots.discovery.nupnpSearch>>[number];

require.main === module && main();
async function main() {
  const allBridges = await idiots.discovery.nupnpSearch();
  const selections = await prompts([
    {
      name: 'username',
      type: 'text',
      message: `What do we call this connection?`,
      initial: 'toby',
    },
    {
      name: 'included',
      type: 'multiselect',
      message: (_, values) => `Will ${values.username} include all bridges?`,
      choices: allBridges.map(bridge => ({
        title: bridge.config?.name ?? bridge.ipaddress,
        value: bridge.ipaddress,
        selected: true,
      })),
      hint: '- Space to select. Return to submit',
    },
  ]);
  const included = ((selections.included as string[]) ?? []).map(
    (ip: string) => allBridges.find(v => ip === v.ipaddress) as Bridge,
  );

  const [{ pushed }, links] = await prom.follow(
    prompts({
      name: 'pushed',
      type: 'toggle',
      message: `Let's push the buttons on ${selections.included.join(', ')}`,
      active: 'I pushed them!',
      inactive: "I couldn't push them 😔",
    }),
    ref =>
      prom.all(included, async bridge => {
        let error = false;

        while (!ref.current?.pushed || (ref.current?.pushed && !error)) {
          let state = { pushed: ref.current?.pushed };

          try {
            const anonymous = await idiots.api
              .createLocal(bridge.ipaddress)
              .connect();

            const user = await anonymous.users.createUser(
              pkg.name,
              selections.username,
            );

            return { status: 'link:created', bridge, user };
          } catch (e) {
            if (state.pushed) {
              error = true;
            }
            await new Promise(next => setTimeout(next, 500));
          }
        }

        return { status: 'link:failed', bridge, user: null };
      }),
  );

  await fs.writeFile('./links.local.json', JSON.stringify(links, null, 2));

  console.log("You're all done, you can now use huerto");
}
