declare module "sql-formatter" {
  const main: Formatter;
  interface Formatter {
    format(sql: string): string
  }
  export default main
}

declare module "react-native-dotenv" {
  const BUGSNAG_API_KEY: string;
  
  export { BUGSNAG_API_KEY };
}