import React, { useEffect } from 'react';
import styled from 'styled-components/native';
import { useMobxStore } from '../../common/hooks/useMobxStore';
import { Text, Button } from 'react-native';
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
          Training: {training.id}{'\n'}
          Czas: {training.duration}
        </Text>
      ))}
      <Button onPress={() => trainingStore.entity!.duration++} title="Increment duration" />
    </Container>
  ));
}

const Container = styled.View`

`