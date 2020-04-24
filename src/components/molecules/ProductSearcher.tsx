import React from 'react';
import styled from 'styled-components/native';
import { InputSearcher, InputSearcherProps, BarcodeButton } from '../atoms';

interface SearcherProps extends InputSearcherProps {
  onBarcodeScan?: () => void
} 

export const ProductSearcher = ({ onBarcodeScan, ...props }: SearcherProps) => (
  <Container>
    <InputSearcher
      accessibilityRole="search"
      accessibilityLabel="Nazwa szukanego produktu"
      placeholder="Nazwa produktu"
      {...props}
    />
    <BarcodeButton
      accessibilityLabel="Zeskanuj kod kreskowy"
      onPress={onBarcodeScan}
    />
  </Container>
);

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.spacing.microXSmall};
  background-color: ${props => props.theme.color.quinary};
`