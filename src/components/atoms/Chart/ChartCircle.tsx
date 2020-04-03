import React, { ReactNode } from 'react';
import Svg, {
  Circle,
  CircleProps,
} from 'react-native-svg';
import styled from 'styled-components/native';
import { THEME } from '../../../common/theme';
import { SvgGradientDef } from '../Svg';
import * as Utils from '../../../utils';
import { useAnimatedSpring } from '../../../hooks';
import { Animated } from 'react-native';
import { getA11yProgressBarProps } from '../../../utils';

export interface ChartCircleProps {
  percentage: number
  size?: number
  width?: number
  children?: ReactNode
  gradientColors: readonly [string, string]
}

export const ChartCircle = (props: ChartCircleProps) => {
  const { size = 80, width = 5 } = props;
  const percentage = props.percentage > 100 ? 100 : props.percentage;

  const xAxisCenterCoord = Math.floor(size / 2);
  const yAxisCenterCoord = xAxisCenterCoord;

  const radius = Math.floor(size / 2.5);
  const strokeDasharray = Utils.calculateCircleStrokeDasharray(radius, width);

  const genericCircleProps: CircleProps = {
    cx: xAxisCenterCoord,
    cy: yAxisCenterCoord,
    r: radius,
    fill: 'none',
    strokeWidth: width,
  }

  const animatedValue = useAnimatedSpring(percentage);
  const animatedStrokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [strokeDasharray, 0]
  });

  return (
    <Container>
      <SvgContainer
        {...getA11yProgressBarProps(percentage)}
        height={size}
        width={size}
      >
        <SvgGradientDef
          id={GRADIENT_ID}
          colors={props.gradientColors}
        />
        <Circle
          {...genericCircleProps}
          stroke={THEME.color.quinary}
        />
        <AnimatedPercentageCircle
          {...genericCircleProps}
          stroke={`url(#${GRADIENT_ID})`}
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={animatedStrokeDashoffset}
        />
      </SvgContainer>
      <Content>
        {props.children}
      </Content>
    </Container>
  );
}

const GRADIENT_ID = '#ChartCircle';

const SvgContainer = styled(Svg)`
  align-self: center;
  position: relative;
  transform: rotate(-180deg);
`

const Container = styled.View`
  position: relative;
  align-items: center;
  justify-content: center;
`

const Content = styled.View`
  position: absolute;
`

const AnimatedPercentageCircle = Animated.createAnimatedComponent(Circle);