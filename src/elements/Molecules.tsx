import styled from 'styled-components/native';

export const TextInput = styled.TextInput`
  border-bottom-color: ${props => props.theme.color.tertiary};
  border-bottom-width: 1px;
  font-family: ${props => props.theme.fontWeight.regular};
  color: ${props => props.theme.color.primary};
  padding: 11px 0;
`