import { NativeTestInstance } from '@testing-library/react-native';

expect.extend({
  toBeExpanded(componentInstance: NativeTestInstance) {
    const A11_STATE_PROP = 'accessibilityState';
    const a11yState = componentInstance.getProp(A11_STATE_PROP) as A11YState;

    if (a11yState?.expanded === undefined) {
      return {
        pass: false,
        message: () => 'Accessibility state "expanded" property must be set'
      }
    }

    if (this.isNot) {
      expect(a11yState.expanded).not.toEqual(true);
    } else {
      expect(a11yState.expanded).toEqual(true);
    }

    return { pass: !this.isNot, message: () => 'Failed' };
  }
});

type A11YState = undefined | { expanded?: boolean };

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeExpanded(): R
    }
  }
}