import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Constant } from "Res";

import * as SessionManager from '../../Application/Utility/CustomManagers/SessionManager';

export default class AuthLoading extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    SessionManager.getLoginUserData().then((userInfo) => {
      if (userInfo) {
        var userInfo1 = JSON.parse(userInfo);
        var loginInfo = {};


        SessionManager.getPreferenceData(Constant.sessionKey_IsRemeber).then((loginInfo) => {
          if (loginInfo) {
            loginInfo = JSON.parse(loginInfo);
          }
        }
        )

        if (userInfo1.loginStatus == "LOGIN" && loginInfo.isRemember) {
          this.props.navigation.navigate("TabStackContainer")
        } else {
          this.props.navigation.navigate("AuthStack")
        }
      } else {
        this.props.navigation.navigate("AuthStack")
      }
    });
  }

  render() {
    return (
      <View>
        <Text> AuthLoading </Text>
      </View>
    );
  }
}
