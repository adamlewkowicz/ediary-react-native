import 'core-js/features/array/flat-map';
import 'core-js/features/object/from-entries';
import { AppRegistry } from 'react-native';
import { App } from './src/App';
import { name as appName } from './app.json';
import dayjs from 'dayjs';
import 'dayjs/locale/pl';
import 'intl';
import 'intl/locale-data/jsonp/pl-PL';

dayjs.locale('pl');

AppRegistry.registerComponent(appName, () => App);