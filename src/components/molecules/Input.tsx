import React, { ReactNode } from 'react';
import styled from 'styled-components/native'
import { InputLabel } from '../atoms/Text'
import { TextInputProps } from 'react-native';
import { theme } from '../../common/theme';
import { ButtonSecondary } from '..';

export interface InputProps extends TextInputProps {
  label: string
  rightContent?: ReactNode
}

export const Input = (props: InputProps) => {
  const {
    rightContent,
    label,
    ...inputProps
  } = props;

  return (
    <Container>
      <InputLabel>{label}</InputLabel>
      <Content>
        <TextInput
          placeholderTextColor={theme.color.tertiary}
          {...inputProps}
        />
        {rightContent}
      </Content>
    </Container>
  );
}

interface InputButtonProps extends InputProps {
  buttonText: string
}

export const InputButton = (props: InputButtonProps) => {
  const { buttonText, ...inputProps } = props;

  return (
    <Input
      {...inputProps}
      rightContent={(
        <ButtonSecondaryStyled>
          {buttonText}
        </ButtonSecondaryStyled>
      )}
    />
  );
}

const Container = styled.View`
  margin-bottom: 20px;
  flex: 1;
`

const ButtonSecondaryStyled = styled(ButtonSecondary)`
  margin-left: ${props => props.theme.margin.inputSpace};
  min-width: 100px;
`

const TextInput = styled.TextInput`
  border-bottom-color: ${props => props.theme.color.tertiary};
  border-bottom-width: 1px;
  font-family: ${props => props.theme.fontWeight.regular};
  color: ${props => props.theme.color.primary};
  padding: 11px 0;
  flex: 1;
`

const Content = styled.View`
  flex-direction: row;
  align-items: center;
  position: relative;
`