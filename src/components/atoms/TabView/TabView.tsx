import React, { ReactNode, useMemo } from 'react';
import { Dimensions } from 'react-native';
import { TabView as NativeTabView, Route } from 'react-native-tab-view';
import { TabBar } from './TabBar';

interface TabViewProps {
  activeIndex: number
  onIndexChange: (index: number) => void
  titles: string[]
  renderScene: (props: { route: Route & { index: number } }) => ReactNode
}

export const TabView = (props: TabViewProps) => {
  const routes = useMemo(() => {
    return props.titles.map((title, index) => ({
      key: title,
      title,
      index
    }));
  }, []);

  return (
    <NativeTabView
      navigationState={{ index: props.activeIndex, routes }}
      renderScene={props.renderScene}
      onIndexChange={props.onIndexChange}
      initialLayout={initialLayout}
      swipeEnabled
      lazy
      renderTabBar={tabBarProps => (
        <TabBar 
          activeIndex={props.activeIndex}
          routes={routes}
          {...tabBarProps}
        />
      )}
    />
  );
}

const initialLayout = { width: Dimensions.get('window').width };