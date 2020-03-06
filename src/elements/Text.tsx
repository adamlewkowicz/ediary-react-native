import styled from 'styled-components/native';

export const H1 = styled.Text`
  font-family: ${props => props.theme.fontWeight.light};
  font-size: 20px;
  color: ${props => props.theme.color.primary};
`

export const H2 = styled.Text`
  font-family: ${props => props.theme.fontWeight.light};
  font-size: 16px;
  color: ${props => props.theme.color.primary};
  /* margin-bottom: 10px; */
`

export const H3 = styled.Text`
  font-family: ${props => props.theme.fontWeight.regular};
  font-size: 12px;
  color: ${props => props.theme.color.secondary};
  text-transform: uppercase;
`

export const Text = styled.Text`
  font-family: ${props => props.theme.fontWeight.regular};
  font-size: 14px;
  color: ${props => props.theme.color.primary};
`

export const InputLabel = styled.Text`
  font-family: ${props => props.theme.fontWeight.bold};
  color: ${props => props.theme.color.secondary};
  font-size: 11px;
`