import styled from 'styled-components/native';

export const Text = styled.Text`
  font-family: ${props => props.theme.fontWeight.regular};
  font-size: ${props => props.theme.fontSize.regular};
`

export const H1 = styled.Text`
  font-family: ${props => props.theme.fontWeight.medium};
  font-size: ${props => props.theme.fontSize.big};
`

export const H2 = styled.Text`
  font-family: ${props => props.theme.fontWeight.medium};
  font-size: ${props => props.theme.fontSize.largeXL};
  margin: 0 0 15px 0;
`