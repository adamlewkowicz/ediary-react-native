import React from 'react';
import { BasicInput, BasicInputProps } from '../BasicInput';
import { TextInput } from 'react-native';
import styled from 'styled-components/native';
import { Theme } from '../../common/theme';

interface NutritionRowProps extends BasicInputProps {
  title: string
}
export const InputRow = React.forwardRef<TextInput, NutritionRowProps>((
  {
    title,
    minWidth = 100,
    textAlign = 'center',
    keyboardType = 'numeric',
    ...inputProps
  },
  ref
) => (
  <Container>
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

const Container = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const Title = styled.Text<{
  theme: Theme
}>`
  font-size: ${props => props.theme.fontSize};
  font-family: ${props => props.theme.fontFamily};
`