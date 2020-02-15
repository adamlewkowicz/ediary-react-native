import React from 'react';
import { Picker, PickerProps } from 'react-native'

interface NumericPickerProps<T> extends PickerProps {
  value: T
  onChange: (value: T) => void
  options: T[]
  renderOptionLabel: (value: T) => string
}

export function NumericPicker <T extends number>(props: NumericPickerProps<T>) {
  const {
    style = { height: 50, width: 100 },
    ...pickerProps
  } = props;

  return (
    <Picker
      selectedValue={props.value}
      onValueChange={value => props.onChange(value)}
      style={style}
      {...pickerProps}
    >
      {props.options.map(value => 
        <Picker.Item
          label={props.renderOptionLabel(value)}
          value={value}
          key={value}
        />
      )}
    </Picker>
  );
}