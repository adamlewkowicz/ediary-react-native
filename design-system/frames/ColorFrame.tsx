import * as React from 'react';
import { FrameContainer } from '../components/FrameContainer';
import { THEME } from '../../src/common/theme';
import { Component, View, Text } from 'react-figma';

export const capitalize = (value: string) => value[0].toUpperCase() + value.substr(1, value.length);

interface ColorFrameProps {

}

export const ColorFrame = (props: ColorFrameProps) => {
  return (
    <FrameContainer title="Color">
      {Object.entries(THEME.color).map(([name, color]) => (
        <Component
          key={color}
          name={`Color${capitalize(name)}`}
          style={{ marginBottom: 10 }}
        >
          <View
            style={{
              width: 50,
              height: 50,
              backgroundColor: color
            }}
          />
          <Text>{capitalize(name)}</Text>
        </Component>
      ))}
    </FrameContainer>
  );
}