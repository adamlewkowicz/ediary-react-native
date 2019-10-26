import { Coordinate } from 'react-native-maps';

declare module "sql-formatter" {
  const main: Formatter;
  interface Formatter {
    format(sql: string): string
  }
  export default main
}

declare module "haversine" {
  const haversine: (a: Coordinate, b: Coordinate) => number;
  export default haversine;
}