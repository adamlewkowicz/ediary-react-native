import React from 'react';
import { SelectionBox } from '../SelectionBox';
import { SvgProps } from 'react-native-svg';

interface SelectionOptionsProps<T> {
  options: SelectionOption<T>[]
  value: T
  onChange: (value: T) => void
}

export function SelectionOptions<T>(
  props: SelectionOptionsProps<T>
) {
  const renderOptions = props.options.map(option => {
    const isActive = option.value === props.value;

    return (
      <SelectionBox
        key={option.title}
        value={isActive}
        onChange={() => props.onChange(option.value)}
        title={option.title}
        description={option.description}
        Icon={option.Icon}
      />
    );
  });

  return (
    <>
      {renderOptions}
    </>
  );
}

interface SelectionOption<T> {
  value: T
  title: string
  description?: string
  Icon?: (props: SvgProps) => JSX.Element
}