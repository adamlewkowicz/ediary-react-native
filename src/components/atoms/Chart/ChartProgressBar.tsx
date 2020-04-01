import React from 'react';
import styled from 'styled-components/native';
import { SvgGradientDef } from '../Svg';
import Svg, { Rect } from 'react-native-svg';
import { Animated } from 'react-native';
import { useAnimatedSpring } from '../../../hooks';
import { getA11yProgressBarProps } from '../../../utils';

export interface ChartProgressBarProps {
  percentage: number
  height?: number
  gradientColors: readonly [string, string]
}

export const ChartProgressBar = ({ height = 5, ...props }: ChartProgressBarProps) => {
  const percentage = props.percentage > 100 ? 100 : props.percentage;
  const animatedValue = useAnimatedSpring(percentage);

  const animatedWidth = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%']
  });

  return (
    <Container {...getA11yProgressBarProps(props.percentage)}>
      <SvgContainer
        width="100%"
        height={height}
      >
        <SvgGradientDef
          id={GRADIENT_ID}
          colors={props.gradientColors}
        />
        <BarAnimated
          width={animatedWidth}
          height={height}
          fill={`url(#${GRADIENT_ID})`}
        />
      </SvgContainer>
    </Container>
  );
}

const Container = styled.TouchableOpacity`
  flex: 1;
`

const GRADIENT_ID = '#ChartProgressBar';

const SvgContainer = styled(Svg)`
  background-color: ${props => props.theme.color.quinary};
`

const BarAnimated = Animated.createAnimatedComponent(Rect);