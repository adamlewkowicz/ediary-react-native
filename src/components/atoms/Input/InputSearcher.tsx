import React from 'react';
import styled from 'styled-components/native';
import { TextInputProps, ActivityIndicator } from 'react-native';
import { LoupeIcon } from '../Icons';
import { THEME } from '../../../common/theme';

export interface InputSearcherProps extends TextInputProps {
  showLabel?: boolean
  isLoading?: boolean
}

export const InputSearcher = ({ isLoading, ...props }: InputSearcherProps) => (
  <Container>
    <Input
      placeholderTextColor={THEME.color.secondary}
      {...props}
     />
    {isLoading && <Spinner />}
    <StyledLoupeIcon />
  </Container>
);

const LOUPE_ICON_SIZE = 16;
const LOUPE_ICON_TRANSFORM_Y = LOUPE_ICON_SIZE * -1 / 2;

const Container = styled.View`
  position: relative;
  flex: 1;
`

const Spinner = styled(ActivityIndicator)`
  position: absolute;
  right: ${props => props.theme.spacing.small};
  top: 50%;
  transform: translateY(-10px);
`

const StyledLoupeIcon = styled(LoupeIcon).attrs(props => ({
  fill: props.theme.color.primary,
  width: LOUPE_ICON_SIZE,
  height: LOUPE_ICON_SIZE,
}))`
  position: absolute;
  top: 50%;
  left: 15px;
  transform: translateY(${LOUPE_ICON_TRANSFORM_Y}px);
`

const Input = styled.TextInput`
  background-color: ${props => props.theme.color.quinary};
  font-family: ${props => props.theme.fontWeight.regular};
  font-size: ${props => props.theme.fontSize.regular};
  color: ${props => props.theme.color.primary};
  padding: 10px 48px;
`