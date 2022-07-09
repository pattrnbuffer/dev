'use strict';

const hueApi = require('../../../dist/cjs');
// If using this code outside of this library the above should be replaced with
// const hueApi = require('node-hue-api');

const v3 = hueApi.v3
  , discovery = hueApi.discovery
;

// Replace this with your username for accessing the bridge
const USERNAME = require('../../../test/support/testValues').username;

//
// This code will obtain all the ResourceLinks from the bridge and display them on the console

discovery.nupnpSearch()
  .then(searchResults => {
    const host = searchResults[0].ipaddress;
    return v3.api.createLocal(host).connect(USERNAME);
  })
  .then(api => {
    return api.resourceLinks.getAll();
  })
  .then(resourceLinks => {
    resourceLinks.forEach(resourceLink => {
      console.log(`${resourceLink.toStringDetailed()}`);
    })
  })
  .catch(err => {
    console.error(`Unexpected Error: ${err.message}`);
  })
;
