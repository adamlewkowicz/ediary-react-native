import styled from 'styled-components/native';
import { H2, H3 } from './Text';
import React, { ReactNode } from 'react';

interface SectionProps {
  title: string
  description?: string
  children: ReactNode
}

export const Section = (props: SectionProps) => {
  return (
    <Container>
      <H2>{props.title}</H2>
      {props.description && <H3>{props.description}</H3>}
      {props.children}
    </Container>
  );
}

const Container = styled.View`
  padding: 10px 0;
`