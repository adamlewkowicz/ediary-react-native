import React, { ReactNode } from 'react';
import styled from 'styled-components/native';
import { Heading } from '../../legacy/Elements';

interface StepContainerProps {
  buttonTitle: string
  lastStepButtonTitle: string
  onSubmit: () => void
  children: ReactNode
}

export const StepContainer = (props: StepContainerProps) => {
  return (

  );
}


export * from './Step';