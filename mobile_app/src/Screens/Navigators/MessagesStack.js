import React from "react";
import { Image, TouchableOpacity, View, Text, Dimensions } from "react-native";
import { createAppContainer, createStackNavigator } from "react-navigation";
import { Images, Fonts, Colors } from "Res";
import { ScreenRatio } from "../../Application/Utility/ScaleRatio";
//screens
import Routes from '../Routes';

const { width, height } = Dimensions.get('window');
const aspectRatio = 2;


const MessagesStack = createAppContainer(
  createStackNavigator(
    {
      Home: {
        screen: Routes.Messages,
        navigationOptions: ({ navigation, screenProps }) => ({
          headerStyle: {
            borderBottomWidth: 0,
            shadowColor: 'transparent',
            height: 44,
            backgroundColor: '#fff', elevation: 0
          },

          title: 'Messages',
          headerBackTitle: null,
          headerTitleStyle: {
            flex: 1,
            textAlign: 'center',
            alignSelf: 'center',
            fontWeight: '300',
            fontSize: ScreenRatio(2.4),

          },
          headerRight: (
            <TouchableOpacity style={{ paddingRight: 20 }} onPress={() => { screenProps.openSideMenu() }}>
              <Image style={{ width: 25, height: 25, marginLeft: 8, tintColor: screenProps.primaryColour }} source={Images.ic_menu} ></Image>
            </TouchableOpacity>
          ),


        })
      },

      Comment: {
        screen: Routes.Comment,
        navigationOptions: ({ navigation, screenProps }) => ({
          headerStyle: {
            borderBottomWidth: 0,
            height: 44,
            backgroundColor: '#fff', elevation: 0
          },
          title: '',
          headerBackTitle: null,
          headerTitleStyle: {
            textAlign: 'center',
            alignSelf: 'center',
            fontWeight: '300',
            fontSize: 16,
          },

        })

      },

      ViewMessage: {
        screen: Routes.ViewMessage,
        navigationOptions: ({ navigation, screenProps }) => ({
          headerStyle: {
            borderBottomWidth: 0,
            height: 44,
            backgroundColor: '#fff', elevation: 0
          },
          title: 'Messages',
          headerBackTitle: null,
          headerTitleStyle: {
            textAlign: 'center',
            alignSelf: 'center',
            fontWeight: '300',
            fontSize: 16,
          },

        })

      },

      ReportProblem: {
        screen: Routes.ReportProblem,
        navigationOptions: ({ navigation, screenProps }) => ({
          headerStyle: {
            borderBottomWidth: 0,
            height: 44,
            backgroundColor: '#fff', elevation: 0
          },
          title: 'Report a Problem',
          headerTintColor: screenProps.primaryColour,
          headerBackTitle: null,
          headerTitleStyle: {
            textAlign: 'center',
            alignSelf: 'center',
            fontWeight: '300',
            fontSize: 16,
          },
        })
      },

      AddPost: {
        screen: Routes.AddPost,
        navigationOptions: ({ navigation, screenProps }) => ({
          headerStyle: {
            borderBottomWidth: 0,
            height: 44,
            backgroundColor: '#fff', elevation: 0
          },
          title: navigation.getParam('isEdit', false) ? "Edit Post" : "Add Post",
          headerTintColor:screenProps.primaryColour,
          headerBackTitle: null,
          headerTitleStyle: {
            textAlign: 'center',
            alignSelf: 'center',
            fontWeight: '300',
            fontSize: 16,
          },
        })
      },
      ReportMessage: {
        screen: Routes.ReportMessage,
        navigationOptions: ({ navigation, screenProps }) => ({
          headerStyle: {
            borderBottomWidth: 0,
            height: 44,
            backgroundColor: '#fff', elevation: 0
          },
          title: 'REPORT THIS MESSAGE',
          headerTintColor: screenProps.primaryColour,
          headerBackTitle: null,
          headerTitleStyle: {
            textAlign: 'center',
            alignSelf: 'center',
            fontWeight: '300',
            fontSize: 16,
          },
        })
      },


    }
  )
)
export default MessagesStack


