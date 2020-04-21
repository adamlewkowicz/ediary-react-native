import React, { ReactNode } from 'react';
import styled from 'styled-components/native';
import { TouchableOpacityProps } from 'react-native';
import { SvgProps } from 'react-native-svg';

interface ButtonIconProps extends TouchableOpacityProps {
  Icon: React.ComponentClass<SvgProps, any>
  size: number
  fill?: string
}

export const ButtonIcon = (props: ButtonIconProps) => {
  const { size, fill, Icon, ...btnProps } = props;
  return (
    <Container {...btnProps}>
      <Icon width={props.size} />
    </Container>
  );
}

const Container = styled.View`
  width: 42px;
  height: 42px;
`