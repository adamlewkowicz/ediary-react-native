import React, { useEffect } from 'react';
import styled from 'styled-components/native';
import { Text, Button, View } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useUserId, useMobxStore } from '../../hooks';

interface GymTrainingScreenProps {}

export const GymTrainingScreen = observer((props: GymTrainingScreenProps) => {
  const rootStore = useMobxStore();
  const trainingStore = rootStore.gymTraining;
  const userId = useUserId();

  useEffect(() => {
    trainingStore.loadTrainings();
  }, []);

  const createTraining = () => {
    trainingStore.trainingCreate('Plecy', userId);
  }

  return (
    <Container>
      <Button onPress={createTraining} title="Utwórz trening" />
      <Text>Twoje treningi</Text>
      <Text>
        Aktywny trening: {' '}
        {trainingStore.activeTraining ? trainingStore.activeTraining.name : 'Brak'}
      </Text>
      {trainingStore.mergedTrainings.map(training => (
        <View key={training.id as number}>
          <TrainingItem
            onPress={() => trainingStore.trainingStart(training.id)}
            isActive={training.isActive}
            isPaused={training.isPaused}
          >
            <Text>
              Training: {training.id}{'\n'}
              Czas: {training.duration}
            </Text>
          </TrainingItem>
          {training.isActive && training.exercises.map(exercise => (
            <Exercise key={exercise.id as number}>
              <Text>Ćwiczenie: {exercise.id}</Text>
              {exercise.sets.map(exerciseSet => (
                <ExerciseSetButton
                  key={exerciseSet.id as number}
                  isActive={exerciseSet.state === 'active'}
                  isRest={exerciseSet.isRest}
                  onPress={() => trainingStore.exerciseSetNextActivate(exerciseSet.id)}
                >
                  <>
                    <Text>
                      Seria: {exerciseSet.id}{'\n'}
                      Czas: {exerciseSet.duration}{'\n'}
                      Czas przerwy: {exerciseSet.restTime}{'\n'}
                      Przerwa: {exerciseSet.restDuration}{'\n'}
                      Obciążenie: {exerciseSet.loadWeight}{'\n'}
                      Status: {exerciseSet.state}{'\n'}
                    </Text>
                    <Button
                      title="Usuń serię"
                      onPress={() => trainingStore.exerciseSetDelete(exercise.id, exerciseSet.id)}
                    />
                    <Button
                      title="Aktywuj przerwę"
                      onPress={() => trainingStore.exerciseSetRestActivate()}
                    />
                    {exerciseSet.isRest && (
                      <>
                        <Text>
                          Do końca przerwy:
                          {exerciseSet.restTime - exerciseSet.restDuration}
                        </Text>
                        <Button
                          title="Przedłuż przerwę o 10"
                          onPress={() => trainingStore.exerciseSetRestExpand()}
                        />
                      </>
                    )}
                  </>
                </ExerciseSetButton>
              ))}
              <Button
                title="Dodaj serię"
                onPress={() => trainingStore.exerciseSetCreate(exercise.id)}
              />
            </Exercise>
          ))}
        </View>
      ))}
      <Button onPress={() => {}} title="Increment duration" />
      <Button
        onPress={() => trainingStore.exerciseSetUpdate(4, { loadWeight: Math.random() })}
        title="Increment duration"
      />
    </Container>
  );
});

const Container = styled.ScrollView`
`

const TrainingItem = styled.TouchableOpacity<{
  isActive: boolean
  isPaused: boolean
}>`
  background: ${props => {
    if (props.isPaused) {
      return 'lightgray';
    } else if (props.isActive) {
      return 'lightskyblue';
    }
    return 'lightsteelblue';
  }};
  padding: 20px;
  margin-bottom: 10px;
`

const Exercise = styled.View`
  padding: 10px;
`

const ExerciseSetButton = styled.TouchableOpacity<{
  isActive: boolean
  isRest: boolean
}>`
  padding: 15px;
  background: lightgreen;
  background: ${props => {
    if (props.isRest) {
      return 'lightgray';
    }
    if (props.isActive) {
      return 'lightgreen';
    } 
    return 'lightpink';
  }}
`