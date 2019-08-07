import { SvgProps } from 'react-native-svg';

declare global {
  declare module "*.svg" {
    const content: React.ComponentClass<SvgProps, any>
    export default content
  }
}