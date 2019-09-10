import React from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity } from 'react-native';

interface BasicOptionProps {
  title: string
  value: boolean
  maxWidth?: number
  onChange: (status: boolean) => void
}
export const BasicOption = (props: BasicOptionProps) => {
  return (
    <Wrapper
      maxWidth={props.maxWidth}
      onPress={() => props.onChange(!props.value)}
    >
      <Container isActive={props.value}>
        <Text isActive={props.value}>
          {props.title}
        </Text>
      </Container>
    </Wrapper>
  );
}

const Wrapper = styled(TouchableOpacity)<{
  maxWidth?: number
}>`
  flex: 1;
  max-width: ${props => props.maxWidth || 100};
`

const Container = styled.View<{
  isActive: boolean
}>`
  border-radius: 50;
  border-width: 2px; 
  border-color: ${props => props.isActive ? props.theme.color.focus : '#d6d6d6'};
  padding: 8px;
`

const Text = styled.Text<{
  isActive: boolean
}>`
  text-align: center;
  color: ${props => props.isActive ? props.theme.color.focus : '#858585'};
  font-family: ${props => props.theme.fontWeight.regular};
`