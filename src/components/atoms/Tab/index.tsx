import React, { useState, ReactNode, useRef, useEffect } from 'react';
import { Dimensions, ScrollView } from 'react-native';
import { TabView, SceneRendererProps } from 'react-native-tab-view';
import styled from 'styled-components/native';
import { TabButton } from './TabButton';
import { Text } from '../Text';

interface TabContainerProps<T, X extends { [key: string]: ReactNode }> {
  routes: X
  activeRoute: keyof X
  onRouteChange?: (route: keyof X) => void
}

export const TabContainer = <T extends string, X extends { [key: string]: ReactNode }>(props: TabContainerProps<T, X>) => {
  const [routes] = useState(() => 
    Object
      .keys(props.routes)
      .map((routeName: keyof X) => ({ key: routeName }))
  );
  const routeIndexMap = Object.fromEntries(
    Object
      .keys(props.routes)
      .map((routeName, index) => [routeName, index])
  );
  const scrollViewRef = useRef<ScrollView>(null);

  const activeIndex = routeIndexMap[props.activeRoute];

  const renderScene = () => props.routes[props.activeRoute];

  const handleIndexChange = (index: number) => {
    const result = routes.find((_, routeIndex) => routeIndex === index);

    if (result) {
      props.onRouteChange?.(result.key);
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      if (activeIndex === routes.length - 1) {
        scrollViewRef.current?.scrollToEnd();
      } else if (activeIndex === 0) {
        scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
      }
    }

    handleScroll();
  }, [activeIndex]);

  const renderTabBar = (_props: SceneRendererProps) => {
    return (
      <TabBarContainer>
        <ScrollView
          ref={scrollViewRef}
          showsHorizontalScrollIndicator={false}
          horizontal
        >
          {routes.map((route, index) => (
            <TabButton
              key={route.key}
              title={route.key}
              onPress={() => {
                _props.jumpTo(route.key);
              }}
              isActive={index === activeIndex}
            />
          ))}
        </ScrollView>
      </TabBarContainer>
    );
  }

  return (
    <TabView
      navigationState={{ index: activeIndex, routes: routes }}
      renderScene={renderScene}
      onIndexChange={handleIndexChange}
      initialLayout={initialLayout}
      renderTabBar={renderTabBar}
      swipeEnabled
      lazy
      renderLazyPlaceholder={() => (
        <Text>Loading</Text>
      )}
    />
  );
}

const initialLayout = { width: Dimensions.get('window').width };

const TabBarContainer = styled.View`
  flex-direction: row;
  border-bottom-color: ${props => props.theme.color.tertiary};
  border-bottom-width: 1px;
  /* padding: ${props => props.theme.spacing.smallHorizontal}; */
  margin-top: ${props => props.theme.spacing.tiny};
`