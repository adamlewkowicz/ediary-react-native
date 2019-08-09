import React from 'react';
import styled from 'styled-components/native';
import { BarcodeIcon } from '../Icons';
import { TouchableOpacityProps } from 'react-native';

interface BarcodeButtonProps extends TouchableOpacityProps {}
export const BarcodeButton = (props: BarcodeButtonProps) => (
  <Container {...props}>
    <BarcodeIcon
      width={24}
      height={24}
      fill="#1abc9c"
    />
  </Container>
);

const Container = styled.TouchableOpacity`
  padding: 6px;
  border-radius: 50;
`