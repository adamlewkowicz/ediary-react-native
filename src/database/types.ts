import { Omit, DeepPartial } from 'utility-types';
import { EntityWatcher } from '../store/mobx/ExerciseStore';
import { BaseEntity } from 'typeorm';
import { IReactionDisposer } from 'mobx';

export type EntityType<E, K extends keyof E = never> = Omit<E,
  | 'hasId'
  | 'save'
  | 'remove'
  | 'reload'
  | 'validate'
  | & K
>;

export type EntityRequired<
  E extends EntityType<E>,
  K extends keyof E
> = DeepPartial<E> & Pick<E, K>;

export interface EntityStore<Entity extends BaseEntity> {
  disposeSaveHandler: IReactionDisposer;
  dispose(): void;
  drop: Promise<Entity>;
  entityWatcher: EntityWatcher<Entity>;
}