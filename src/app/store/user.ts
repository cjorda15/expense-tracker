import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { User } from './user.model';

type UserState = {
  user: User | null;
  state: 'initial' | 'ready';
};

const initialState: UserState = { user: null, state: 'initial' };

export const UserStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    login(user: User) {
      patchState(store, {
        user,
        state: 'ready'
      });
    },
    clear() {
      patchState(store, {
        user: null,
        state: 'ready'
      });
    }
  }))
);
