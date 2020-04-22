import React, { useRef, useEffect } from 'react';
import styled from 'styled-components/native';
import { SceneRendererProps, Route } from 'react-native-tab-view';
import { ScrollView } from 'react-native';
import { TabButton } from './TabButton';

interface TabBarProps extends SceneRendererProps {
  routes: Route[]
  activeIndex: number
}

export const TabBar = (props: TabBarProps) => {
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const isFirstIndex = props.activeIndex === 0;
    const isLastIndex = props.activeIndex === props.routes.length - 1;

    if (isFirstIndex) {
      scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
    } else if (isLastIndex) {
      scrollViewRef.current?.scrollToEnd();
    }
  }, [props.activeIndex]);

  return (
    <Container>
      <ScrollView
        ref={scrollViewRef}
        showsHorizontalScrollIndicator={false}
        horizontal
      >
        {props.routes.map((route, index) => (
          <TabButton
            key={route.key}
            title={route.key}
            onPress={() => props.jumpTo(route.key)}
            isActive={index === props.activeIndex}
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