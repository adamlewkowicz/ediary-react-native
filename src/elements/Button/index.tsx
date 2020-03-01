import React, { ReactNode } from 'react';
import styled from 'styled-components/native';
import { TouchableOpacityProps } from 'react-native';
import { Text } from '../Text';

interface ButtonProps extends TouchableOpacityProps {
  children: string
  isReverted?: boolean
  rightContent?: ReactNode
}

export const Button = (props: ButtonProps) => {
  const {
    children: title,
    isReverted,
    rightContent,
    ...touchableOpacityProps
  } = props;

  return (
    <Container
      isReverted={isReverted}
      {...touchableOpacityProps}
    >
      <Title isReverted={isReverted}>
        {title}
      </Title>
      {rightContent}
    </Container>
  );
}

const Container = styled.TouchableOpacity<{
  isReverted?: boolean
}>`
  background-color: ${props => !props.isReverted ? '#455EEA' : '#fff'};
  border: ${props => `1px solid ${props.isReverted ? '#455EEA' : '#fff'}`};
  min-width: 90px;
  padding: 12px;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`

const Title = styled(Text)<{
  isReverted?: boolean
}>`
  text-align: center;
  color: ${props => props.theme.color[props.isReverted ? 'textDark' : 'textLight']};
`