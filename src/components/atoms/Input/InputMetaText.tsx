import React from 'react';
import { Input, InputProps } from '../..';
import styled from 'styled-components/native';
import { TextInput } from 'react-native';
import { TextSecondary } from '../Text';

interface InputMetaTextProps extends InputProps {
  metaText: string
}

export const InputMetaText = React.forwardRef((
  props: InputMetaTextProps,
  ref: React.Ref<TextInput>
) => {
  const { metaText, ...inputProps } = props;

  return (
    <Input
      {...inputProps}
      ref={ref}
      rightContent={<MetaText>{metaText}</MetaText>}
    />
  );
});

const MetaText = styled(TextSecondary)`
  position: absolute;
  right: 0px;
  color: ${props => props.theme.color.secondary};
`