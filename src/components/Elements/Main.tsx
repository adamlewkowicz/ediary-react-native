import styled from 'styled-components/native';

export const Title = styled.Text`
  font-family: ${props => props.theme.fontWeight.medium};
  text-transform: uppercase;
  color: ${props => props.theme.colors.gray};
  font-size: 12px;
  letter-spacing: 0.5px;
`;