import { SvgProps } from 'react-native-svg';

declare global {
  declare module "react-native-swipeable" {
    const content: React.ComponentClass<any, any>
    export default content
  }
  declare module "*.svg" {
    const content: React.ComponentClass<SvgProps, any>
    export default content
  }
}