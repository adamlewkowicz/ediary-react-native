import React from 'react';
import styled from 'styled-components/native';
import { ChartCircle } from '../';
import { theme } from '../../common/theme';
import { H1, TextTertiary } from '../';
import { View } from 'react-native';

interface ChartCaloriesProps {
  percentages: number
  value: number
  valueLeft: number
}

export const ChartCalories = (props: ChartCaloriesProps) => {
  return (
    <ChartCircle 
      percentage={props.percentages}
      size={200}
      width={8}
      gradientColors={theme.gradient.kcal}
    >
      <Content>
        <CaloriesEaten>{props.value.toFixed(0)}</CaloriesEaten>
        <TextTertiary>
          z {props.valueLeft.toFixed(0)} kalorii
        </TextTertiary>
      </Content>
    </ChartCircle>
  );
}

const Content = View;

const CaloriesEaten = styled(H1)`
  text-align: center;
  font-size: 25px;
`