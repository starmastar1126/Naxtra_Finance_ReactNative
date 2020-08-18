/**
 * @format
 */

import {AppRegistry,YellowBox} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

console.disableYellowBox = true;

YellowBox.ignoreWarnings([
  "Warning: ViewPagerAndroid has been extracted",
])

AppRegistry.registerComponent(appName, () => App);
