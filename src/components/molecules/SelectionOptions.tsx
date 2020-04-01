import React from 'react';
import { SelectionBox } from '../';
import { SvgProps } from 'react-native-svg';
import { ViewProps, View } from 'react-native';

interface SelectionOptionsProps<T> extends ViewProps {
  options: SelectionOption<T>[]
  value: T
  onChange: (value: T) => void
  optionLabel?: string
}

export function SelectionOptions<T>(
  props: SelectionOptionsProps<T>
) {
  const renderOptions = props.options.map(option => {
    const { value, ...optionProps } = option;
    const isActive = value === props.value;

    return (
      <SelectionBox
        key={option.title}
        isActive={isActive}
        onChange={() => props.onChange(option.value)}
        a11yLabel={props.optionLabel}
        {...optionProps}
      />
    );
  });

  return (
    <View accessibilityRole="radiogroup" style={props.style}>
      {renderOptions}
    </View>
  );
}

interface SelectionOption<T> {
  value: T
  title: string
  description?: string
  Icon?: (props: SvgProps) => JSX.Element
}