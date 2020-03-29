import * as React from 'react';
import { Component, Text, StyleSheet } from 'react-figma';
import { theme, THEME } from '../../src/common/theme';

interface TypeComponentProps {
  name: string
  color?: string
  fontWeight?: string
  fontSize: number
}

export const TypeComponent = (props: TypeComponentProps) => {
  const fontSizeText = `${props.fontSize}px`;
  const formattedName = props.name.split(/(?=[A-Z])/).join(' ');

  const {
    color = THEME.color.primary,
    fontWeight = 'regular',
  } = props;

  return (
    <>
      <Component
        name={props.name}
        style={{ marginTop: 10 }}
      >
        <Text
          name={props.name}
          style={{
            fontSize: props.fontSize,
            fontFamily: theme.fontWeight.base,
            fontWeight,
            color,
          }}
        >
          {formattedName}
        </Text>
      </Component>
      <Text style={styles.hint}>
        {fontSizeText}
      </Text>
    </>
  );
}

const styles = StyleSheet.create({
  hint: {
    fontSize: 6,
    marginTop: 2,
    color: '#a0a0a0'
  },
});