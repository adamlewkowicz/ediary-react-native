/// <reference lib="dom" />
import { SvgProps } from 'react-native-svg';
import { Theme } from '../common/theme';
import { Coordinate } from 'react-native-maps';

declare global {

  declare module "react-native-swipeable" {
    const content: React.ComponentClass<any, any>
    export default content
  }

  declare module "*.svg" {
    const content: React.ComponentClass<SvgProps, any>
    export default content
  }
  
  declare module "haversine" {
    const haversine: (a: Coordinate, b: Coordinate) => number;
    export default haversine;
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

  declare interface NodeModule {
    hot?: {
      accept(path?: () => void, callback?: () => void): void
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

declare module "react-native" {
  /**
   * Represents the current value of a component.
   * It can be a textual description of a component's value, or for range-based components,
   * such as sliders and progress bars, it contains range information (minimum, current, and maximum). */
  interface AccessibilityProps {
    accessibilityValue?: {
      /** The minimum value of this component's range. */
      min?: number
      /** The maximum value of this component's range. */
      max?: number
      /** The current value of this component's range. */
      now?: number
      /** A textual description of this component's value. Will override min, now, and max if set. */
      text?: number
    }
  }
}

type RequestIdleCallbackHandle = () => void;
type RequestIdleCallbackOptions = { timeout: number }
type RequestIdleCallbackDeadline = {
  readonly didTimeout: boolean;
  timeRemaining: (() => number);
}