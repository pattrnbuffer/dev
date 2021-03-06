'use strict';

const hueApi = require('../../../dist/cjs');
// If using this code outside of this library the above should be replaced with
// const hueApi = require('node-hue-api');

const v3 = hueApi.v3
  , discovery = hueApi.discovery
;

const USERNAME = require('../../../test/support/testValues').username;

// Set this to the desired Rule ID to delete from the bridge, set arbitrarily high to prevent removing a rule that might exist
const RULE_ID = 9999;

discovery.nupnpSearch()
  .then(searchResults => {
    const host = searchResults[0].ipaddress;
    return v3.api.createLocal(host).connect(USERNAME);
  })
  .then(api => {
    return api.rules.deleteRule(RULE_ID);
  })
  .then(result => {
    console.log(`Rule successfully deleted? ${result}`);
  })
  .catch(err => {
    console.error(`Failed to delete rule ${RULE_ID}`);
    console.error(err.message);
  })
;