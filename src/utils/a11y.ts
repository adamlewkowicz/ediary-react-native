import { AccessibilityProps } from 'react-native';

export const getA11yProgressBarProps = (percentage: number): AccessibilityProps => ({
  accessibilityRole: 'progressbar',
  accessibilityValue: {
    min: 0,
    max: 100,
    now: percentage
  }
});