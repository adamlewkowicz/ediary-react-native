import { TrainingStore } from './training';
import { configure, observable } from 'mobx';
import mobxRemotedev from 'mobx-remotedev';

configure({ enforceActions: 'observed' });

@mobxRemotedev({
  name: 'MobX',
  global: true,
  filters: {
    blacklist: ['trainingDurationTickHandle']
  }
})
export class RootStore {
  // workaround for remotedev debugger
  @observable _remoteDev = true;

  training: TrainingStore;

  constructor() {
    this.training = new TrainingStore();
  }
}

export const rootStore = new RootStore;