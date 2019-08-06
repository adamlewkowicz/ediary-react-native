import { getMetadataArgsStorage } from 'typeorm/browser';

export function SqliteENUM(types: string[] | readonly string[]) {
  return (object: any, propertyName: string) => {

    if (!propertyName) {
      throw new Error(
        `[SqliteENUM] - Column name cannot be unknown`
      );
    }

    const parsedEnum = [...types].map(type => `'${type}'`).join(',');
    const expression = `"${propertyName}" IN (${parsedEnum})`;
    
    getMetadataArgsStorage().checks.push({
      // propertyName,
      target: object.constructor,
      expression
    });
  }
}