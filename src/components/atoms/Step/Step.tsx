import React, { ReactNode } from 'react';
import styled from 'styled-components/native';

interface StepProps {
  title: string
  children: ReactNode
}

export const Step = (props: StepProps) => {
  return (
    <Container>
      
    </Container>
  );
}

const Container = styled.View`
  padding: 10px;
  justify-content: space-between;
  flex: 1;
`