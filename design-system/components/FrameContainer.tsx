import * as React from 'react';
import { Frame, StyleSheet } from 'react-figma';

interface FrameContainerProps {
  style?: any
  title: string
  children: React.ReactNode
}

export const FrameContainer = (props: FrameContainerProps) => {
  return (
    <Frame name={props.title} style={[styles.frame, props.style]}>
      {props.children}
    </Frame>
  );
}

const styles = StyleSheet.create({
  frame: {
    padding: 10,
    marginLeft: 50
  }
});