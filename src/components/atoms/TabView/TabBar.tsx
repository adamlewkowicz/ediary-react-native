import React, { useRef, useEffect } from 'react';
import styled from 'styled-components/native';
import { SceneRendererProps } from 'react-native-tab-view';
import { ScrollView, View, findNodeHandle } from 'react-native';
import { TabBarButton } from './TabBarButton';
import { Route } from './TabView';
import { useRefs } from '../../../hooks/use-refs';

interface TabBarProps extends SceneRendererProps {
  routes: Route[]
  activeIndex: number
}

export const TabBar = (props: TabBarProps) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const buttonRefs = useRefs<View>(props.routes.length);

  const scrollToIndex = (index: number) => {
    const node = buttonRefs[index].current;
    const position = findNodeHandle(node);

    if (position) {
      scrollViewRef.current?.scrollTo({
        x: 0,
        y: position,
        animated: true,
      });
    }
  }

  useEffect(() => {
    scrollToIndex(props.activeIndex);
  }, [props.activeIndex]);

  return (
    <Container>
      <ScrollView
        ref={scrollViewRef}
        showsHorizontalScrollIndicator={false}
        horizontal
      >
        {props.routes.map((route, index) => (
          <TabBarButton
            ref={buttonRefs[index]}
            key={route.key}
            title={route.key}
            onPress={() => props.jumpTo(route.key)}
            isActive={index === props.activeIndex}
            accessibilityLabel={route.title}
          />
        ))}
      </ScrollView>
    </Container>
  );
}

const Container = styled.View`
  flex-direction: row;
  border-bottom-color: ${props => props.theme.color.tertiary};
  border-bottom-width: 1px;
  margin-top: ${props => props.theme.spacing.tiny};
`