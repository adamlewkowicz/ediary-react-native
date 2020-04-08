import React from 'react';
import styled from 'styled-components/native';
import { BarcodeIcon } from '../Icons';
import { TouchableOpacityProps } from 'react-native';

interface BarcodeButtonProps extends TouchableOpacityProps {}

export const ButtonBarcode = (props: BarcodeButtonProps) => (
  <Container {...props}>
    <BarcodeIconStyled />
  </Container>
);

const Container = styled.TouchableOpacity`
  padding: 6px;
  border-radius: 50px;
`

const BarcodeIconStyled = styled(BarcodeIcon).attrs(props => ({
  width: 24,
  height: 24,
  fill: props.theme.color.highlight
}))``;