import styled from 'styled-components/native';
import React, { ReactNode } from 'react';
import { FlexStyle } from 'react-native';

interface BlockProps extends BlockParams {
  children: ReactNode
}
export const Block = ({ children, ...props }: BlockProps) => (
  <Container {...props}>
    {children}
  </Container>
);

interface BlockParams {
  row?: boolean
  align?: FlexStyle['alignItems']
  alignCtn?: FlexStyle['alignContent']
  space?: FlexStyle['justifyContent']
}

const Container = styled.View<BlockParams>`
  flex-direction: ${props => props.row ? 'row' : 'column'};
  justify-content: ${props => props.space ? props.space : 'flex-start'};
`