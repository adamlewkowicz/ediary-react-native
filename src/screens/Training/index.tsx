import React, { useEffect } from 'react';
import styled from 'styled-components/native';
import { useMobxStore } from '../../common/hooks/useMobxStore';
import { Text, Button, View } from 'react-native';
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
        <View key={training.id as any}>
          <Text>
            Training: {training.id}{'\n'}
            Czas: {training.duration}
          </Text>
          {training.exercises.map(exercise => (
            <View key={exercise.id as any}>
              {exercise.sets.map(exerciseSet => (
                <View key={exerciseSet.id as any}>
                  <Text>
                    Exercise set
                    {exerciseSet.loadWeight}
                    {JSON.stringify(exerciseSet)}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      ))}
      <Button onPress={() => trainingStore.entity!.duration++} title="Increment duration" />
      <Button
        onPress={() => trainingStore.exerciseSetUpdate(4, { loadWeight: Math.random() })}
        title="Increment duration"
      />
    </Container>
  ));
}

const Container = styled.ScrollView`

`