import React, { ReactNode } from 'react';
import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';

interface ProgressBarProps {
  percentages: number
  showPercentages?: boolean
  vertical?: boolean
  length?: string
  width?: string
  children?: ReactNode
  renderContent?: any
  colors: string[]
  rounded?: boolean
}
export const ProgressBar = ({
  percentages,
  vertical = false,
  length = '50px',
  width = '20px',
  colors,
  rounded = true,
}: ProgressBarProps) => {
  return (
    <Container
      vertical={vertical}
      length={length}
    >
      <BackgroundStripe
        vertical={vertical}
        width={width}
        rounded={rounded}
      />
      <GradientLine
        rounded={rounded}
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        percentages={(percentages > 100 ? 100 : percentages) + '%'}
        vertical={vertical}
        width={width}
      />
    </Container>
  );
}

const Container = styled.View<{
  vertical: boolean
  length: string
}>`
  position: relative;
  height: ${props => props.vertical ? props.length : 'auto'};
`

const BackgroundStripe = styled.View<{
  vertical: boolean
  width: string
  rounded: boolean
}>`
  background-color: #EBF8FE;
  border-radius: ${props => props.rounded ? '50px' : '0px'};
  height: ${props => props.vertical ? '100%' : props.width};
  width: ${props => props.vertical ? props.width : '100%'};
`

const GradientLine = styled(LinearGradient)<{
  vertical: boolean
  width: string
  percentages: string
  rounded: boolean
}>`
  height: ${props => props.vertical ? props.percentages : props.width};
  border-radius: ${props => props.rounded ? '50px' : '0px'};
  min-height: ${props => props.vertical ? '0' : props.width};
  position: absolute;
  width: ${props => props.vertical ? props.width : props.percentages};
  bottom: ${props => props.vertical ? 0 : 'auto'};
`