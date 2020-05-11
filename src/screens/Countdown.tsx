import React, { useEffect } from 'react';
import styled from 'styled-components/native';
import { useNavigationData } from '../hooks';
import { H1 } from '../components';
import { useInterval } from '../hooks/use-interval';
import { CountdownScreenNavigationProps } from '../navigation/TrainingStack';

export const CountdownScreen = () => {
  const { params } = useNavigationData<CountdownScreenNavigationProps>();
  const { counter, stop } = useInterval();

  const diff = params.countdown - counter;

  useEffect(() => {
    if (counter === params.countdown) {
      stop();
      params.onCountdownEnd();
    }
  }, [counter]);

  return (
    <Container>
      <Title>Trening rozpocznie się za:</Title>
      <Counter>{diff}</Counter>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.color.primaryDark};
  align-items: center;
  justify-content: center;
`

const Title = styled(H1)`
  color: ${props => props.theme.color.primaryLight};
`

const Counter = styled(H1)`
  color: ${props => props.theme.color.primaryLight};
  font-size: 100px;
`