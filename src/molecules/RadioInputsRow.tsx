import React from 'react';
import styled from 'styled-components/native';
import { RadioInput } from './RadioInput';
import { H3 } from '../elements/Text';

interface RadioInputsRowProps<T> {
  activeValue: T
  values: readonly T[]
  onChange: (value: T) => void
  title: string
}

export const RadioInputsRow = <T extends number>(props: RadioInputsRowProps<T>) => {
  return (
    <Container>
      <Title>{props.title}</Title>
      <RadioInputsContainer>
        {props.values.map((value, index) => (
          <StyledRadioInput
            key={index}
            value={value === props.activeValue}
            onChange={() => props.onChange(value)}
            text={value.toString()}
          />
        ))}
      </RadioInputsContainer>
    </Container>
  );
}

const Container = styled.View`
  margin-bottom: ${props => props.theme.spacing.sectionSecondary};
`

const RadioInputsContainer = styled.View`
  flex-direction: row;
`

const StyledRadioInput = styled(RadioInput)`
  margin-right: 5px;
`

const Title = styled(H3)`
  margin-bottom: ${props => props.theme.spacing.quinary};
`