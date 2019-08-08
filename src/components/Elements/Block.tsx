import styled from 'styled-components/native';
import React, { ReactNode } from 'react';
import { FlexStyle } from 'react-native';
import { FlattenSimpleInterpolation } from 'styled-components';

interface BlockProps extends BlockParams {
  children: ReactNode
}
export const Block = ({ children, row = true, ...props }: BlockProps) => (
  <Container row={row} {...props}>
    {children}
  </Container>
);

interface BlockParams {
  row?: boolean
  align?: FlexStyle['alignItems']
  alignCtn?: FlexStyle['alignContent']
  space?: FlexStyle['justifyContent']
  marginVertical?: number
  css?: FlattenSimpleInterpolation;
}

const Container = styled.View<BlockParams>`
  flex-direction: ${props => props.row ? 'row' : 'column'};
  justify-content: ${props => props.space ? props.space : 'flex-start'};
  ${props => props.marginVertical && `${props.marginVertical}px 0`};
  ${props => props.css};
`