import { useContext } from 'react';
import { DatabaseContext } from '../../context/database';

export function useRepositories() {
  const database = useContext(DatabaseContext);
  return database.repositories;
}