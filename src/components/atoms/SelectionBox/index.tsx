import React, { ReactNode } from 'react';
import styled from 'styled-components/native';
import { THEME } from '../../../common/theme';
import { CheckedIcon } from '../Icons';
import { SvgProps } from 'react-native-svg';
import { H2, TextSecondary } from '../Text';

interface SelectionBoxProps {
  children?: ReactNode
  isActive: boolean
  onChange: (status: boolean) => void
  title: string
  description?: string
  Icon?: (props: SvgProps) => JSX.Element
  noFlex?: boolean
  a11yLabel?: string
}

export const SelectionBox = (props: SelectionBoxProps) => {
  const iconFill = props.isActive ? THEME.color.highlight : THEME.color.primary;

  return (
    <TouchableWrapper
      isActive={props.isActive}
      onPress={() => props.onChange(!props.isActive)}
      noFlex={props.noFlex}
      accessibilityLabel={props.a11yLabel}
      accessibilityRole="radiogroup"
      accessibilityState={{ selected: props.isActive }}
    >
      {props.Icon && (
        <IconContainer>
          <props.Icon
            fill={iconFill}
            {...CUSTOM_ICON_SIZE}
          />
        </IconContainer>
      )}
      <Title>{props.title}</Title>
      {props.description && (
        <Description>
          {props.description}
        </Description>
      )}
      {props.isActive && (
        <CheckedStyled
          fill={THEME.color.highlight}
          width={CHECKED_ICON_SIZE}
          height={CHECKED_ICON_SIZE}
        />
      )}
      {props.children}
    </TouchableWrapper>
  );
}

const CHECKED_ICON_SIZE = 16;

const CUSTOM_ICON_SIZE = {
  width: 45,
  height: 45
}

const TouchableWrapper = styled.TouchableOpacity<{
  isActive: boolean
  noFlex?: boolean
}>`
  padding: ${props => props.theme.spacing.tiny};
  position: relative;
  border-color: ${props => props.theme.color[props.isActive ? 'highlight' : 'tertiary']};
  border-width: 1px;
  align-items: center;
  margin: ${props => props.theme.spacing.base};
  width: 100%;
  flex: 1;
`

const Title = styled(H2)`
  margin: 10px 0 4px 0;
`

const IconContainer = styled.View`
  border-radius: 50px;
  background-color: ${props => props.theme.color.quinary};
  padding: 10px;
`

const CheckedStyled = styled(CheckedIcon)`
  position: absolute;
  right: ${-CHECKED_ICON_SIZE / 2}px;
  top: ${-CHECKED_ICON_SIZE / 2}px;
`

const Description = styled(TextSecondary)`
  text-align: center;
  margin-bottom: 5px;
`