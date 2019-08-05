import { getStorybookUI, configure } from '@storybook/react-native';
import { IS_DEV } from '../src/common/consts';
// import requireContext from 'require-context.macro';

function loadStories() {
  // const req = require.context('./src/components', true, /\.story\.tsx$/);
  
  if (IS_DEV) {
    require('../src/components/ProductListItem/story');
  }
}

configure(loadStories, module);

export const StorybookUIRoot = getStorybookUI();