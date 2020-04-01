import React, { useState } from 'react';
import styled from 'styled-components/native';
import {
  WomanIcon,
  ManIcon,
  MuscleIcon,
  MeasureIcon,
  FemaleBodyIcon,
  NumericPicker,
  StepContainer,
  Step,
  TextPrimary,
} from '../../components';
import { WeightGoal } from '../../types';
import { useDispatch } from 'react-redux';
import { useUserId, useAppError } from '../../hooks';
import { IProfileRequired } from '../../database/entities';
import { Actions } from '../../store';
import { SelectionOptions } from '../../components/molecules/SelectionOptions';
import * as Utils from '../../utils';

interface ProfileCreateScreenProps {}

export const ProfileCreateScreen = (props: ProfileCreateScreenProps) => {
  const [male, setMale] = useState(true);
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(65);
  const [age, setAge] = useState(25);
  const [weightGoal, setWeightGoal] = useState<WeightGoal>('maintain');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const userId = useUserId();
  const { setAppError } = useAppError();

  async function handleProfileCreate() {
    try {
      if (isLoading) return;

      setIsLoading(true);

      const profile: IProfileRequired = {
        male, height, weightGoal, weight, age, userId
      }
  
      await dispatch(
        Actions.userProfileCreate(profile)
      );
  
      dispatch(
        Actions.appStatusUpdated('INITIALIZED')
      );
    } catch(error) {
      setAppError(error, 'Nie udało się stworzyć profilu');
      setIsLoading(false);
    }
  }

  return (
    <StepContainer
      buttonTitle="Kontynuuj"
      lastStepButtonTitle="Zapisz"
      onSubmit={handleProfileCreate}
    >
      <Step title="Wybierz płeć" index={0}>
        <GenderContainer accessibilityRole="radiogroup">
          <SelectionOptions
            value={male}
            onChange={setMale}
            options={[
              {
                value: true,
                title: 'Mężczyzna',
                Icon: ManIcon,
              },
              {
                value: false,
                title: 'Kobieta',
                Icon: WomanIcon,
              }
            ]}
          />
        </GenderContainer>
      </Step>
      <Step title="Twoje pomiary" index={1}>
        <MetricsContainer>
          <MetricsHeading>Wzrost</MetricsHeading>
          <NumericPicker
            value={height}
            onChange={setHeight}
            options={HEIGHT_VALUES}
            renderOptionLabel={height => `${height} cm`}
          />
          <MetricsHeading>Waga</MetricsHeading>
          <NumericPicker
            value={weight}
            onChange={setWeight}
            options={WEIGHT_VALUES}
            renderOptionLabel={weight => `${weight} kg`}
          />
          <MetricsHeading>Wiek</MetricsHeading>
          <NumericPicker
            value={age}
            onChange={age => setAge(age)}
            options={AGE_VALUES}
            renderOptionLabel={age => `${age} lat`}
          />
        </MetricsContainer>
      </Step>
      <Step title="Wybierz cel" index={2}>
        <WeightGoalContainer accessibilityRole="radiogroup">
          <SelectionOptions
            value={weightGoal}
            onChange={setWeightGoal}
            optionLabel="Wybierz cel"
            options={[
              {
                value: 'decrease',
                title: 'Redukcja',
                description: 'Chcę zmniejszyć wagę',
                Icon: FemaleBodyIcon
              },
              {
                value: 'maintain',
                title: 'Utrzymanie',
                description: 'Chcę utrzymać obecną wagę',
                Icon: MeasureIcon
              },
              {
                value: 'increase',
                title: 'Zwiększenie',
                description: 'Chcę zwiększyć wagę',
                Icon: MuscleIcon
              }
            ]}
          />
        </WeightGoalContainer>
      </Step>
    </StepContainer>
  );
}

const GenderContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
`

const MetricsContainer = styled.View`
  padding: 5px 0;
`

const MetricsHeading = styled(TextPrimary)`
  margin-bottom: 10px;
`

const WeightGoalContainer = styled.View`
  justify-content: space-evenly;
  align-items: center;
  padding: 0 8px;
`

const AGE_VALUES = Utils.fillArrayWithinRange({ from: 10, to: 120 });
const WEIGHT_VALUES = Utils.fillArrayWithinRange({ from: 40, to: 180 });
const HEIGHT_VALUES = Utils.fillArrayWithinRange({ from: 100, to: 210 });