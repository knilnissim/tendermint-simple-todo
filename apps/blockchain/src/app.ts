import * as path from 'path';
// must be called before lotion import
require('dotenv').config({ path: path.resolve(__dirname, '../.env-node') });

import * as lotion from 'lotion';
import initialState from './state';
import txMiddleware from './txMiddleware';

const genesis = path.resolve(__dirname, '../genesis.json');
const keys = path.resolve(__dirname, '../priv_validator.json');

async function startup() {
  const app = lotion({ genesis, keys, initialState, devMode: true, logTendermint: true });
  app.use([txMiddleware]);
  const appInfo = await app.listen(process.env.TX_SERVER_PORT);
  console.log('AppInfo', JSON.stringify(appInfo, null, 2));
}

startup();
