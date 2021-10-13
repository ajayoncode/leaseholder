import { createSwitchNavigator, createAppContainer } from "react-navigation";

import AuthStack from './AuthStack';
import AuthLoading from './AuthLoading';
import TabStackContainer from './TabStack';

const RootStack = createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading:{
        screen:AuthLoading,
        navigationOptions:{
          header:null
        }
      },
      AuthStack:{
        screen:AuthStack,
        navigationOptions:{
          header:null
        }

      },
      TabStackContainer:{
        screen:TabStackContainer,
        navigationOptions:{
          header:null
          
        }
      }
    }
  )
)
export default RootStack;
