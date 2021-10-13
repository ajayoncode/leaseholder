import React, { Component } from 'react';
import { View, NativeModules,Platform, Dimensions } from 'react-native';
import RootStack from './Navigators/RootStack';
import { Client } from 'bugsnag-react-native';

const SplashScreen = NativeModules.SplashScreen;
class Index extends Component {
  constructor(props) {
    super(props)
    this.state={
      width:Dimensions.get('window').width,
      height:Dimensions.get('window').height
    }

  }
  componentDidMount() {
    console.disableYellowBox = true;
    Dimensions.addEventListener('change',()=>{
      this.setState({width:Dimensions.get('window').width,height:Dimensions.get('window').height})
     })

    const bugsnag = new Client("4d269c6052f84f955e736bb3dcbaee9b");
    if(Platform.OS=='ios'){
      SplashScreen.hide();
    }
  }
  render() {

    return (
      <View style={{ height:this.state.height,width:this.state.width,flex:1 }}>
        <RootStack />
      </View>

    );
  }

}
export default Index;
