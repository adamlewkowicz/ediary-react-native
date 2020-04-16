import React from 'react';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface ButtonFavoriteProps {
  isFavorite: boolean
  onFavoriteAdd?: () => void
  onFavoriteDelete?: () => void
  onFavoriteToggle?: () => void
}

export const ButtonFavorite = (props: ButtonFavoriteProps) => {

  const handleFavoriteAction = () => {
    if (props.isFavorite) {
      props.onFavoriteDelete?.();
    } else {
      props.onFavoriteAdd?.();
    }
  }

  return (
    <Container onPress={props.onFavoriteToggle}>
      <Icon name="rocket" size={30} color="#900" />
    </Container>
  );
}

const Container = styled.TouchableOpacity`

`