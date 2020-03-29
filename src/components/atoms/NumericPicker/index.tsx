import React from 'react';
import { Picker } from '@react-native-community/picker';
import { PickerProps } from '@react-native-community/picker/typings/Picker';
import styled from 'styled-components/native';

interface NumericPickerProps<T> extends PickerProps {
  value: T
  onChange: (value: T) => void
  options: T[]
  renderOptionLabel: (value: T) => string
}

export function NumericPicker <T extends number>(props: NumericPickerProps<T>) {
  const {
    onChange,
    renderOptionLabel,
    ...pickerProps
  } = props;

  return (
    <StyledPicker
      selectedValue={props.value}
      onValueChange={value => onChange(value as T)}
      {...pickerProps}
    >
      {props.options.map(value => 
        <Picker.Item
          label={renderOptionLabel(value)}
          value={value}
          key={value}
        />
      )}
    </StyledPicker>
  );
}

const StyledPicker = styled(Picker)`
  background-color: rgba(1,1,1,.03);
  margin-bottom: 35px;
  color: ${props => props.theme.color.focus};
`