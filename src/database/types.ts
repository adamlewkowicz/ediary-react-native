import { Omit } from 'yargs';

export type EntityType<E> = Omit<E, 'hasId' | 'save' | 'remove' | 'reload'>;