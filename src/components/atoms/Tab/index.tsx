import * as React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { TabView, SceneMap, SceneRendererProps } from 'react-native-tab-view';
import styled from 'styled-components/native';
import { TabButton } from './TabButton';

const initialLayout = { width: Dimensions.get('window').width };

interface TabContainerProps {
  children: React.ReactNodeArray
  routes: any[]
}

export const TabContainer = (props: TabContainerProps) => {
  const [activeIndex, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'Ostatnio używane' },
    { key: 'second', title: 'Znalezione' },
  ]);

  const renderScene = SceneMap({
    first: () => props.routes[0],
    second: () => props.routes[1],
  });

  const renderTabBar = (props: SceneRendererProps) => {
    return (
      <TabBarContainer>
        {routes.map((route, index) => (
          <TabButton
            key={route.key}
            title={route.title}
            onPress={() => props.jumpTo(route.key)}
            isActive={index === activeIndex}
          />
        ))}
      </TabBarContainer>
    );
  }

  return (
    <TabView
      navigationState={{ index: activeIndex, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
      renderTabBar={renderTabBar}
      swipeEnabled
    />
  );
}

const TabBarContainer = styled.View`
  flex-direction: row;
  justify-content: space-evenly;
  border-bottom-color: ${props => props.theme.color.tertiary};
  border-bottom-width: 1px;
`