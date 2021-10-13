
import React, { Component } from "react";
import { Button, Image, TouchableOpacity, Dimensions,Text,View } from "react-native"
import { createAppContainer, createStackNavigator } from "react-navigation";
import { Images ,Colors,Fonts} from "Res";
import Routes from '../Routes';

const { width, height } = Dimensions.get('window');
const aspectRatio = height / width;
const AuthStack = createAppContainer(
  createStackNavigator(
    {
      Login: {
        screen: Routes.Login,
        navigationOptions: {
          header: null
        },

      },
      Register: {
        screen: Routes.Register,
        navigationOptions: ({ navigation, screenProps }) => ({
          headerStyle: {
            borderBottomWidth: 0,
            height: aspectRatio > 1.6 ? 44 : 80,
            backgroundColor: '#fff', elevation: 0
          },
          headerLeft: (
            <TouchableOpacity onPress={() => { navigation.goBack() }}>
            <Image style={{ width: 25, height: 25, marginLeft: 10, marginTop: 25 }} source={Images.ic_back} ></Image>
        </TouchableOpacity>
          )
        }),

      },

      ForgotPassword: {
        screen: Routes.ForgotPassword,
        navigationOptions: ({ navigation, screenProps }) => ({
          headerStyle: {
            borderBottomWidth: 0,
            height: aspectRatio > 1.6 ? 44 : 80,
            backgroundColor: '#fff', elevation: 0
          },
          headerLeft: (
            <TouchableOpacity onPress={() => { navigation.goBack() }}>
            <Image style={{ width: 25, height: 25, marginLeft: 10, marginTop: 25 }} source={Images.ic_back} ></Image>
        </TouchableOpacity>
          )
        }),

      },

      AgentScreens: {
        screen: Routes.AgentScreens,
        navigationOptions: {
          header: null
        }
      },
      BlockScreen: {
        screen: Routes.BlockScreen,
        navigationOptions: {
          header: null
        }
      },

      TermsAndCondition: {
        screen: Routes.TermsAndCondition,
        navigationOptions: {
          header: null
        }
      },

    }
  )
)
export default AuthStack


