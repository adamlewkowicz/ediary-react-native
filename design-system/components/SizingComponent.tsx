import * as React from 'react';
import { Component, View, Text, StyleSheet } from 'react-figma';
import { capitalize } from '../frames/ColorFrame';

interface SizingComponentProps {
  name: string
  size: number
}

export const SizingComponent = (props: SizingComponentProps) => {
  const componentName = `Spacing${capitalize(props.name)}`;

  return (
    <>
      <Component name={componentName} style={styles.component}>
        <View style={[styles.sizingBlock, { width: props.size, height: props.size }]} />
      </Component>
      <Text style={styles.sizingDescription}>
        {props.name}
      </Text>
      <Text style={styles.hint}>{`${props.size}px`}</Text>
    </>
  );
}

const styles = StyleSheet.create({
  component: {
    marginTop: 10
  },
  sizingBlock: {
    backgroundColor: '#C4C4C4'
  },
  sizingDescription: {
    fontSize: 8,
    marginTop: 4,
    color: '#000'
  },
  hint: {
    fontSize: 6,
    marginTop: 2,
    color: '#a0a0a0'
  },
});