import React from 'react';
import { SelectionBox } from '../SelectionBox';
import { theme } from '../../common/theme';
import { SvgProps } from 'react-native-svg';

interface SelectionOptionsProps<V, T extends SelectionOption<V>> {
  options: T[]
  value: V
  onChange: (value: V) => void
}

export function SelectionOptions<V, T extends SelectionOption<V>>(
  props: SelectionOptionsProps<V, T>
) {
  const renderOptions = props.options.map(option => {
    const isActive = option.value === props.value;
    const iconFill = isActive ? theme.color.focus : 'rgba(1,1,1,.7)';
    const svgProps: SvgProps = { fill: iconFill };

    return (
      <SelectionBox
        key={option.title}
        value={isActive}
        onChange={() => props.onChange(option.value)}
        title={option.title}
        description={option.description}
        icon={option.renderIcon(isActive, svgProps)}
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
  renderIcon: (isActive: boolean, svgProps: SvgProps) => JSX.Element
}