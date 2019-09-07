import { SvgProps } from 'react-native-svg';
import { Theme } from './common/theme';

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

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}