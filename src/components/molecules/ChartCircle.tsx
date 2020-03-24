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

export interface ChartCircleProps {
  percentages: number
  size?: number
  width?: number
  children?: ReactNode
  gradientColors: readonly [string, string]
}

export const ChartCircle = (props: ChartCircleProps) => {
  const {
    size: SIZE = 80,
    width: WIDTH = 5,
  } = props;
  const [firstColor, secondColor] = props.gradientColors;

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

  const CX = SIZE / 2;
  const CY = CX;
  const RADIUS = SIZE / 2.5;
  
  return (
    <Container>
      <SvgContainer height={SIZE} width={SIZE}>
        <Defs>
          <LinearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop
              offset="0%"
              stopColor={firstColor}
              stopOpacity="1"
            />
            <Stop
              offset="100%"
              stopColor={secondColor}
              stopOpacity="1"
            />
          </LinearGradient>
        </Defs>
        <AnimatedCircle
          cx={CX}
          cy={CY}
          r={RADIUS}
          fill="none"
          stroke={theme.colors.quinary}
          strokeWidth={WIDTH}
        />
        <AnimatedCircle
          cx={CX}
          cy={CY}
          r={RADIUS}
          fill="none"
          stroke="url(#grad1)"
          strokeWidth={WIDTH}
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