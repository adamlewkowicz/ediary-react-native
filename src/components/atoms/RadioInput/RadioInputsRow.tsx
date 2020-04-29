import React from 'react';
import styled from 'styled-components/native';
import { RadioInput } from '.';
import { H3 } from '../Text';
import { ScrollView } from 'react-native';

interface RadioInputsRowProps<T> {
  activeValue: T
  options: readonly { value: number, title: string }[]
  onChange: (value: number) => void
  title: string
}

export const RadioInputsRow = <T extends number>(props: RadioInputsRowProps<T>) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
    <Container>
      <Title>{props.title}</Title>
      <RadioInputsContainer>
        {props.options.map((option, index) => (
          <StyledRadioInput
            key={index}
            value={option.value === props.activeValue}
            onChange={() => props.onChange(option.value)}
            text={option.title}
          />
        ))}
      </RadioInputsContainer>
    </Container>
  </ScrollView>
);

const Container = styled.View`
  margin-bottom: ${props => props.theme.spacing.base};
`

const RadioInputsContainer = styled.View`
  flex-direction: row;
  overflow: visible;
`

const StyledRadioInput = styled(RadioInput)`
  margin-right: ${props => props.theme.spacing.micro};
`

const Title = styled(H3)`
  margin-bottom: ${props => props.theme.spacing.micro};
`