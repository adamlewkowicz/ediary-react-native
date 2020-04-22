import React from 'react';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface ButtonFavoriteProps {
  isFavorite: boolean
  onToggle?: () => void
}

export const ButtonFavorite = (props: ButtonFavoriteProps) => {
  return (
    <Container onPress={props.onToggle}>
      <Icon name="rocket" size={30} color="#900" />
    </Container>
  );
}

const Container = styled.TouchableOpacity`

`