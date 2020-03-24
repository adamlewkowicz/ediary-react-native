import styled from 'styled-components/native';
import React, { ReactNode } from 'react';
import { H2, H3 } from '../atoms/_index';

interface SectionProps {
  title: string
  description?: string
  children: ReactNode
}

export const Section = (props: SectionProps) => {
  return (
    <Container>
      <Title>{props.title}</Title>
      {props.description && <H3>{props.description}</H3>}
      {props.children}
    </Container>
  );
}

const Title = styled(H2)`
  margin-bottom: 10px;
`

const Container = styled.View`
  margin: 20px 0;
`