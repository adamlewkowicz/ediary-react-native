import React from 'react';
import styled from 'styled-components/native';
import { TextPrimary, TextTertiary } from '../Text';
import { ChartProgressBar, ChartProgressBarProps } from './ChartProgressBar';

interface ChartMacroBarProps extends ChartProgressBarProps {
  title: string
  percentage: number
}

export const ChartMacroBar = (props: ChartMacroBarProps) => {
  const { title, ...progressBarProps } = props;
  return (
    <Container>
      <Details>
        <TextTertiary>{title}</TextTertiary>
        <TextPrimary>{progressBarProps.percentage}%</TextPrimary>
      </Details>
      <ChartProgressBar {...progressBarProps} />
    </Container>
  );
}

const Container = styled.View`
  margin-bottom: ${props => props.theme.spacingPX.small};
`

const Details = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacingPX.tiny};
`