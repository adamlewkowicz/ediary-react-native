// @ts-check
import 'core-js/features/array/flat-map';
import 'core-js/features/object/from-entries';
import { AppRegistry, UIManager, Platform } from 'react-native';
import { App } from './src/App';
import dayjs from 'dayjs';
import 'dayjs/locale/pl';
import 'intl';
import 'intl/locale-data/jsonp/pl-PL';
import * as Utils from './src/utils';
import { APP_NAME } from './src/common/consts';

if (!__DEV__) {
  ErrorUtils.setGlobalHandler(Utils.handleError);
}

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

dayjs.locale('pl');

AppRegistry.registerComponent(APP_NAME, () => App);