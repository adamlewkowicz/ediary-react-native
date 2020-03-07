import React, { ReactNode } from 'react';
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
import { useSpring, animated } from 'react-spring';
import styled from 'styled-components/native';
import { theme } from '../../common/theme';

export interface CircleChartProps {
  percentages: number
  width?: number
  height?: number
  children?: ReactNode
  gradientColors: readonly [string, string]
}

export const CircleChart = (props: CircleChartProps) => {
  const {
    width = SETTINGS.size,
    height = SETTINGS.size,
    gradientColors,
  } = props;

  const percentages = props.percentages > 100 ? 100 : props.percentages;

  const ratioSpring: any = useSpring({
    from: { value: percentages },
    to: { value: percentages },
    delay: 100,
    config: {
      tension: 140,
      friction: 18,
    }
  });

  const CX = width / 2;
  const CY = height / 2;

  return (
    <Container>
      <SvgContainer height={height} width={width}>
        <Defs>
          <LinearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop
              offset="0%"
              stopColor={gradientColors[0]}
              stopOpacity="1"
            />
            <Stop
              offset="100%"
              stopColor={gradientColors[1]}
              stopOpacity="1"
            />
          </LinearGradient>
        </Defs>
        <AnimatedCircle
          cx={CX}
          cy={CY}
          r={SETTINGS.radius}
          fill="none"
          stroke={theme.colors.quaternary}
          strokeWidth={SETTINGS.thickness}
        />
        <AnimatedCircle
          cx={CX}
          cy={CY}
          r={SETTINGS.radius}
          fill="none"
          stroke="url(#grad1)"
          strokeWidth={SETTINGS.thickness}
          strokeDasharray="1000"
          strokeDashoffset={ratioSpring.value.interpolate(...SETTINGS.interpolation)}
          strokeLinecap="round"
        />
      </SvgContainer>
      <Content>
        {props.children}
      </Content>
    </Container>
  );
}

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

const SETTINGS = {
  size: 80,
  thickness: 5,
  radius: 35,
  interpolation: [
    [1, 100],
    [1000, 495]
  ]
} as const;

const AnimatedCircle = animated(Circle);