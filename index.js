import { AppRegistry } from 'react-native';
import { App } from './src/App';
import { name as appName } from './app.json';
import dayjs from 'dayjs';
import 'dayjs/locale/pl';

dayjs.locale('pl');

AppRegistry.registerComponent(appName, () => App);