import React, { useState } from 'react';
import styled from 'styled-components/native';
import { Block } from '../../components/Elements';
import {
  WomanIcon,
  ManIcon,
  MuscleIcon,
  MeasureIcon,
  FemaleBodyIcon,
} from '../../components/Icons';
import { Button } from '../../components/Button';
import { Heading } from '../../components/Elements/Heading';
import { WeightGoal } from '../../types';
import { useDispatch } from 'react-redux';
import { useUserId } from '../../hooks';
import { IProfileRequired } from '../../database/entities';
import { STEP_TITLES } from './consts';
import { Actions } from '../../store';
import { NumericPicker } from '../../components/NumericPicker';
import { fillArrayWithinRange } from '../../common/utils';
import { SelectionOptions } from '../../components/SelectionOptions';
import { RootStackParamList } from '../../navigation/RootStack'
import { StackNavigationProp } from '@react-navigation/stack';

interface ProfileCreateProps {
  navigation: StackNavigationProp<
    RootStackParamList,
    'ProfileCreate'
  >
}

export const ProfileCreate = (props: ProfileCreateProps) => {
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
        <Block row space="space-around">
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
        </Block>
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
      <Block space="space-evenly" row={false} align="center">
        <SelectionOptions
          value={weightGoal}
          onChange={setWeightGoal}
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
      </Block>
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

const AGE_VALUES = fillArrayWithinRange({ from: 10, to: 120 });
const WEIGHT_VALUES = fillArrayWithinRange({ from: 40, to: 180 });
const HEIGHT_VALUES = fillArrayWithinRange({ from: 100, to: 210 });