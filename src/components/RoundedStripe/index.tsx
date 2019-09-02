import React from 'react';
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
import { useSpring, config, animated } from 'react-spring';

interface RoundedStripeProps {
  value: number
}
export const RoundedStripe = (props: RoundedStripeProps) => {
  const { value } = props;
  const style: any = useSpring({
    from: { value },
    to: { value },
    delay: 100,
    config: config.wobbly
  });

  return (
    <Svg height="100" width="100">
      <Defs>
        <LinearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop
            offset="0%"
            stopColor="blue"
            stopOpacity="1"
          />
          <Stop
            offset="100%"
            stopColor="yellow"
            stopOpacity="1"
          />
        </LinearGradient>
      </Defs>
      <AnimatedCircle
        cx="50"
        cy="50"
        r="40"
        fill="white"
        stroke="url(#grad1)"
        strokeWidth={10}
        strokeDasharray={250}
        strokeDashoffset={style.value.interpolate(...interpolation)}
        strokeLinecap="round"
        transform="rotate(180 50 50)"
      />
    </Svg>
  );
}

const interpolation = [
  [0, 0.25, 0.5, 0.75, 1],
  [250, 205, 185, 155, 125]
]

const AnimatedCircle = animated(Circle);