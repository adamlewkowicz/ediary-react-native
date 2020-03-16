import * as React from 'react';
import { Frame, Page, View, Text, Component, StyleSheet } from 'react-figma';
import { ColorFrame } from '../frames/ColorFrame';
import { TypeFrame } from '../frames/TypeFrame';

const styles = StyleSheet.create({
    frame: {
        padding: 10
    },
    component: {
        marginTop: 10
    },
    sizingBlock: {
        backgroundColor: '#C4C4C4'
    },
    icon: {
        width: 16,
        height: 16,
        backgroundColor: '#ffffff',
        backgroundSize: 'contain'
    },
    sizingDescription: {
        fontSize: 8,
        marginTop: 4
    },
    hint: {
        fontSize: 6,
        marginTop: 2,
        color: '#a0a0a0'
    },
    heading: {
        fontFamily: 'Helvetica Neue',
        fontWeight: 'bold',
        fontStyle: 'italic',
        fontSize: 14
    }
});

const SpaceFrame = () => {
    return (
        <Frame name="Space" style={styles.frame}>
            <Text style={styles.heading}>Space</Text>

            <Component name="SizingXSmall" style={styles.component}>
                <View style={[styles.sizingBlock, { width: 8, height: 8 }]} />
            </Component>
            <Text style={styles.sizingDescription}>X-Small D</Text>
            <Text style={styles.hint}>8px</Text>

            <Component name="SizingSmall" style={styles.component}>
                <View style={[styles.sizingBlock, { width: 16, height: 16 }]} />
            </Component>
            <Text style={styles.sizingDescription}>Small</Text>
            <Text style={styles.hint}>16px</Text>

            <Component name="SizingMedium" style={styles.component}>
                <View style={[styles.sizingBlock, { width: 24, height: 24 }]} />
            </Component>
            <Text style={styles.sizingDescription}>Medium</Text>
            <Text style={styles.hint}>24px</Text>

            <Component name="SizingLarge" style={styles.component}>
                <View style={[styles.sizingBlock, { width: 44, height: 44 }]} />
            </Component>
            <Text style={styles.sizingDescription}>Large</Text>
            <Text style={styles.hint}>44px</Text>

            <Component name="SizingXLarge" style={styles.component}>
                <View style={[styles.sizingBlock, { width: 64, height: 64 }]} />
            </Component>
            <Text style={styles.sizingDescription}>X-Large</Text>
            <Text style={styles.hint}>64px</Text>
        </Frame>
    );
};

export const App = () => {
  React.useEffect(() => {
    setTimeout(figma.closePlugin, 2 * 1000);
  }, []);

  return (
    <Page name="Design system" style={{ flexDirection: 'row' }}>
      <SpaceFrame />
      <TypeFrame />
      <ColorFrame />
    </Page>
  );
}