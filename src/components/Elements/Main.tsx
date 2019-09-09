import styled from 'styled-components/native';

export const Title = styled.Text<{
  marginVertical?: number
}>`
  font-family: ${props => props.theme.font.medium};
  text-transform: uppercase;
  color: ${props => props.theme.colors.gray};
  font-size: 14px;
  letter-spacing: 0.5px;
  margin-vertical: ${props => props.marginVertical || 0};
`;