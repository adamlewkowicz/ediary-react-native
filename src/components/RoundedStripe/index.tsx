import React from 'react';
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
import { useSpring, config, animated } from 'react-spring';
import styled from 'styled-components/native';
import { Theme } from '../../common/theme';

interface RoundedStripeProps {
  value: number
  needed: number
  data: {
    diff: number
    ratio: number
    eaten: number
    needed: number
  }
  colors: [string, string]
}
export const RoundedStripe = (props: RoundedStripeProps) => {
  const { value, colors, data } = props;
  const [firstColor, secondColor] = colors;
  const style: any = useSpring({
    from: { value: data.ratio },
    to: { value: data.ratio },
    delay: 100,
    config: config.wobbly
  });
  const width = 200;
  const height = 200;
  const positionFromTop = 82;

  return (
    <Container>
      <Svg height={height} width={width} style={{ alignSelf: 'center', position: 'relative' }}>
        <Defs>
          <LinearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop
              offset="0%"
              stopColor={secondColor}
              stopOpacity="1"
            />
            <Stop
              offset="100%"
              stopColor={firstColor}
              stopOpacity="1"
            />
          </LinearGradient>
        </Defs>
        <AnimatedCircle
          cx={width / 2}
          cy={height / 2}
          r="90"
          fill="white"
          stroke="url(#grad1)"
          strokeWidth="13"
          // 407
          strokeDasharray="407"
          strokeDashoffset={705}
          strokeLinecap="round"
          transform={`rotate(180 ${width / 2} ${positionFromTop})`}
        />
      </Svg>
      <Info>
        <Eaten>{props.data.eaten}</Eaten>
        <Needed>z {props.data.needed} kalorii</Needed>
      </Info>
    </Container>
  );
}

const Container = styled.View`
  position: relative;
  margin-bottom: 20px;
`

const Info = styled.View`
  align-items: center;
  align-self: center;
  position: absolute;
  top: 38px;
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
  [1, 25, 50, 75, 100],
  [249, 205, 185, 155, 125]
];

const AnimatedCircle = animated(Circle);