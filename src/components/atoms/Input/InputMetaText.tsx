import React from 'react';
import { InputRef, InputProps } from '../..';
import styled from 'styled-components/native';
import { TextInput } from 'react-native';

interface InputMetaTextProps extends InputProps {
  metaText: string
}

export const InputMetaText = (props: InputMetaTextProps) => {
  const {
    metaText,
    forwardedRef,
    ...inputProps
  } = props;

  return (
    <InputRef
      {...inputProps}
      ref={forwardedRef}
      rightContent={<MetaText>{metaText}</MetaText>}
    />
  );
}

export const InputMetaTextRef = React.forwardRef<TextInput, InputMetaTextProps>(
  (props, ref) => <InputMetaText {...props} forwardedRef={ref as any} />
);

const MetaText = styled.Text`
  position: absolute;
  right: 0px;
  color: ${props => props.theme.color.secondary};
`