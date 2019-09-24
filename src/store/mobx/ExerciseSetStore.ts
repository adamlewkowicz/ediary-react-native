import { EntityStore_, EntityWatcher } from './ExerciseStore';
import { ExerciseSet } from '../../database/entities';
import { computed, observable } from 'mobx';
import { ExerciseSetId } from '../../types';

export class ExerciseSetStore extends EntityStore_<ExerciseSet> {
  readonly id!: ExerciseSetId;
  entity!: ExerciseSet;
  @observable loadWeight!: number;

  constructor(entity: ExerciseSet) {
    super();
  }

  @computed get entityWatcher(): EntityWatcher<ExerciseSet> {
    return {
      loadWeight: this.entity.loadWeight
    }
  }
}