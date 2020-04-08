import styled from 'styled-components/native';
import { TableHeading as TH } from './Text';

export const HeadRow = styled.View`
  padding: ${props => props.theme.spacing.small};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

export const Row = styled(HeadRow)`
  border-bottom-color: ${props => props.theme.color.tertiary};
  border-bottom-width: 1px;
`

export const RowSeparator = styled.View`
  height: 1px;
  background-color: ${props => props.theme.color.tertiary};
`

export { TH };