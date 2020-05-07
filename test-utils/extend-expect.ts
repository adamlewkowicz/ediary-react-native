import { NativeTestInstance } from '@testing-library/react-native';

const createA11yStateMatcher = (a11yStatePropName: keyof A11YState) => function(
  this: jest.MatcherUtils,
  componentInstance: NativeTestInstance
) {
  const A11_STATE_PROP = 'accessibilityState';
  const a11yState = componentInstance.getProp(A11_STATE_PROP) as A11YState | undefined;

  if (a11yState?.[a11yStatePropName] === undefined) {
    return {
      pass: false,
      message: () => `Accessibility state "${a11yStatePropName}" property must be set`
    }
  }

  if (this.isNot) {
    expect(a11yState[a11yStatePropName]).not.toEqual(true);
  } else {
    expect(a11yState[a11yStatePropName]).toEqual(true);
  }

  return { pass: !this.isNot, message: () => 'Failed' };
}

expect.extend({
  toBeExpanded: createA11yStateMatcher('expanded'),
  toBeSelected: createA11yStateMatcher('selected'),
  toBeBusy: createA11yStateMatcher('busy'),
});

type A11YState = {
  expanded?: boolean
  selected?: boolean
  busy?: boolean
};

declare global {
  namespace jest {
    interface Matchers<R> {
      /**
       * ```tsx
       * accessibilityState={{ expanded: true }}
       * ```
       */
      toBeExpanded(): R
      /**
       * ```tsx
       * accessibilityState={{ selected: true }}
       * ```
       */
      toBeSelected(): R
      /**
       * ```tsx
       * accessibilityState={{ busy: true }}
       * ```
       */
      toBeBusy(): R
    }
  }
}