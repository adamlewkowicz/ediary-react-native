import React, { RefObject } from 'react';
import { BasicInput, BasicInputProps } from '../BasicInput';
import { TextInput } from 'react-native';
import styled from 'styled-components/native';
import { FlattenSimpleInterpolation } from 'styled-components';

interface NutritionRowProps extends BasicInputProps {
  title: string
  styles?: FlattenSimpleInterpolation
}

export const InputRow = React.forwardRef<TextInput, NutritionRowProps>((
  {
    title,
    minWidth = 100,
    textAlign = 'center',
    keyboardType = 'numeric',
    styles,
    ...inputProps
  },
  ref
) => (
  <Container styles={styles}>
    <Title>
      {title}
    </Title>
    <BasicInput
      minWidth={minWidth}
      textAlign={textAlign}
      keyboardType={keyboardType}
      forwardedRef={ref as RefObject<TextInput>}
      {...inputProps}
    />
  </Container>
));

const Container = styled.View<{
  styles?: FlattenSimpleInterpolation
}>`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  ${props => props.styles};
`

const Title = styled.Text`
  font-size: ${props => props.theme.fontSize.regular};
  font-family: ${props => props.theme.fontWeight.regular};
`