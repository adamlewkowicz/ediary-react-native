import { useContext } from 'react';
import { DatabaseContext } from '../../context/Database';

export function useRepositories() {
  const database = useContext(DatabaseContext);
  return database.repositories;
}