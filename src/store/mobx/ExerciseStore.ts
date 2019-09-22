import { Exercise } from '../../database/entities';
import { ExerciseId, ExerciseSetId, TrainingId } from '../../types';
import { computed, reaction, observable, IReactionDisposer } from 'mobx';

export class ExerciseStore implements EntityStore<Exercise> {
  id!: ExerciseId;
  entity!: Exercise;
  disposeSaveHandler: IReactionDisposer;
  @observable name!: string;
  @observable setIds!: ExerciseSetId[];
  @observable trainingId!: TrainingId;
  @observable duration!: number;

  constructor(entity: Exercise) {
    const { sets = [], ...exercise } = entity;

    // drop relations to lower memory usage
    delete entity.sets;
    delete entity.trainings;

    Object.assign(this, {
      ...exercise,
      setIds: sets.map(set => set.id),
      duration: 0,
      entity,
    });

    this.disposeSaveHandler = reaction(
      () => this.entityWatcher,
      async (entityPayload) => {
        console.log(entityPayload);
        this.entity.name = entityPayload.duration.toString();
        await this.entity.save();
      },
      { delay: 2000 }
    );
  }

  async dispose() {
    this.disposeSaveHandler();
    await this.entity.remove();
  }

  @computed get entityWatcher(): EntityWatcher<Exercise> {
    return {
      name: this.name as any,
      duration: this.duration,
    }
  }
}

interface NormalizedExercise {
  id: ExerciseId
  name: string
  setIds: ExerciseSetId[]
  trainingId: TrainingId
  duration: number
  entity: Exercise
}

type EntityWatcher<Entity> = Partial<{
  [K in keyof Entity]: K
}>

interface EntityStore<Entity> {
  entity: Entity
  entityWatcher: EntityWatcher<Entity>
  disposeSaveHandler: IReactionDisposer
  dispose: () => Promise<void>
}