import React, { ReactText } from 'react';
import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import { useSpring, config, animated } from 'react-spring';

export interface ProgressBarProps {
  percentages: number
  showPercentages?: boolean
  vertical?: boolean
  length?: string
  width?: string
  colors: readonly string[]
  rounded?: boolean
  marginVertical?: number
}

export const ProgressBar = ({
  percentages,
  vertical = false,
  length = '50px',
  width = '5px',
  colors,
  rounded = true,
  marginVertical = 0
}: ProgressBarProps) => {
  let percents = percentages > 100 ? 100 : percentages;
  if (Number.isNaN(percents)) percents = 0;
  const style = useSpring({
    from: { width: percents },
    to: { width: percents },
    delay: 100,
    config: config.wobbly
  });

  return (
    <Container
      vertical={vertical}
      length={length}
      marginVertical={marginVertical}
      rounded={rounded}
    >
      <BackgroundStripe
        vertical={vertical}
        width={width}
      />
      <AnimatedGradientLine
        colors={colors as ReactText[]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        percentages={(percentages > 100 ? 100 : percentages) + '%'}
        vertical={vertical}
        width={width}
        style={style}
      />
    </Container>
  );
}

const Container = styled.View<{
  vertical: boolean
  length: string
  marginVertical: number
  rounded: boolean
}>`
  position: relative;
  height: ${props => props.vertical ? props.length : 'auto'};
  margin: ${props => `${props.marginVertical}px 0`};
  overflow: hidden;
`

const BackgroundStripe = styled.View<{
  vertical: boolean
  width: string
}>`
  background-color: ${props => props.theme.color.blue20};
  height: ${props => props.vertical ? '100%' : props.width};
  width: ${props => props.vertical ? props.width : '100%'};
`

const GradientLine = styled(LinearGradient)<{
  vertical: boolean
  width: string
  percentages: string
}>`
  height: ${props => props.vertical ? props.percentages : props.width};
  min-height: ${props => props.vertical ? '0' : props.width};
  position: absolute;
  width: ${props => props.vertical ? props.width : props.percentages};
  bottom: ${props => props.vertical ? 0 : 'auto'};
`

const AnimatedGradientLine = animated(GradientLine);