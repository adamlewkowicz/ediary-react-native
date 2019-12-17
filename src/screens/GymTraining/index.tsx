import React, { useEffect } from 'react';
import styled from 'styled-components/native';
import { Text, Button, View, Alert } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useUserId, useMobxStore } from '../../hooks';
import { ExerciseSetState } from '../../mobx/GymTrainingStore';
import { AsyncAlert } from '../../common/utils/async-alert';
import { Timer } from '../../components/Timer';
import { ExerciseSet } from '../../components/ExerciseSet';

interface GymTrainingScreenProps {}

export const GymTrainingScreen = observer((props: GymTrainingScreenProps) => {
  const rootStore = useMobxStore();
  const trainingStore = rootStore.gymTraining;
  const userId = useUserId();

  useEffect(() => {
    trainingStore.loadTrainings();
  }, []);

  const handleTrainingCreate = () => {
    trainingStore.trainingCreate('Plecy', userId);
  }

  const handleExerciseSetActivation = async (
    requestedExerciseSet: ExerciseSetState,
    exerciseSetIndex: number
  ): Promise<void> => {
    // Queue alert actions to prevent race conditions between alerts
    const queuedActions: Function[] = [];
    const activateNextSet = () => trainingStore.exerciseSetNextActivate(requestedExerciseSet.id);
    const activateRestOfActiveSet = trainingStore.exerciseSetRestActivate;

    if (trainingStore.activeExerciseSet?.isRest === false) {
      return await AsyncAlert(
        'Przerwa',
        `Nie zacząłeś jeszcze przerwy w obecnej serii. Chcesz przejść do następnej serii, ` +
        `czy wolisz rozpocząć przerwę?`,
        [
          {
            text: 'Anuluj',
            style: 'cancel',
          },
          {
            text: 'Przerwa',
            onPress: () => queuedActions.push(activateRestOfActiveSet)
          },
          {
            text: 'Następna seria',
            onPress: () => queuedActions.push(activateNextSet)
          }
        ]
      );
    }
    
    if (requestedExerciseSet.state === 'finished') {
      Alert.alert(
        'Kontynuacja serii',
        `Seria ${exerciseSetIndex + 1} została już zakończona, czy chcesz ją kontynuować?`,
        [
          {
            text: 'Anuluj',
            style: 'cancel'
          },
          {
            text: 'OK',
            onPress: activateNextSet
          }
        ]
      );
    } else {
      activateNextSet();
    }

    queuedActions.forEach(action => action());
  }

  return (
    <Container>
      <Button onPress={handleTrainingCreate} title="Utwórz trening" />
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
              {exercise.sets.map((exerciseSet, exerciseSetIndex) => (
                <React.Fragment key={exerciseSetIndex}>
                  <ExerciseSetButton
                    key={exerciseSet.id as number}
                    isActive={exerciseSet.state === 'active'}
                    isRest={exerciseSet.isRest}
                    onPress={() => handleExerciseSetActivation(exerciseSet, exerciseSetIndex)}
                  >
                    <ExerciseSet
                      data={exerciseSet}
                      index={exerciseSetIndex}
                    />
                  </ExerciseSetButton>
                  {exerciseSet.state === 'active' && (
                    <>
                      {exerciseSet.isRest ? (
                        <>
                          <Text>
                            Do końca przerwy:
                            {exerciseSet.restTime - exerciseSet.restDuration}
                          </Text>
                          <Timer duration={exerciseSet.restTime - exerciseSet.restDuration} />
                          <Button
                            title="Przedłuż przerwę o 10"
                            onPress={() => trainingStore.exerciseSetRestExpand()}
                          />
                        </>
                      ) : (
                        <Button
                          title="Aktywuj przerwę"
                          onPress={() => trainingStore.exerciseSetRestActivate()}
                        />
                      )}
                      <Button
                        title="Usuń serię"
                        onPress={() => trainingStore.exerciseSetDelete(exercise.id, exerciseSet.id)}
                      />
                    </>
                  )}
                </React.Fragment>
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
    return 'white';
    if (props.isRest) {
      return 'lightgray';
    }
    if (props.isActive) {
      return 'lightgreen';
    } 
    return 'lightpink';
  }}
`