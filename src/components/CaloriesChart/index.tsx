import React from 'react';
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
import { useSpring, config, animated } from 'react-spring';
import styled from 'styled-components/native';
import { Theme, themeProps } from '../../common/theme';

interface CaloriesChartProps {
  data: {
    diff: number
    ratio: number
    eaten: number
    needed: number
  }
}
export const CaloriesChart = (props: CaloriesChartProps) => {
  const width = 170;
  const height = 170;
  const thickness = 10;
  const radius = 80;
  const style: any = useSpring({
    from: { value: props.data.ratio },
    to: { value: props.data.ratio },
    delay: 100,
    config: config.wobbly
  });

  return (
    <Container>
      <SvgContainer height={height} width={width}>
        <Defs>
          <LinearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop
              offset="0%"
              stopColor="#C0FDCA"
              stopOpacity="1"
            />
            <Stop
              offset="100%"
              stopColor="#61C4D1"
              stopOpacity="1"
            />
          </LinearGradient>
        </Defs>
        <AnimatedCircle
          cx={width / 2}
          cy={height / 2}
          r={radius}
          fill="none"
          stroke={themeProps.colors.lighterBlue}
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
          strokeDashoffset={style.value.interpolate(...interpolation)}
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

const Eaten = styled.Text<{
  theme: Theme
}>`
  font-family: ${props => props.theme.fontFamily};
  font-size: 36px;
  margin-bottom: 3px;
`

const Needed = styled.Text<{
  theme: Theme
}>`
  font-family: ${props => props.theme.fontFamily};
  color: ${props => props.theme.colors.gray};
`

const interpolation = [
  [1, 100],
  [1000, 430]
];

const AnimatedCircle = animated(Circle);