import React, { useEffect } from 'react';
import styled from 'styled-components/native';
import { useMobxStore } from '../../common/hooks/useMobxStore';
import { Text } from 'react-native';

interface TrainingProps {}
export const Training = (props: TrainingProps) => {
  const trainingStore = useMobxStore(store => store.training);

  useEffect(() => {
    trainingStore.loadTrainings();
  }, []);

  return (
    <Container>
      {trainingStore.mergedTrainings.map(training => (
        <Text>Training: {training.id}</Text>
      ))}
    </Container>
  );
}

const Container = styled.View`

`