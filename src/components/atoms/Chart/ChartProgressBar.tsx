import React from 'react';
import styled from 'styled-components/native';
import { SvgGradientDef } from '../Svg';
import Svg, { Rect } from 'react-native-svg';
import { useSpring, config, animated } from 'react-spring';

export interface ChartProgressBarProps {
  percentage: number
  height?: number
  gradientColors: readonly [string, string]
}

export const ChartProgressBar = (props: ChartProgressBarProps) => {
  const percentage = props.percentage > 100 ? 100 : props.percentage;
  const { height = 5 } = props;

  const springProps: any = useSpring({
    from: { percentage },
    to: { percentage },
    delay: 100,
    config: config.wobbly
  });

  return (
    <Container>
      <SvgContainer
        width="100%"
        height={height}
      >
        <SvgGradientDef
          id={GRADIENT_ID}
          colors={props.gradientColors}
        />
        <BarAnimated
          width={springProps.percentage.interpolate((v: number) => v + '%')}
          height={height}
          fill={`url(#${GRADIENT_ID})`}
        />
      </SvgContainer>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
`

const GRADIENT_ID = '#ChartProgressBar';

const SvgContainer = styled(Svg)`
  background-color: ${props => props.theme.color.quinary};
`

const BarAnimated = animated(Rect);