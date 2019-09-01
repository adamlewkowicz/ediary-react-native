import React, { useState } from 'react';
import styled, { css } from 'styled-components/native';
import { SelectionBox } from '../../components/SelectionBox';
import { Block } from '../../components/Elements';
import { WomanIcon, ManIcon, MuscleIcon, MeasureIcon, FemaleBodyIcon } from '../../components/Icons';
import { themeProps } from '../../common/theme';
import { Button } from '../../components/Button';
import { Heading } from '../../components/Elements/Heading';
import Slider from '@react-native-community/slider';
import { WeightGoal, Screen } from '../../types';
import { useDispatch } from 'react-redux';
import * as Actions from '../../store/actions';
import { NavigationScreenProps } from 'react-navigation';
import { useUserId } from '../../common/hooks';

interface ProfileCreateProps extends NavigationScreenProps{}
export const ProfileCreate = (props: ProfileCreateProps) => {
  const [step, setStep] = useState(0);
  const [male, setMale] = useState(true);
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(60);
  const [age, setAge] = useState(55);
  const [weightGoal, setWeightGoal] = useState<WeightGoal>('maintain');
  const dispatch = useDispatch();
  const userId = useUserId();

  async function handleProfileCreate() {
    const payload = { male, height, weightGoal, weight, age, userId };

    await dispatch(
      Actions.userProfileCreate(payload)
    );

    const screen: Screen = 'Main';
    props.navigation.navigate(screen);
  }

  const steps = [
    (
      <>
        <Heading
          value="Wybierz płeć"
          size={20}
          align="center"
          css={css`
            margin-bottom: 15px;
          `}
        />
        <Block row space="space-around">
          <SelectionBox 
            value={male}
            onChange={() => setMale(true)}
            title="Mężczyzna"
            icon={(
              <ManIcon
                fill={male ? themeProps.focusColor : 'rgba(1,1,1,.7)'}
                width={45}
                height={45}
              />
            )}
          />
          <SelectionBox
            value={!male}
            onChange={() => setMale(false)}
            title="Kobieta"
            icon={(
              <WomanIcon
                fill={!male ? themeProps.focusColor : 'rgba(1,1,1,.7)'}
                width={45}
                height={45}
              />
            )}
          />
        </Block>
      </>
    ),
    (
      <>
        <Heading
          value="Twój wzrost"
          size={20}
          align="center"
          css={css`
            margin-bottom: 15px;
          `}
        />
        <SliderValue>{height} cm</SliderValue>
        <Slider
          step={1}
          value={height}
          minimumValue={140}
          maximumValue={210}
          style={{ height: 19 }}
          onSlidingComplete={height => setHeight(Math.floor(height))}
          minimumTrackTintColor={theme.colors.secondary}
          maximumTrackTintColor="rgba(157, 163, 180, 0.10)"
        />
        <Heading
          value="Twoja waga"
          size={20}
          align="center"
          css={css`
            margin: 40px 0 15px 0;
          `}
        />
        <SliderValue>{weight} kg</SliderValue>
        <Slider
          step={1}
          value={weight}
          minimumValue={40}
          maximumValue={150}
          style={{ height: 19 }}
          onSlidingComplete={weight => setWeight(Math.floor(weight))}
          minimumTrackTintColor={theme.colors.secondary}
          maximumTrackTintColor="rgba(157, 163, 180, 0.10)"
        />
        <Heading
          value="Twój wiek"
          size={20}
          align="center"
          css={css`
            margin: 40px 0 15px 0;
          `}
        />
        <SliderValue>{age} lat</SliderValue>
        <Slider
          step={1}
          value={age}
          minimumValue={10}
          maximumValue={100}
          style={{ height: 19 }}
          onSlidingComplete={age => setAge(Math.floor(age))}
          minimumTrackTintColor={theme.colors.secondary}
          maximumTrackTintColor="rgba(157, 163, 180, 0.10)"
        />
      </>
    ),
    (
      <>
        <Block space="space-around" row={false}>
          <SelectionBox 
            value={weightGoal === 'decrease'}
            onChange={() => setWeightGoal('decrease')}
            title="Redukcja"
            description="Chcę zmniejszyć wagę"
            noFlex
            icon={(
              <FemaleBodyIcon
                fill={weightGoal === 'decrease' ? themeProps.focusColor : 'rgba(1,1,1,.7)'}
                width={45}
                height={45}
              />
            )}
          />
          <SelectionBox
            value={weightGoal === 'maintain'}
            onChange={() => setWeightGoal('maintain')}
            title="Utrzymanie"
            description="Chcę utrzymać obecną wagę"
            noFlex
            icon={(
              <MeasureIcon
                fill={weightGoal === 'maintain' ? themeProps.focusColor : 'rgba(1,1,1,.7)'}
                width={45}
                height={45}
              />
            )}
          />
          <SelectionBox
            value={weightGoal === 'increase'}
            onChange={() => setWeightGoal('increase')}
            title="Zwiększenie"
            description="Chcę zwiększyć wagę"
            noFlex
            icon={(
              <MuscleIcon
                fill={weightGoal === 'increase' ? themeProps.focusColor : 'rgba(1,1,1,.7)'}
                width={45}
                height={45}
              />
            )}
          />
        </Block>
      </>
    )
  ];

  const isLastStep = steps.length - 1 === step;

  return (
    <Container>
      <Content>
        {steps[step]}
      </Content>
      <InfoContainer>
        <Button
          title={isLastStep ? "Zapisz" : "Kontynuuj"}
          onPress={() => {
            if (isLastStep) {
              handleProfileCreate();
            } else {
              setStep(step + 1);
            }
          }}
        />
      </InfoContainer>
    </Container>
  );
}

const Container = styled.View`
  padding: 70px 10px;
  justify-content: space-between;
  height: 100%;
`

const Content = styled.View``

const InfoContainer = styled.View``

const SliderValue = styled.Text`
  text-align: center;
  font-size: 20px;
  margin-bottom: 10px;
`

const theme = {
  colors: {
    accent: "#F3534A",
    primary: "#0AC4BA",
    secondary: "#2BDA8E",
    tertiary: "#FFE358",
    black: "#323643",
    white: "#FFFFFF",
    gray: "#9DA3B4",
    gray2: "#C5CCD6",
  },
  sizes: {
    // global sizes
    base: 16,
    font: 14,
    radius: 6,
    padding: 25,
    // font sizes
    h1: 26,
    h2: 20,
    h3: 18,
    title: 18,
    header: 16,
    body: 14,
    caption: 12,
  }
}