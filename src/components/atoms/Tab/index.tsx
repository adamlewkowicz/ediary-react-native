import React, { useState } from 'react';
import { Dimensions, ScrollView } from 'react-native';
import { TabView, SceneMap, SceneRendererProps } from 'react-native-tab-view';
import styled from 'styled-components/native';
import { TabButton } from './TabButton';

interface TabContainerProps {
  routes: { [key: string]: () => JSX.Element }
  activeIndex: number
  onIndexChange: (index: number) => void
}

export const TabContainer = (props: TabContainerProps) => {
  const [routes] = useState(() => 
    Object
      .keys(props.routes)
      .map(routeName => ({ key: routeName }))
  );

  const renderScene = SceneMap(props.routes);

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
      renderScene={renderScene}
      onIndexChange={props.onIndexChange}
      initialLayout={initialLayout}
      renderTabBar={renderTabBar}
      swipeEnabled
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