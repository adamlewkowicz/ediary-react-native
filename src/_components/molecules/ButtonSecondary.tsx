import React from 'react';
import styled from 'styled-components/native';
import { TextPrimary } from '../atoms';
import { TouchableOpacityProps } from 'react-native';

export interface ButtonSecondaryProps extends TouchableOpacityProps {
  children: string
}

export const ButtonSecondary = ({ children, ...props }: ButtonSecondaryProps) => {
  return (
    <Container {...props}>
      <ButtonText>{children}</ButtonText>
    </Container>
  );
}

const Container = styled.TouchableOpacity`
  background-color: #fff;
  border: ${props => `1px solid ${props.theme.color.highlight}`};
  padding: 10px;
`

const ButtonText = styled(TextPrimary)`
  text-align: center;
  color: ${props => props.theme.color.primary};
`