import React from 'react';
import styled from 'styled-components/native';
import { TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title?: string
  children?: string
}

export const Button = ({ title, children = title, ...props }: ButtonProps) => (
  <Container {...props}>
    <Title>{children}</Title>
  </Container>
);

const Container = styled.TouchableOpacity`
  background-color: ${props => props.theme.color.focus};
  border-radius: ${props => props.theme.radius.button};
  padding: ${props => props.theme.padding.button};
`

const Title = styled.Text`
  color: ${props => props.theme.color.primaryLight};
  font-family: ${props => props.theme.fontWeight.medium};
  text-align: center;
  font-size: ${props => props.theme.fontSize.regular};
`