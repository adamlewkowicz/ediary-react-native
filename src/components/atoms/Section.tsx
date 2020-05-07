import styled from 'styled-components/native';
import React, { ReactNode } from 'react';
import { H2, H3 } from './index';

interface SectionProps {
  title: string
  description?: string
  children: ReactNode
}

export const Section = (props: SectionProps) => (
  <Container>
    <Title isDescription={props.description != null}>
      {props.title}
    </Title>
    {props.description && (
      <Description>{props.description}</Description>
    )}
    {props.children}
  </Container>
);

const Container = styled.View`
  margin: ${props => props.theme.spacing.baseVertical};
`

const Title = styled(H2)<{
  isDescription: boolean
}>`
  margin-bottom: ${props => props.isDescription ? 0 : props.theme.spacing.small};
`

const Description = styled(H3)`
  margin-bottom: ${props => props.theme.spacing.small};
`