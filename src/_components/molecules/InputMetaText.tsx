import React from 'react';
import { Input, InputProps } from '../';
import styled from 'styled-components/native';

interface InputMetaTextProps extends InputProps {
  metaText: string
}

export const InputMetaText = (props: InputMetaTextProps) => {
  const {
    metaText,
    ...inputProps
  } = props;

  return (
    <Input
      {...inputProps}
      rightContent={<MetaText>{metaText}</MetaText>}
    />
  );
}

const MetaText = styled.Text`
  position: absolute;
  right: 0;
  color: ${props => props.theme.color.secondary};
`