import { AppRegistry } from 'react-native';
// import { App } from './src/App';
import { name as appName } from './app.json';
import { ComponentsExample } from './src/components/ComponentsExample/ComponentsExample';

AppRegistry.registerComponent(appName, () => ComponentsExample);
