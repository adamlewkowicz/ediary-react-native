import React, { useState } from 'react';
import styled, { css } from 'styled-components/native';
import { SelectionBox } from '../../components/SelectionBox';
import { Block } from '../../components/Elements';
import {
  WomanIcon,
  ManIcon,
  MuscleIcon,
  MeasureIcon,
  FemaleBodyIcon,
} from '../../components/Icons';
import { theme } from '../../common/theme';
import { Button } from '../../components/Button';
import { Heading } from '../../components/Elements/Heading';
import Slider from '@react-native-community/slider';
import { WeightGoal } from '../../types';
import { useDispatch } from 'react-redux';
import { useUserId, useNavigate } from '../../hooks';
import { IProfileRequired } from '../../database/entities';
import { STEP_TITLES, ICON_SIZE, ICON_SIZES } from './consts';
import { Actions } from '../../store';
import { Picker } from 'react-native';
import { NumericPicker } from '../../components/NumericPicker';
import { createArrayOfLength } from '../../common/utils';

createArrayOfLength(101, index => index + 10);

// API POC
// createNumericArrOfSize({ from: 101, to: 210 })

const AGE_VALUES: number[] = Array.from({ length: 101 }, (_, index) => index + 10);
const WEIGHT_VALUES: number[] = Array.from({ length: 180 }, (_, index) => index + 41);
const HEIGHT_VALUES: number[] = Array.from({ length: 100 }, (_, index) => index + 121);

export interface ProfileCreateProps {}

export const ProfileCreate = (props: ProfileCreateProps) => {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [male, setMale] = useState(true);
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(60);
  const [age, setAge] = useState(55);
  const [weightGoal, setWeightGoal] = useState<WeightGoal>('maintain');
  const dispatch = useDispatch();
  const userId = useUserId();
  const navigate = useNavigate();

  async function handleProfileCreate() {
    const profile: IProfileRequired = { male, height, weightGoal, weight, age, userId };

    await dispatch(
      Actions.userProfileCreate(profile)
    );

    navigate('Main');
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
          <SelectionBox 
            value={male}
            onChange={() => setMale(true)}
            title="Mężczyzna"
            icon={(
              <ManIcon
                fill={male ? theme.color.focus : 'rgba(1,1,1,.7)'}
                width={ICON_SIZE}
                height={ICON_SIZE}
              />
            )}
          />
          <SelectionBox
            value={!male}
            onChange={() => setMale(false)}
            title="Kobieta"
            icon={(
              <WomanIcon
                fill={!male ? theme.color.focus : 'rgba(1,1,1,.7)'}
                {...ICON_SIZES}
                width={ICON_SIZE}
                height={ICON_SIZE}
              />
            )}
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
        <SelectionBox
          value={weightGoal === 'decrease'}
          onChange={() => setWeightGoal('decrease')}
          title="Redukcja"
          description="Chcę zmniejszyć wagę"
          icon={(
            <FemaleBodyIcon
              fill={weightGoal === 'decrease' ? theme.color.focus : 'rgba(1,1,1,.7)'}
              width={ICON_SIZE}
              height={ICON_SIZE}
            />
          )}
        />
        <SelectionBox
          value={weightGoal === 'maintain'}
          onChange={() => setWeightGoal('maintain')}
          title="Utrzymanie"
          description="Chcę utrzymać obecną wagę"
          icon={(
            <MeasureIcon
              fill={weightGoal === 'maintain' ? theme.color.focus : 'rgba(1,1,1,.7)'}
              width={ICON_SIZE}
              height={ICON_SIZE}
            />
          )}
        />
        <SelectionBox
          value={weightGoal === 'increase'}
          onChange={() => setWeightGoal('increase')}
          title="Zwiększenie"
          description="Chcę zwiększyć wagę"
          icon={(
            <MuscleIcon
              fill={weightGoal === 'increase' ? theme.color.focus : 'rgba(1,1,1,.7)'}
              width={ICON_SIZE}
              height={ICON_SIZE}
            />
          )}
        />
      </Block>
    )
  ] as const;

  return (
    <Container>
      <Heading
        value={STEP_TITLES[step]}
        size={20}
        align="center"
        styles={Heading3Style}
      />
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

const Heading1Style = css`
  margin-bottom: 15px;
`

const Heading2Style = css`
  margin: 40px 0 15px 0;
`

const Heading3Style = css`
  margin: 15px 0 25px 0;
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
  font-size: 17px;
  text-align: center;
  margin-bottom: 25px;
`