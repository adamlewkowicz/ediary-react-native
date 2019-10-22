import styled from 'styled-components/native';
import React, { ReactNode } from 'react';
import { FlexStyle, ViewProps } from 'react-native';
import { FlattenSimpleInterpolation } from 'styled-components';

interface BlockProps extends BlockParams {
  children: ReactNode
}

export const Block = ({ children, row = true, ...props }: BlockProps) => (
  <Container row={row} {...props}>
    {children}
  </Container>
);

interface BlockParams extends ViewProps {
  row?: boolean
  align?: FlexStyle['alignItems']
  alignCtn?: FlexStyle['alignContent']
  space?: FlexStyle['justifyContent']
  marginVertical?: number
  styles?: FlattenSimpleInterpolation;
}

const Container = styled.View<BlockParams>`
  flex-direction: ${props => props.row ? 'row' : 'column'};
  justify-content: ${props => props.space ? props.space : 'flex-start'};
  align-items: ${props => props.align ? props.align : 'flex-start'};
  ${props => props.marginVertical && `${props.marginVertical}px 0`};
  ${props => props.styles};
`