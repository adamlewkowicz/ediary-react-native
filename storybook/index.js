import { getStorybookUI, configure } from '@storybook/react-native';
import { IS_DEV } from '../src/common/consts';
// import requireContext from 'require-context.macro';

function loadStories() {
  // const req = require.context('./src/components', true, /\.story\.tsx$/);
  
  if (IS_DEV) {
    require('../src/_components/molecules/SelectionBox/story');
    require('../src/_components/molecules/InputSearcher/story');
  }
}

configure(loadStories, module);

export const StorybookUIRoot = getStorybookUI();