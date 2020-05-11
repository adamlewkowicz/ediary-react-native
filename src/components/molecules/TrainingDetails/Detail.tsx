
import React from 'react';
import styled from 'styled-components/native';
import { TextSecondary, H2 } from '../../atoms';

interface DetailProps {
  value: string | number
  title: string
}

export const Detail = (props: DetailProps) => {
  return (
    <Container>
      <H2>{props.value}</H2>
      <TextSecondary>{props.title}</TextSecondary>
    </Container>
  );
}

const Container = styled.View`
  align-items: center;
`