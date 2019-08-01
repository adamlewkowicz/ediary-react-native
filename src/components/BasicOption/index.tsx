import React from 'react';
import styled from 'styled-components/native';
import { Theme } from '../../common/theme';
import { TouchableOpacity } from 'react-native';

interface BasicOptionProps {
  title: string
  value: boolean
  onChange: (status: boolean) => void
}
export const BasicOption = (props: BasicOptionProps) => {
  return (
    <Wrapper onPress={() => props.onChange(!props.value)}>
      <Container isActive={props.value}>
        <Text isActive={props.value}>
          {props.title}
        </Text>
      </Container>
    </Wrapper>
  );
}

const Wrapper = styled(TouchableOpacity)`
  max-width: 85px;
`

const Container = styled.View<{
  isActive: boolean
  theme: Theme
}>`
  border-radius: 50;
  border: 1px solid #BCBCBC; 
  border-color: ${props => props.isActive ? props.theme.focusColor : '#BCBCBC'};
  padding: 11px 17px;
`

const Text = styled.Text<{
  isActive: boolean
  theme: Theme
}>`
  text-align: center;
  color: ${props => props.isActive ? props.theme.focusColor : '#858585'};
  font-family: ${props => props.theme.fontFamily};
`