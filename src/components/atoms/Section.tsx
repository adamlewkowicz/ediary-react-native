import styled from 'styled-components/native';
import React, { ReactNode } from 'react';
import { H2, H3 } from './index';

interface SectionProps {
  title: string
  description?: string
  children: ReactNode
}

export const Section = (props: SectionProps) => {
  return (
    <Container>
      <Title accessibilityRole="text">
        {props.title}
      </Title>
      {props.description && <H3>{props.description}</H3>}
      {props.children}
    </Container>
  );
}

const Title = styled(H2)`
  margin-bottom: ${props => props.theme.spacingPX.small};
`

const Container = styled.View`
  margin: ${props => props.theme.spacingPX.baseVertical};
`