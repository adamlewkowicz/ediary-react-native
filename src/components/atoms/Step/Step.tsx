import React, { ReactNode, useContext } from 'react';
import styled from 'styled-components/native';
import { H1 } from '../Text';
import { ActiveStepContext } from './StepContainer';
import { ScrollView } from 'react-native-gesture-handler';

interface StepProps {
  title: string
  index: number
  children: ReactNode
}

export const Step = (props: StepProps) => {
  const activeStep = useContext(ActiveStepContext);

  if (activeStep !== props.index) {
    return null;
  }

  return (
    <ScrollView accessibilityRole="tab">
      <Heading>{props.title}</Heading>
      <Content>{props.children}</Content>
    </ScrollView>
  );
}

const Heading = styled(H1)`
  text-align: center;
  margin: 15px 0 25px 0;
`

const Content = styled.ScrollView`
  padding: 10px;
`