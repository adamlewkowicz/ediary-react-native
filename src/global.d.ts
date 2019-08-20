declare module "sql-formatter" {
  const main: Formatter;
  interface Formatter {
    format(sql: string): string
  }
  export default main
}