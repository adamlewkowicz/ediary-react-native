import React, { useState, ReactNode } from 'react';
import { Dimensions, ScrollView } from 'react-native';
import { TabView, SceneMap, SceneRendererProps } from 'react-native-tab-view';
import styled from 'styled-components/native';
import { TabButton } from './TabButton';
import { Text } from '../Text';

interface TabContainerProps<T> {
  routes?: { [key: string]: () => JSX.Element }
  routeNames: T[]
  activeIndex: number
  onIndexChange: (index: number) => void
  renderScene: (props: { route: { key: T }}) => ReactNode
}

export const TabContainer = <T extends string>(props: TabContainerProps<T>) => {
  const [routes] = useState(() => 
    props.routeNames.map(routeName => ({ key: routeName }))
  );

  const renderTabBar = (_props: SceneRendererProps) => {
    return (
      <TabBarContainer>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {routes.map((route, index) => (
            <TabButton
              key={route.key}
              title={route.key}
              onPress={() => _props.jumpTo(route.key)}
              isActive={index === props.activeIndex}
            />
          ))}
        </ScrollView>
      </TabBarContainer>
    );
  }

  return (
    <TabView
      navigationState={{ index: props.activeIndex, routes }}
      renderScene={props.renderScene}
      onIndexChange={props.onIndexChange}
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
  padding: ${props => props.theme.spacing.smallHorizontal};
  margin-top: ${props => props.theme.spacing.tiny};
`