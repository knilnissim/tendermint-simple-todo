import axios from 'axios';

/**
 * client for Todo blochchain app
 * `lotion-connect` module could be subsituterd for this functionality later
 */
class LotionClient {
  url: string;

  constructor(url = 'http://localhost:3000') {
    this.url = url;
  }

  getState = async () => {
    const { data } = await axios.get(`${this.url}/state`);
    return data;
  }

  sendTx = async (type: string, payload: any) => {
    const { data } = await axios.post(`${this.url}/txs`, { type, payload });
    return data;
  }

}

export default LotionClient;
