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

declare module "typeorm" {
  /**
  * Composite unique constraint must be set on entity classes and must specify entity's fields to be unique.
  */
  export declare function Unique<Entity>(name: string, fields: (keyof Entity)[]): Function;
  /**
   * Composite unique constraint must be set on entity classes and must specify entity's fields to be unique.
   */
  export declare function Unique<Entity>(fields: (keyof Entity)[]): Function;
  /**
   * Composite unique constraint must be set on entity classes and must specify entity's fields to be unique.
   */
  export declare function Unique<Entity>(
    fields: (object?: any) => ((keyof Entity)[] | {
      [key in keyof Entity]?: number;
    })
  ): Function;
  /**
   * Composite unique constraint must be set on entity classes and must specify entity's fields to be unique.
   */
  export declare function Unique<Entity>(
    name: string,
    fields: (object?: any) => ((keyof Entity)[] | {
      [key in keyof Entity]?: number;
    })
  ): Function;
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