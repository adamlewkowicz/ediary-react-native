import React from 'react';
import styled from 'styled-components/native';
import { TextPrimary } from '../Text';
import { TouchableOpacityProps } from 'react-native';

interface TabButtonProps extends TouchableOpacityProps {
  title: string
  isActive: boolean
}

export const TabButton = (props: TabButtonProps) => {
  return (
    <Container {...props}>
      <TextPrimary>{props.title}</TextPrimary>
    </Container>
  );
}

const Container = styled.TouchableOpacity<{
  isActive: boolean
}>`
  padding: 16px 0;
  border-bottom-width: 2px;
  border-bottom-color: ${props => props.isActive ? props.theme.color.highlight : '#fff'};
  margin: ${props => props.theme.spacing.smallHorizontal};
`