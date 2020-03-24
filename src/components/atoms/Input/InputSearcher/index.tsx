import React from 'react';
import styled from 'styled-components/native';
import { TextInputProps, ActivityIndicator } from 'react-native';
import { LoupeIcon } from '../../Icons';

interface InputSearcherProps extends TextInputProps {
  showLabel?: boolean
  isLoading?: boolean
}

export const InputSearcher = ({ isLoading = false, ...inputProps}: InputSearcherProps) => (
  <Container>
    <Input {...inputProps} />
    {isLoading && <Spinner />}
    <StyledLoupeIcon {...LOUPE_ICON_STYLE} />
  </Container>
);

const LOUPE_SIZE = 16;

const LOUPE_ICON_STYLE = {
  fill: "#272733",
  width: LOUPE_SIZE,
  height: LOUPE_SIZE,
  style: { transform: [{ translateY: -LOUPE_SIZE / 2 }] }
}

const Container = styled.View`
  position: relative;
  flex: 1;
`

const Spinner = styled(ActivityIndicator)`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-10px);
`

const StyledLoupeIcon = styled(LoupeIcon)`
  position: absolute;
  top: 50%;
  left: 15px;
`

const Input = styled.TextInput`
  background-color: ${props => props.theme.colors.lightGray};
  border-radius: ${props => props.theme.radius.rounded};
  font-family: ${props => props.theme.fontWeight.regular};
  font-size: ${props => props.theme.fontSize.regular};
  padding: 10px 45px;
`