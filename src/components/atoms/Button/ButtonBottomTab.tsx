import React, { ReactNode } from 'react';
import styled from 'styled-components/native';
import { TouchableOpacityProps } from 'react-native';
import { SvgProps } from 'react-native-svg';

interface ButtonBottomTabProps extends TouchableOpacityProps {
  Icon: React.ComponentClass<SvgProps, any>
  size?: number
  fill?: string
  isFocused?: boolean
  label?: ReactNode
  color?: string
}

export const ButtonBottomTab = (props: ButtonBottomTabProps) => {
  const { size = 24, fill, Icon, color, ...btnProps } = props;

  return (
    <Container
      accessibilityRole="button"
      accessibilityState={{ selected: props.isFocused }}
      {...btnProps}
    >
      <Icon
        width={size}
        height={size}
        fill="#000"
        currentColor="#000"
      />
    </Container>
  );
}

const Container = styled.TouchableOpacity`
  width: 42px;
  height: 42px;
  align-items: center;
  justify-content: center;
`