import { Omit, DeepPartial } from 'utility-types';

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