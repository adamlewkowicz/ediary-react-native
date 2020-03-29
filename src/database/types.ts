import { Omit, DeepPartial } from 'utility-types';

/** Serializable (non-instance) type of entity. */
export type EntityType<E, K extends keyof E = never> = Omit<E,
  | 'hasId'
  | 'save'
  | 'remove'
  | 'reload'
  | 'validate'
  | & K
>;

/** Entity shape with required fields. */
export type EntityRequired<
  E extends EntityType<E>,
  K extends keyof E
> = DeepPartial<E> & Pick<E, K>;