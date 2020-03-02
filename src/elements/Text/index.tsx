import React from 'react';
import styled from 'styled-components/native';

export const Text = styled.Text`
  font-family: ${props => props.theme.fontWeight.regular};
  font-size: ${props => props.theme.fontSize.regular};
  color: ${props => props.theme.color.textDark};
`

export const H1 = styled.Text`
  font-family: ${props => props.theme.fontWeight.medium};
  font-size: ${props => props.theme.fontSize.big};
  color: ${props => props.theme.color.textDark};
`

export const H2 = styled.Text`
  font-family: ${props => props.theme.fontWeight.medium};
  font-size: ${props => props.theme.fontSize.largeXL};
  color: ${props => props.theme.color.textDark};
  margin: 0 0 15px 0;
`

export const H2Dot = (props: any) => {
  return (
    <>
      <H2DotContainer>
        {/* <Line></Line> */}
        <Dot>•</Dot>
        <H2Section_>{props.children}</H2Section_>
      </H2DotContainer>
      {/* <Description>Na 100g produktu</Description> */}
    </>
  );
}

const Dot = styled.Text`
  color: ${props => props.theme.color.focus};
  font-family: ${props => props.theme.fontWeight.medium};
  font-size: ${props => props.theme.fontSize.largeXL};
  /* margin-right: 10px; */
`

const H2Section_ = styled(H2)`
  margin: 0;
  margin-left: 10px;
`

const Line = styled.View`
  width: 2px;
  background-color: ${props => props.theme.color.primary};
`

const H2DotContainer = styled.View`
  flex-direction: row;
  /* margin: 0 0 15px 0; */
`

const Description = styled.Text`
  color: #CDCBD6;
  font-family: ${props => props.theme.fontWeight.regular};
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-left: 10px;
  margin: 0 0 20px 0;
  /* word-spacing: 0.5px; */
`