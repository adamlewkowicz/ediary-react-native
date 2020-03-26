import React from 'react';
import styled from 'styled-components/native';
import { TextPrimary, RightArrowIcon } from '../index';
import { TouchableOpacityProps } from 'react-native';
import { theme } from '../../../common/theme';
import { SvgProps } from 'react-native-svg';

export interface ButtonSecondaryProps extends TouchableOpacityProps {
  children: string
  Icon?: (props: SvgProps) => JSX.Element
}

export const ButtonSecondary = ({ children, Icon, ...props }: ButtonSecondaryProps) => {
  return (
    <Container {...props}>
      <ButtonText>{children}</ButtonText>
      {Icon && <Icon {...ICON_STYLE} />}
    </Container>
  );
}

export const ButtonSecondaryArrow = (props: ButtonSecondaryProps) => (
  <ButtonSecondary Icon={RightArrowIcon} {...props} />
);

const Container = styled.TouchableOpacity`
  background-color: #fff;
  border: ${props => `1px solid ${props.theme.color.highlight}`};
  padding: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

const ButtonText = styled(TextPrimary)`
  text-align: center;
  color: ${props => props.theme.color.primary};
`

const ICON_STYLE = {
  width: 16,
  height: 16,
  fill: theme.color.primary,
  style: { marginLeft: 5 }
} as const;