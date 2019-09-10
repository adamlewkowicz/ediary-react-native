import React, { useState } from 'react';
import styled, { css } from 'styled-components/native';
import { SelectionBox } from '../../components/SelectionBox';
import { Block } from '../../components/Elements';
import { WomanIcon, ManIcon, MuscleIcon, MeasureIcon, FemaleBodyIcon } from '../../components/Icons';
import { theme } from '../../common/theme';
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
        <Block row space="space-around">
          <SelectionBox 
            value={male}
            onChange={() => setMale(true)}
            title="Mężczyzna"
            icon={(
              <ManIcon
                fill={male ? theme.color.focus : 'rgba(1,1,1,.7)'}
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
                fill={!male ? theme.color.focus : 'rgba(1,1,1,.7)'}
                width={45}
                height={45}
              />
            )}
          />
        </Block>
      </>
    ),
    (
      <MetricsContainer>
        <Heading
          value="Wzrost"
          size={17}
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
          value="Waga"
          size={17}
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
          value="Wiek"
          size={17}
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
          icon={(
            <MeasureIcon
              fill={weightGoal === 'maintain' ? theme.color.focus : 'rgba(1,1,1,.7)'}
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
          icon={(
            <MuscleIcon
              fill={weightGoal === 'increase' ? theme.color.focus : 'rgba(1,1,1,.7)'}
              width={45}
              height={45}
            />
          )}
        />
      </Block>
    )
  ];

  const isLastStep = steps.length - 1 === step;

  return (
    <Container>
      <Heading
        value={(stepTitles as any)[step]}
        size={20}
        align="center"
        css={HeadingStyle}
      />
      <Content>
        {steps[step]}
      </Content>
      <InfoContainer>
        <Button
          title={isLastStep ? 'Zapisz' : 'Kontynuuj'}
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
  padding: 10px;
  justify-content: space-between;
  flex: 1;
`

const HeadingStyle = css`
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

const SliderValue = styled.Text`
  text-align: center;
  font-size: 20px;
  margin-bottom: 10px;
`

const stepTitles = {
  0: 'Wybierz płeć',
  1: 'Twoje pomiary',
  2: 'Wybierz cel',
}