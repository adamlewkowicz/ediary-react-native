import styled from 'styled-components/native';
import { Theme } from '../../common/theme';

export const Title = styled.Text<{
  theme: Theme
}>`
  font-family: ${props => props.theme.fontFamily};
  text-transform: uppercase;
  color: ${props => props.theme.colors.gray};
`;