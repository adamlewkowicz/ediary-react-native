import React, { useEffect } from 'react';
import styled from 'styled-components/native';
import { useMobxStore } from '../../common/hooks/useMobxStore';
import { Text } from 'react-native';
import { useUserId } from '../../common/hooks';
import { useObserver } from 'mobx-react';

interface TrainingScreenProps {}
export const TrainingScreen = (props: TrainingScreenProps) => {
  const trainingStore = useMobxStore(store => store.training);
  const userId = useUserId();

  useEffect(() => {
    trainingStore.loadTrainings();
  }, []);

  return useObserver(() => (
    <Container>
      <Text>Twoje treningi</Text>
      {trainingStore.mergedTrainings.map(training => (
        <Text key={training.id as any}>
          Training: {training.id}
          Jest aktywny: {training.isActive.toString()}
        </Text>
      ))}
    </Container>
  ));
}

const Container = styled.View`

`