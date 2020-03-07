import React from 'react';
import styled from 'styled-components/native';
import { TextSecondary, TextPrimary } from '../../elements/Text';
import { ProgressBar, ProgressBarProps } from '../ProgressBar';

interface ChartMacroBarProps extends ProgressBarProps {
  title: string
  percentages: number
}

export const ChartMacroBar = (props: ChartMacroBarProps) => {
  const { title, ...progressBarProps } = props;
  return (
    <Container>
      <DetailsContainer>
        <TextSecondary>{title}</TextSecondary>
        <TextPrimary>{progressBarProps.percentages}%</TextPrimary>
      </DetailsContainer>
      <ProgressBar {...progressBarProps}/>
    </Container>
  );
}

const Container = styled.View`
  margin-bottom: ${props => props.theme.spacing.tertiary}px;
`

const DetailsContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
`