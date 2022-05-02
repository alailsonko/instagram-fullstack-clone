import { PersistStorage, recoilPersist } from 'recoil-persist';

type PersistAtom = {
  key: string | undefined;
  storage: PersistStorage | undefined;
};

export const persistAtomConfig = ({ key = undefined, storage = undefined }: PersistAtom) =>
  recoilPersist({
    key,
    storage
  });
