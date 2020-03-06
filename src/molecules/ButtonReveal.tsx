import React from 'react';
import styled from 'styled-components/native';
import { RightArrowIcon } from '../components/Icons';
import { theme } from '../common/theme';
import { TouchableOpacityProps } from 'react-native';

interface ButtonRevealProps extends TouchableOpacityProps {}

export const ButtonReveal = (props: ButtonRevealProps) => {
  return (
    <Container {...props}>
      <InnerCircle>
        <ArrowIcon {...ICON_STYLE} />
      </InnerCircle>
    </Container>
  );
}

const Container = styled.TouchableOpacity`
  background-color: #F4F7FF;
  border-radius: 50;
  padding: 10px;
  width: 50px;
  height: 50px;
  align-self: center;
  margin: 10px 0;
`

const InnerCircle = styled.View`
  background-color: #fff;
  border-radius: 50;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
`

const ArrowIcon = styled(RightArrowIcon)`
  transform: rotate(-90deg);
`

const ICON_STYLE = {
  width: 16,
  height: 16,
  fill: theme.color.highlight,
} as const;