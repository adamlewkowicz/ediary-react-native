import React from 'react';
import { TouchableOpacity, TouchableWithoutFeedbackProps, View } from 'react-native';
import styled from 'styled-components/native';
import { _FloatingButton } from '../../common/zIndex';

interface FloatingButtonProps {
  size?: number
  onPress?: TouchableWithoutFeedbackProps['onPress']
  children?: any
}
export const FloatingButton = ({
  size = 50,
  onPress,
  children
}: FloatingButtonProps) => (
  <Wrapper onPress={onPress} zIndex={_FloatingButton}>
    <Container size={size} >
      <Text>{children}</Text>
    </Container>
  </Wrapper>
);

const Wrapper = styled(TouchableOpacity)<{
  zIndex: number
}>`
  z-index: ${props => props.zIndex};
  position: absolute;
  bottom: 20px;
  right: 20px;
`

const Container = styled.View<{
  size: number
}>`
  width: ${props => props.size + 'px'};
  height: ${props => props.size + 'px'};
  background: #58AAD8;
  border-radius: 50;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Text = styled.Text`
  color: #fff;
  font-size: 25px;
`