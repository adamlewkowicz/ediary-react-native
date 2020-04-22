import React from 'react';
import styled from 'styled-components/native';
import { BottomTabBarProps as NativeBottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BottomTabBarButton } from './BottomTabBarButton';
import CutleryIcon from '../../../../assets/img/cutlery.svg';
import NoteIcon from '../../../../assets/img/note.svg';
import { APP_ROUTE } from '../../../navigation/consts';

interface BottomTabBarProps extends NativeBottomTabBarProps {}

export const BottomTabBar = (props: BottomTabBarProps) => {

  const tabBarButtons = props.state.routes.map((route, index) => {
    const { options } = props.descriptors[route.key];
    const label = options.tabBarLabel ?? options.title ?? route.name;

    const isFocused = props.state.index === index;

    const handleOnPress = () => {
      const event = props.navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });
  
      if (!isFocused && !event.defaultPrevented) {
        props.navigation.navigate(route.name);
      }
    };
  
    const handleLongPress = () => {
      props.navigation.emit({
        type: 'tabLongPress',
        target: route.key,
      });
    };

    const Icon = (TAB_BAR_ICON as any)[route.name];
    const color = isFocused ? props.activeTintColor : props.inactiveTintColor;

    return (
      <BottomTabBarButton
        key={route.key}
        accessibilityLabel={options.tabBarAccessibilityLabel}
        onPress={handleOnPress}
        onLongPress={handleLongPress}
        Icon={Icon}
        isFocused={isFocused}
        testID={options.tabBarTestID}
        label={label}
        color={color}
      />
    );
  });

  return (
    <Container>
      {tabBarButtons}
    </Container>
  );
}

const Container = styled.View`
  height: 60px;
  border-top-width: 1px;
  border-top-color: ${props => props.theme.color.quaternary};
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
`

const TAB_BAR_ICON = {
  [APP_ROUTE.NutritionStack]: CutleryIcon,
  [APP_ROUTE.DiarySummary]: NoteIcon,
};