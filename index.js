// @ts-check
import 'core-js/features/array/flat-map';
import 'core-js/features/object/from-entries';
import { AppRegistry, UIManager, Platform } from 'react-native';
import { App } from './src/App';
import { name as appName } from './app.json';
import 'intl';
import 'intl/locale-data/jsonp/pl-PL';
import * as Utils from './src/utils';

ErrorUtils.setGlobalHandler(Utils.handleError);

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

AppRegistry.registerComponent(appName, () => App);