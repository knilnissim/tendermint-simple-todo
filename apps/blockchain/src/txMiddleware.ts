import { State, Item } from './state';

interface ChainInfo {
  height: number;
  validators: { [pubkey: string]: number }; // voting power distribution for validators
}

export interface Tx<T> {
  sender: string;
  type?: TxType;
  payload?: T;
}

export interface TxTypeToHandler {
  [txType: string]: TxHandler | TxHandler[];
}

export type TxHandler<T = any> = (state: State, tx: Tx<T>, chainInfo?: ChainInfo) => void;

export enum TxType {
  ADD = 'ADD',
  TOGGLE = 'TOGGLE',
}

const add: TxHandler<{ title: string }> = (state, { payload }) => {
  if (!payload || typeof payload.title !== 'string') return;

  const item = { title: payload.title, completed: false, timestamp: Date.now() };
  state.items.push(item);
};

const toggle: TxHandler<{ index: number }> = (state, { payload }) => {
  if (!payload || typeof payload.index !== 'number') return;

  const item = state.items[payload.index];
  item.completed = !item.completed;
};

/**
 * creates txMiddleware which is routing txHandler
 * @param txTypeToHandler plain object of txHandler(s) for txType
 * @param defaultHandler txHandler for unhandled tx
 */
const createTxMiddleware = (txTypeToHandler: TxTypeToHandler, defaultHandler?: TxHandler): TxHandler =>
  (state, tx, chainInfo) => {
    const txType = tx.type;
    const handler = txTypeToHandler[txType] || defaultHandler;
    if (handler) {
      Array.isArray(handler)
        ? handler.forEach(h => h(state, tx, chainInfo))
        : handler(state, tx, chainInfo);
    }
  };

const txMiddleware = createTxMiddleware({
  [TxType.ADD]: add,
  [TxType.TOGGLE]: toggle,
}, (state, tx, chainInfo) => {
  console.log(JSON.stringify({ tx, chainInfo }, null, 2));
  return new Error('no handler for tx');
});

export default txMiddleware;
