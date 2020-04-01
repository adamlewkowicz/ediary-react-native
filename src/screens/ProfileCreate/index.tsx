import React, { useState } from 'react';
import styled from 'styled-components/native';
import {
  WomanIcon,
  ManIcon,
  MuscleIcon,
  MeasureIcon,
  FemaleBodyIcon,
  NumericPicker,
} from '../../components';
import { Button } from '../../components/legacy/Button';
import { Heading } from '../../components/legacy/Elements/Heading';
import { WeightGoal } from '../../types';
import { useDispatch } from 'react-redux';
import { useUserId } from '../../hooks';
import { IProfileRequired } from '../../database/entities';
import { STEP_TITLES } from './consts';
import { Actions } from '../../store';
import { SelectionOptions } from '../../components/molecules/SelectionOptions';
import * as Utils from '../../utils';

interface ProfileCreateScreenProps {}

export const ProfileCreateScreen = (props: ProfileCreateScreenProps) => {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [male, setMale] = useState(true);
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(65);
  const [age, setAge] = useState(25);
  const [weightGoal, setWeightGoal] = useState<WeightGoal>('maintain');
  const dispatch = useDispatch();
  const userId = useUserId();

  async function handleProfileCreate() {
    const profile: IProfileRequired = { male, height, weightGoal, weight, age, userId };

    await dispatch(
      Actions.userProfileCreate(profile)
    );

    dispatch(
      Actions.appStatusUpdated('INITIALIZED')
    );
  }

  const isLastStep = step === 2;

  const handleNextStepButtonPress = () => {
    if (isLastStep) {
      handleProfileCreate();
    } else {
      setStep(step => step + 1 as 0 | 1);
    }
  }

  const steps = [
    (
      <>
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
      </>
    ),
    (
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
    ),
    (
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
    )
  ] as const;

  return (
    <Container>
      <MainHeading>
        {STEP_TITLES[step]}
      </MainHeading>
      <Content>
        {steps[step]}
      </Content>
      <InfoContainer>
        <Button
          title={isLastStep ? 'Zapisz' : 'Kontynuuj'}
          onPress={handleNextStepButtonPress}
        />
      </InfoContainer>
    </Container>
  );
}

const Container = styled.View`
  padding: 10px;
  justify-content: space-between;
  flex: 1;
`

const GenderContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
`

const MainHeading = styled(Heading)`
  text-align: center;
  margin: 15px 0 25px 0;
  font-size: ${props => props.theme.fontSize.largeXL};
`

const Content = styled.ScrollView`
  padding: 10px;
`

const MetricsContainer = styled.View`
  padding: 5px 0;
`

const InfoContainer = styled.View`
  padding: 25px 15px;
`

const MetricsHeading = styled.Text`
  font-size: ${props => props.theme.fontSize.regular};
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