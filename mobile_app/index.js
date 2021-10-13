import 'react-native-gesture-handler'
import { AppRegistry } from 'react-native';
import Index from './src/Screens'
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => Index);