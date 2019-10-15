import React from 'react';
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
import { useSpring, animated } from 'react-spring';
import styled from 'styled-components/native';
import { theme } from '../../common/theme';

interface CaloriesChartProps {
  data: {
    diff: number
    ratio: number
    eaten: number
    needed: number
  }
}

export const CaloriesChart = (props: CaloriesChartProps) => {
  const ratio = props.data.ratio > 100 ? 100 : props.data.ratio;
  const ratioSpring: any = useSpring({
    from: { value: ratio },
    to: { value: ratio },
    delay: 100,
    config: {
      tension: 140,
      friction: 18,
    }
  });
  const width = 170;
  const height = 170;
  const thickness = 10;
  const radius = 80;

  return (
    <Container>
      <SvgContainer height={height} width={width}>
        <Defs>
          <LinearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop
              offset="0%"
              stopColor={theme.gradient.kcal[0]}
              stopOpacity="1"
            />
            <Stop
              offset="100%"
              stopColor={theme.gradient.kcal[1]}
              stopOpacity="1"
            />
          </LinearGradient>
        </Defs>
        <AnimatedCircle
          cx={width / 2}
          cy={height / 2}
          r={radius}
          fill="none"
          stroke={theme.colors.blue10}
          strokeWidth={thickness}
        />
        <AnimatedCircle
          cx={width / 2}
          cy={height / 2}
          r={radius}
          fill="none"
          stroke="url(#grad1)"
          strokeWidth={thickness}
          strokeDasharray="1000"
          strokeDashoffset={ratioSpring.value.interpolate(...interpolation)}
          strokeLinecap="round"
        />
      </SvgContainer>
      <Info>
        <Eaten>{props.data.eaten}</Eaten>
        <Needed>z {props.data.needed} kalorii</Needed>
      </Info>
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
  margin-bottom: 20px;
`

const Info = styled.View`
  align-items: center;
  align-self: center;
  position: absolute;
  top: 50px;
  margin: 0 auto;
`

const Eaten = styled.Text`
  font-family: ${props => props.theme.fontWeight.regular};
  font-size: 36px;
  margin-bottom: 3px;
`

const Needed = styled.Text`
  font-family: ${props => props.theme.fontWeight.regular};
  color: ${props => props.theme.colors.gray};
`

const interpolation = [
  [1, 100],
  [1000, 495]
];

const AnimatedCircle = animated(Circle);