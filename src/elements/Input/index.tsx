import React, { ReactNode } from 'react';
import styled from 'styled-components/native';
import { Text } from '../../components/Elements';
import { TextInputProps as NativeTextInputProps } from 'react-native';
import { theme } from '../../common/theme';
import { CheckedIcon } from '../../components/Icons';

interface TextInputProps extends NativeTextInputProps {
  label: string
  isValid?: boolean
  rightContent?: ReactNode
}

export const TextInput = (props: TextInputProps) => {
  const {
    label,
    accessibilityLabel = label,
    style,
    isValid,
    rightContent,
    ...inputProps
  } = props;

  return (
    <Container style={style} isValid={isValid}>
      <Label>{accessibilityLabel}</Label>
      <Content>
        <Input
          accessibilityLabel={accessibilityLabel}
          placeholderTextColor={'#e3e3e3'}
          {...inputProps}
        />
        {rightContent}
        {isValid && ValidationIcon}
      </Content>
    </Container>
  );
}

const Container = styled.View<{
  isValid?: boolean
}>`
  margin: 10px 0 25px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.isValid ? '#2DD266' : '#D7D7D7'};
`

const Content = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const Input = styled.TextInput`
  font-family: ${props => props.theme.fontWeight.regular};
  padding: 14px 0;
  width: auto;
  font-size: 15px;
  /* background: red; */
  flex: 1;
  /* font-size: 16px; */
`

const Label = styled(Text)`
  /* color: ${props => props.theme.color.gray20}; */
  /* text-transform: uppercase;
  font-size: ${props => 12};
  letter-spacing: 2px; */

  text-transform: uppercase;
  font-size: 11px;
  
`

const ValidationIcon = (
  <CheckedIcon
    fill={theme.color.success}
    width={14}
    height={14}
  />
);