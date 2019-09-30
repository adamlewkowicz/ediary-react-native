import { Training, Exercise, ExerciseSet } from '../../database/entities';
import { observable, reaction, IReactionDisposer, action, computed } from 'mobx';
import { BaseEntity, DeepPartial } from 'typeorm';
import { ExerciseSetId } from '../../types';

abstract class EntityStore<Entity extends BaseEntity> {
  @observable protected entity: Entity;
  protected disposeSaveHandler: IReactionDisposer;

  constructor(entity: Entity) {
    this.entity = entity;
    this.disposeSaveHandler = reaction(
      () => this.entity,
      (entity) => entity.save(),
      {
        name: entity.constructor.name,
        fireImmediately: false,
        delay: 500,
      }
    );
  }

  dispose() {
    this.disposeSaveHandler();
  }

  async remove() {
    this.dispose();
    await this.entity.remove();
  }
}

class ExerciseSetStore extends EntityStore<ExerciseSet> {}

class ExerciseStore extends EntityStore<Exercise> {
  @observable exerciseSets: Map<ExerciseSetId, ExerciseSetStore>;

  constructor(entity: Exercise) {
    super(entity);
    const { sets = [] } = entity;
    this.exerciseSets = new Map(
      sets.map(set => [set.id, new ExerciseSetStore(set)])
    );
  }

  @action async addExerciseSet(payload: DeepPartial<ExerciseSet>) {
    const exerciseSet = await ExerciseSet.save(payload);
    this.exerciseSets.set(
      exerciseSet.id,
      new ExerciseSetStore(exerciseSet)
    );
  }

  @action async removeExerciseSet(exerciseSetId: ExerciseSetId) {
    const exerciseSetStore = this.exerciseSets.get(exerciseSetId);
    if (exerciseSetStore) {
      await exerciseSetStore.remove();
      this.exerciseSets.delete(exerciseSetId);
    }
  }

  dispose() {
    super.dispose();
    this.exerciseSets.forEach(exerciseSetStore => {
      exerciseSetStore.dispose();
    });
  }

  @computed get exerciseSetsArray() {
    return [...this.exerciseSets.values()];
  }
}

export class TrainingStore {
  @observable entity: Training;
  @observable state = {
    duration: 0,
    isActive: false,
  };
  @observable exercises: ExerciseStore[] = [];
  private disposeSaveHandler: IReactionDisposer;

  constructor(entity: Training) {
    this.entity = entity;
    this.disposeSaveHandler = reaction(
      () => this.entity,
      async () => {
        await this.entity.save();
      }
    );
  }

  dispose() {
    this.disposeSaveHandler();
    this.exercises.forEach(exerciseStore => exerciseStore.dispose());
  }

  @action removeExercise() {
    this.exercises[0].remove();
  }

  async remove() {
    this.dispose();
    await this.entity.remove();
  }

}