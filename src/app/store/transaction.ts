import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Transaction } from './transaction.model';
import { mockTransactions } from './mock_transactions';
type TransactionState = {
  transactions: Transaction[];
  state: 'initial' | 'loading' | 'ready' | 'error';
};

const transactions: Transaction[] = mockTransactions as Transaction[];

const initialState: TransactionState = {
  transactions,
  state: 'initial'
};

export const TransactionStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    setTransaction(transactions: Transaction[]) {
      patchState(store, {
        transactions,
        state: 'ready'
      });
    },

    addTransaction(transaction: Transaction) {
      patchState(store, {
        transactions: [transaction, ...store.transactions()],
        state: 'ready'
      });
    },
    removeTransaction(id: number) {
      patchState(store, {
        transactions: store.transactions().filter((t) => t.id !== id)
      });
    }
  }))
);
