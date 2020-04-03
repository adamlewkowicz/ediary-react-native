import React from 'react';
import styled from 'styled-components/native'
import { TouchableOpacityProps, ActivityIndicator } from 'react-native';
import { Text } from '../Text';
import { theme } from '../../../common/theme';

interface ButtonPrimaryProps extends TouchableOpacityProps {
  children: string
  isLoading?: boolean
}

export const ButtonPrimary = ({ children, ...props }: ButtonPrimaryProps) => {
  return (
    <Container
      accessibilityState={{ disabled: props.isLoading }}
      {...props}
    >
      {props.isLoading ? (
        <ActivityIndicator color={theme.color.primaryLight} />
      ) : (
        <ButtonText>{children}</ButtonText>
      )}
    </Container>
  );
}

const Container = styled.TouchableOpacity`
  background-color: ${props => props.theme.color.highlight};
  padding: 10px;
`

const ButtonText = styled(Text)`
  text-align: center;
  color: ${props => props.theme.color.primaryLight};
`