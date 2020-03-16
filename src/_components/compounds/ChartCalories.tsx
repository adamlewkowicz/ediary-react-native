import React from 'react';
import styled from 'styled-components/native';
import { ChartCircle } from '../molecules/_index';
import { theme } from '../../common/theme';
import { H1, TextTertiary } from '../atoms/Text';
import { View } from 'react-native';

interface ChartCaloriesProps {
  percentages: number
  value: number
  valueLeft: number
}

export const ChartCalories = (props: ChartCaloriesProps) => {
  return (
    <ChartCircle 
      percentages={props.percentages}
      size={200}
      width={8}
      gradientColors={theme.gradient.kcal}
    >
      <Content>
        <CaloriesEaten>{props.value}</CaloriesEaten>
        <TextTertiary>
          z {props.valueLeft} kalorii
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