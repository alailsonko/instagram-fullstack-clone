import { persistAtomConfig } from 'infra/services/persistAtomConfig/persistAtomConfig';
import { atom } from 'recoil';

const { persistAtom } = persistAtomConfig({
  key: 'token',
  storage: localStorage
});

export const authPersist = atom({
  key: 'auth',
  default: null,
  effects: [persistAtom]
});
