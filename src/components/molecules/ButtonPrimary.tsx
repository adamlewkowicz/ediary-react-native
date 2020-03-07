import React from 'react';
import styled from 'styled-components/native'
import { TouchableOpacityProps } from 'react-native';
import { Text } from '../atoms/Text';

interface ButtonPrimaryProps extends TouchableOpacityProps {
  children: string
}

export const ButtonPrimary = (props: ButtonPrimaryProps) => {
  return (
    <Container {...props}>
      <ButtonText>{props.children}</ButtonText>
    </Container>
  );
}

const Container = styled.TouchableOpacity`
  background-color: ${props => props.theme.color.highlight};
  padding: 10px;
`

const ButtonText = styled(Text)`
  text-align: center;
  color: #fff;
`


export interface ButtonSecondaryProps extends TouchableOpacityProps {
  children: string
}

export const ButtonSecondary = (props: ButtonSecondaryProps) => {
  return (
    <_Container {...props}>
      <_ButtonText>{props.children}</_ButtonText>
    </_Container>
  );
}

const _Container = styled.TouchableOpacity`
  background-color: #fff;
  border: ${props => `1px solid ${props.theme.color.highlight}`};
  padding: 10px;
`

const _ButtonText = styled(Text)`
  text-align: center;
  color: ${props => props.theme.color.primary};
`