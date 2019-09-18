import { TrainingStore } from './training';
import { configure } from 'mobx';

// configure({ enforceActions: 'observed' });

export class RootStore {

  training: TrainingStore;

  constructor() {
    this.training = new TrainingStore(this);
  }
}

export const rootStore = new RootStore;