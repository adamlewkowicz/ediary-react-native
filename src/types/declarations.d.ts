import { SvgProps } from 'react-native-svg';
import { Theme } from '../common/theme';

declare global {
  declare module "react-native-swipeable" {
    const content: React.ComponentClass<any, any>
    export default content
  }
  declare module "*.svg" {
    const content: React.ComponentClass<SvgProps, any>
    export default content
  }
  declare module NodeJS  {
    interface Global {
      requestIdleCallback: ((
        callback: ((deadline: RequestIdleCallbackDeadline) => void),
        opts?: RequestIdleCallbackOptions,
      ) => RequestIdleCallbackHandle);
      cancelIdleCallback: ((handle: RequestIdleCallbackHandle) => void);
    }
  }
}

declare module "styled-components" {
  export interface DefaultTheme extends Theme {}
}

type RequestIdleCallbackHandle = () => void;
type RequestIdleCallbackOptions = { timeout: number }
type RequestIdleCallbackDeadline = {
  readonly didTimeout: boolean;
  timeRemaining: (() => number);
}