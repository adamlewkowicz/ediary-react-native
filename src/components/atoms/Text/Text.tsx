import styled from 'styled-components/native';

export const H1 = styled.Text`
  font-family: ${props => props.theme.fontWeight.light};
  font-size: 22px;
  color: ${props => props.theme.color.primary};
`

export const H2 = styled.Text`
  font-family: ${props => props.theme.fontWeight.light};
  font-size: 18px;
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

export const TextSecondary = styled(Text)`
  color: ${props => props.theme.color.secondary};
`

export const TextTertiary = styled(Text)`
  color: ${props => props.theme.color.tertiary};
`

export const TableHeading = styled.Text`
  font-size: 12px;
  font-family: ${props => props.theme.fontWeight.medium};
  color: ${props => props.theme.color.primary};
  text-transform: uppercase; 
`

export const H4 = styled(Text)`
  color: ${props => props.theme.color.tertiary};
  font-size: 12px;
`

export const TextHighlight = styled(Text)`
  color: ${props => props.theme.color.highlight};
`

export { Text as TextPrimary };