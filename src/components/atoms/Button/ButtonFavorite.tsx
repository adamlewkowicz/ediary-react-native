import React from 'react';
import styled from 'styled-components/native';
import { useAnimatedTiming } from '../../../hooks';
import Lottie from 'lottie-react-native';
import { Easing } from 'react-native';

interface ButtonFavoriteProps {
  isFavorite: boolean
  onToggle?: () => void
}

export const ButtonFavorite = (props: ButtonFavoriteProps) => {
  const progress = useAnimatedTiming(props.isFavorite ? 1 : 0, {
    duration: 2500,
    easing: Easing.linear,
  });

  return (
    <Container onPress={props.onToggle}>
      <LottieStyled
        source={require('../../../../assets/lottie/heart.json')}
        progress={progress}
      />
    </Container>
  );
}

const Container = styled.TouchableOpacity`
  width: 42px;
  height: 42px;
`

const LottieStyled = styled(Lottie)`
  margin: -8px;
`