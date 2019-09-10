import React from 'react';
import { BasicInput, BasicInputProps } from '../BasicInput';
import { TextInput } from 'react-native';
import styled from 'styled-components/native';
import { FlattenSimpleInterpolation } from 'styled-components';

interface NutritionRowProps extends BasicInputProps {
  title: string
  css?: FlattenSimpleInterpolation
}
export const InputRow = React.forwardRef<TextInput, NutritionRowProps>((
  {
    title,
    minWidth = 100,
    textAlign = 'center',
    keyboardType = 'numeric',
    css,
    ...inputProps
  },
  ref
) => (
  <Container css={css}>
    <Title>
      {title}
    </Title>
    <BasicInput
      minWidth={minWidth}
      textAlign={textAlign}
      keyboardType={keyboardType}
      forwardedRef={ref}
      {...inputProps}
    />
  </Container>
));

const Container = styled.View<{
  css?: FlattenSimpleInterpolation
}>`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  ${props => props.css};
`

const Title = styled.Text`
  font-size: ${props => props.theme.fontSize.regular};
  font-family: ${props => props.theme.fontWeight.regular};
`