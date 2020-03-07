import React from 'react';
import styled from 'styled-components/native';
import { H2, H4, TextHighlight } from '../atoms/Text';
import { ProgressBar } from '../../components/ProgressBar';
import { theme } from '../../common/theme';
import { ButtonReveal, ChartMacroCircles } from '../../_components';
import { MealProductItem } from './MealProductItem';
import { ButtonSecondary } from '../molecules';

interface MealItemProps {
  isOpened?: boolean
}

export const MealItem = (props: MealItemProps) => {
  return (
    <Container>
      <Heading>
        <BaseInfo>
          <H4>14:00</H4>
          <H2>Zupa pomidorowa</H2>
        </BaseInfo>
        <TextHighlight>418 kcal</TextHighlight>
      </Heading>
      <ProgressBar
        percentages={1500}
        colors={theme.gradient.kcal}
      />
      <RevealMealButton />
      {props.isOpened && (
        <>
          <ChartsContainer>
            <ChartMacroCircles
              values={[14, 68, 47]}
              percentages={[14, 68, 47]}
            />
          </ChartsContainer>
          <ProductsContainer>
            <MealProductItem />
            <MealProductItem />
            <MealProductItem />
            <AddProductButton>
              Dodaj produkt
            </AddProductButton>
          </ProductsContainer>
        </>
      )}
    </Container>
  );
}

const Container = styled.View`
  /* padding: 15px; */
  margin-bottom: 40px;
  position: relative;
`

const Heading = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
  align-items: center;
  /* padding: 0 10px; */
`

const BaseInfo = styled.View``

const ChartsContainer = styled.View`
  margin-top: 40px;
  padding: 40px 10px 20px 10px;
  border: ${props => `1px solid ${props.theme.color.tertiary}`}; 
`

// TODO: HARDOCDED COLOR
const ProductsContainer = styled.View`
  background-color: #FAFBFF;
  padding: 5px 15px;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.color.tertiary};
`

const RevealMealButton = styled(ButtonReveal)`
  position: absolute;
  top: 66px;
  z-index: 200;
`

const AddProductButton = styled(ButtonSecondary)`
  margin: 20px 0;
`