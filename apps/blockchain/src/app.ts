import * as path from 'path';
import { config as envConfig } from 'dotenv';
import * as lotion from 'lotion';
import initialState from './state';
import txMiddleware from './txMiddleware';

envConfig({ path: path.resolve(__dirname, '../.env-node') });

interface AppInfo {
  tendermintPort: number;
  abciPort: number;
  txServerPort: number;
  GCI: string;
  p2pPort: number;
  lotionPath: string;
  genesisPath: string;
  lite: boolean;
}

async function startup() {
  const app = lotion({
    initialState,
    tendermintPort: process.env.TENDERMINT_PORT,
    logTendermint: true,
  });

  app.use([txMiddleware]);

  const appInfo: AppInfo = await app.listen(process.env.LOTION_APP_PORT);
  console.log(`App listening on port ${process.env.LOTION_APP_PORT}`);
  console.log(appInfo);
}

startup();
