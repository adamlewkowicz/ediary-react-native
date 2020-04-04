import * as React from 'react';
import { Page } from 'react-figma';
import { ColorFrame } from '../frames/ColorFrame';
import { TypeFrame } from '../frames/TypeFrame';
import { SizingFrame } from '../frames/SizingFrame';

export const App = () => {
  React.useEffect(() => {
    setTimeout(figma.closePlugin, 2 * 1000);
  }, []);

  return (
    <Page name="Design system" style={{ flexDirection: 'row' }}>
      <SizingFrame />
      <TypeFrame />
      <ColorFrame />
    </Page>
  );
}