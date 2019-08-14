import { Omit } from 'utility-types';

export type EntityType<E> = Omit<E, 'hasId' | 'save' | 'remove' | 'reload'>;