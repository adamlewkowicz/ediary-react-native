import React from 'react';
import styled from 'styled-components/native';
import { TextTertiary, H2 } from '.';

interface TextSplitProps {
  primary: string | number
  secondary: string | number
}

export const TextSplit = (props: TextSplitProps) => {
  return (
    <Container>
      <Primary>{props.primary}</Primary>
      <TextTertiary> / {props.secondary}</TextTertiary>
    </Container>
  );
}

const Container = styled.View`
  flex-direction: row;
  align-items: flex-end;
  margin: 2px 0;
`

const Primary = styled(H2)`
  bottom: -2px;
`