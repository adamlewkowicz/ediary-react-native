import React from 'react';
import { TouchableOpacity, TouchableWithoutFeedbackProps } from 'react-native';
import styled from 'styled-components/native';

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
  <Wrapper onPress={onPress}>
    <Container size={size}>
      <Text>{children}</Text>
    </Container>
  </Wrapper>
);

const Wrapper = styled(TouchableOpacity)`
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