import React from 'react';
import styled from 'styled-components/native';
import { TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string
}

export const Button = ({ title, ...props }: ButtonProps) => (
  <Container {...props}>
    <Title>{title}</Title>
  </Container>
);

const Container = styled.TouchableOpacity`
  background-color: ${props => props.theme.color.focus};
  border-radius: 8px;
  padding: 12px 15px;
`

const Title = styled.Text`
  color: #fff;
  font-family: ${props => props.theme.fontWeight.medium};
  text-align: center;
  text-transform: capitalize;
  font-size: ${props => props.theme.fontSize.large};
`