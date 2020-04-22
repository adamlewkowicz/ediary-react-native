import React, { ReactNode } from 'react';
import styled from 'styled-components/native';
import { TouchableOpacityProps } from 'react-native';

interface ButtonIconProps extends TouchableOpacityProps {
  icon: ReactNode
}

export const ButtonIcon = ({ icon, ...props }: ButtonIconProps) => (
  <Container {...props}>
    {icon}
  </Container>
);

const Container = styled.TouchableOpacity`
  width: 42px;
  height: 42px;
  align-items: center;
  justify-content: center;
`