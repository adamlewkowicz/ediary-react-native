import React from 'react';
import styled from 'styled-components/native';
import { TouchableOpacityProps } from 'react-native';
import NativeBarcodeIcon from '../../../../assets/img/barcode.svg';

interface BarcodeButtonProps extends TouchableOpacityProps {}

export const BarcodeButton = (props: BarcodeButtonProps) => (
  <Container {...props}>
    <BarcodeIcon />
  </Container>
);

const Container = styled.TouchableOpacity`
  padding: 6px;
`

const BarcodeIcon = styled(NativeBarcodeIcon).attrs(props => ({
  width: 24,
  height: 24,
  fill: props.theme.color.highlight
}))``