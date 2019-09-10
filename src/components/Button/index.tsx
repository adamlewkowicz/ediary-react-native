import React from 'react';
import styled from 'styled-components/native';
import { TouchableOpacityProps } from 'react-native';
import { Theme } from '../../common/theme';

interface ButtonProps extends TouchableOpacityProps {
  title: string
}
export const Button = ({ title, ...props }: ButtonProps) => (
  <Container {...props}>
    <Title>{title}</Title>
  </Container>
);

const Container = styled.TouchableOpacity`
  background-color: ${props => props.theme.fontWeight.regular};
  border-radius: 8px;
  padding: 12px 15px;
`

const Title = styled.Text`
  color: #fff;
  font-family: ${props => props.theme.fontWeight.regular};
  text-align: center;
  text-transform: capitalize;
  font-size: 16px;
  font-family: DMSans-Medium;
`