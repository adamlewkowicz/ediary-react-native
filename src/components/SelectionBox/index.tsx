import React, { ReactNode } from 'react';
import styled from 'styled-components/native';
import { theme } from '../../common/theme';
import { CheckedIcon } from '../Icons';
import { TouchableOpacityProps } from 'react-native';

interface SelectionBoxProps {
  children?: ReactNode
  value: boolean
  onChange: (status: boolean) => void
  title: string
  description?: string
  icon?: JSX.Element
  onPress?: TouchableOpacityProps['onPress']
  noFlex?: boolean
}

export const SelectionBox = (props: SelectionBoxProps) => {
  return (
    <TouchableWrapper
      isActive={props.value}
      onPress={() => props.onChange && props.onChange(!props.value)}
      noFlex={props.noFlex}
    >
      <IconContainer>
        {props.icon}
      </IconContainer>
      <Title>{props.title}</Title>
      {props.description && (
        <Description>{props.description}</Description>
      )}
      {props.value && (
        <CheckedStyled
          fill={theme.color.focus}
          width={CHECKED_ICON_SIZE}
          height={CHECKED_ICON_SIZE}
        />
      )}
      {props.children}
    </TouchableWrapper>
  );
}

const CHECKED_ICON_SIZE = 16;

const TouchableWrapper = styled.TouchableOpacity<{
  isActive: boolean
  noFlex?: boolean
}>`
  border-radius: 5px;
  padding: 10px;
  position: relative;
  border-color: ${props => props.theme.color[props.isActive ? 'focus' : 'secondary']};
  border-width: 1px;
  align-items: center;
  margin: 20px;
  width: 100%;
  flex: 1;
`

const Title = styled.Text`
  font-size: 16px;
  font-family: DMSans-Medium;
  margin: 10px 0;
`

const IconContainer = styled.View`
  border-radius: 50;
  background-color: rgba(141, 152, 252, .1);
  padding: 10px;
`

const CheckedStyled = styled(CheckedIcon)`
  position: absolute;
  right: ${-CHECKED_ICON_SIZE / 2};
  top: ${-CHECKED_ICON_SIZE / 2};
`

const Description = styled.Text`
  font-family: ${props => props.theme.fontWeight.regular};
  text-align: center;
  margin: 5px 0;
`