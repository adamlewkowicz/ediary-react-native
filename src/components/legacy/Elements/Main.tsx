import styled from 'styled-components/native';
import { ThemeColor, ThemeFontSize } from '../../../common/theme';
import { TextAlignProperty } from 'csstype';

export interface TextProps {
  priority?: 0 | 1 | 2 | 3 | 4
  size?: ThemeFontSize
  margin?: string
  align?: TextAlignProperty
  color?: ThemeColor
}

export const Text = styled.Text<TextProps>`
  font-family: ${props => props.theme.fontWeight.regular};
  font-size: ${props => props.theme.fontSize[props.size || 'regular']};
  margin: ${props => props.margin || '0'};
  text-align: ${props => props.align || 'left'};
  color: ${props => {
    if (props.color) return props.theme.color[props.color];
    if (!props.priority) return '#000';
    return {
      0: '#000',
      1: props.theme.color.gray40,
      2: props.theme.color.gray30,
      3: props.theme.color.gray20,
      4: props.theme.color.gray10,
    }[props.priority]
  }};
`;

export const TitleSecondary = styled(Text)`
  color: ${props => props.theme.color.midGray};
  font-size: ${props => props.theme.fontSize.tiny};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;