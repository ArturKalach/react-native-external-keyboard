import { AppRegistry } from 'react-native';
import { App } from './src/App';
import { name as appName } from './app.json';

import { Keyboard } from 'react-native-external-keyboard';

// Keyboard.configure({ uniqueGroupIdentifier: true });

AppRegistry.registerComponent(appName, () => App);
