import React from 'react';
import styled from 'styled-components/native';
import { H2, H4, TextHighlight } from '../elements/Text';
import { ProgressBar } from '../components/ProgressBar';
import { theme } from '../common/theme';
import { ButtonReveal } from '../molecules/ButtonReveal';

export const MealItem = () => {
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
      <ButtonReveal />
    </Container>
  );
}

const Container = styled.View`
  padding: 15px;
  margin-bottom: 30px;
`

const Heading = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
  align-items: center;
`

const BaseInfo = styled.View``