import React from 'react';
import styled from 'styled-components/native'
import { TouchableOpacityProps, ActivityIndicator } from 'react-native';
import { Text } from '../Text';
import { SvgProps } from 'react-native-svg';
import { THEME } from '../../../common/theme';

export interface ButtonProps extends TouchableOpacityProps, VariantProp {
  children: string
  isLoading?: boolean
  role?: 'button' | 'link'
  Icon?: (props: SvgProps) => JSX.Element
}

export const Button = (props: ButtonProps) => {
  const {
    children,
    isLoading,
    role = 'button',
    variant,
    onPress,
    Icon,
  } = props;

  return (
    <Container
      variant={variant}
      accessibilityRole={role}
      accessibilityState={{ disabled: isLoading }}
      accessibilityLabel={props.accessibilityLabel ?? children}
      onPress={isLoading ? undefined : onPress}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator
          color={THEME.color.primaryLight}
          accessibilityLabel="Trwa ładowanie"
        />
      ) : (
        <>
          <Title variant={variant}>{children}</Title>
          {Icon && <Icon {...ICON_PROPS}  />}
        </>
      )}
    </Container>
  );
}

const Container = styled.TouchableOpacity<VariantProp>`
  background-color: ${props => props.theme.color[props.variant === 'primary' ? 'highlight' : 'primaryLight']};
  border: 1px solid ${props => props.theme.color[props.variant === 'primary' ? 'primaryLight' : 'highlight']};
  padding: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

const Title = styled(Text)<VariantProp>`
  text-align: center;
  color: ${props => props.theme.color[props.variant === 'primary' ? 'primaryLight' : 'primary']};
`

const ICON_PROPS = {
  width: 16,
  height: 16,
  fill: THEME.color.primary,
  style: { marginLeft: THEME.spacingRaw.tiny }
} as const;

type Variant = 'primary' | 'secondary';

interface VariantProp {
  variant?: Variant
};
