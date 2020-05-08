
import React, { ReactNode } from 'react';
import styled from 'styled-components/native';
import { TouchableOpacityProps } from 'react-native';
import { TextSecondary } from '../Text';

interface ButtonRoundedProps extends TouchableOpacityProps {
  children: ReactNode
}

export const ButtonRounded = (props: ButtonRoundedProps) => {
  return (
    <Container {...props}>
      <TextSecondary>
        {props.children}
      </TextSecondary>
    </Container>
  );
}

const Container = styled.TouchableOpacity`
  width: 100px;
  height: 100px;
  border-radius: 50;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.color.primary};
`