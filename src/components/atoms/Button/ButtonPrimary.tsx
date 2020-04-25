import React from 'react';
import styled from 'styled-components/native'
import { TouchableOpacityProps, ActivityIndicator } from 'react-native';
import { Text } from '../Text';
import { THEME } from '../../../common/theme';

interface ButtonPrimaryProps extends TouchableOpacityProps {
  children: string
  isLoading?: boolean
}

export const ButtonPrimary = ({ children, ...props }: ButtonPrimaryProps) => {
  return (
    <Container
      accessibilityLabel={props.accessibilityLabel ?? children}
      accessibilityState={{ disabled: props.isLoading }}
      {...props}
    >
      {props.isLoading ? (
        <ActivityIndicator
          color={THEME.color.primaryLight}
          accessibilityLabel="Trwa ładowanie"
        />
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