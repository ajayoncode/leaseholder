import React from "react";
import { Image, TouchableOpacity, Dimensions, View, Text } from "react-native";
import { createAppContainer, createStackNavigator } from "react-navigation";
import { Images, Colors, Fonts } from "Res";
import { ScreenRatio } from "../../Application/Utility/ScaleRatio";
const { width, height } = Dimensions.get('window');
const aspectRatio = height / width;


//screens
import Routes from '../Routes';


const HomeStack = createAppContainer(
  createStackNavigator(
    {
      Home: {
        screen: Routes.Home,
        navigationOptions: ({ navigation, screenProps }) =>
        // console.log(" sdhfjshdfjsdkfjshjdkfhjksdfhs *****************------------- "+JSON.stringify(screenProps))

        ({
          headerStyle: {
            borderBottomWidth: 0,
            height: 44,
            backgroundColor: '#fff', elevation: 0,
          },

          title: 'Home',
          headerBackTitle: null,
          headerTitleStyle: {
            flex: 1,
            textAlign: 'center',
            alignSelf: 'center',
            fontWeight: '300',
            color: 'black',
            fontSize: ScreenRatio(2.5),
          },

          headerRight: (
            <TouchableOpacity style={{ paddingRight: 20 }} onPress={() => { screenProps.openSideMenu() }}>
              <Image style={{ width: 25, height: 25, marginLeft: 8, tintColor: screenProps.colorTheme() }} source={Images.ic_menu} ></Image>
            </TouchableOpacity>
          ),

          headerLeft: (
            (screenProps.userPermissions.reportProblemEnabled === 1) && <TouchableOpacity style={{ paddingRight: 20 }} onPress={() => { screenProps.reporProblem() }}>

              <View style={{
                backgroundColor: screenProps.buttonBgColour, borderColor: screenProps.buttonBgColour, borderWidth: 1.5, borderRadius: ScreenRatio(1),
                marginRight: 5, paddingLeft: 5, paddingRight: 5, marginLeft: 5, marginTop: 2, alignItems: 'center', justifyContent: 'center', height: ScreenRatio(2)
              }}>
                <Text style={{ color: screenProps.buttonTextColour, fontSize: ScreenRatio(1.5), fontFamily: Fonts.SFProDisplayBold }}>Report a problem</Text>
              </View>

            </TouchableOpacity >
          ),


        })
      },

      Dictionary: {
        screen: Routes.Dictionary,
        navigationOptions: ({ navigation, screenProps }) => ({
          headerStyle: {
            borderBottomWidth: 0,
            height: 44,
            backgroundColor: '#fff', elevation: 0
          },
          title: 'Directory',
          headerTintColor: screenProps.primaryColour,
          headerBackTitle: null,
          headerTitleStyle: {
            textAlign: 'center',
            alignSelf: 'center',
            fontWeight: '300',
            fontSize: ScreenRatio(2.3),
          },
          // headerRight: (
          //   <TouchableOpacity style={{ paddingRight: 20 }} onPress={() => { screenProps.openSideMenu() }}>
          //     <Image style={{ width: 25, height: 25, marginLeft: 8, tintColor: screenProps.primaryColour }} source={Images.ic_menu} ></Image>
          //   </TouchableOpacity>
          // ),
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
            flex: .85,
            textAlign: 'center',
            alignSelf: 'center',
            fontWeight: '300',
            fontSize: 16,
          },
        })
      },
      ManageProfile: {
        screen: Routes.ManageProfile,
        navigationOptions: ({ navigation, screenProps }) => ({
          headerStyle: {
            borderBottomWidth: 0,
            height: 44,
            backgroundColor: '#fff', elevation: 0
          },
          title: 'Profile',
          headerTintColor: screenProps.primaryColour,
          headerBackTitle: null,
          headerTitleStyle: {
            flex: .85,
            color: 'black',
            textAlign: 'center',
            alignSelf: 'center',
            fontWeight: '300',
            fontSize: 16,
          },
          // headerRight: (
          //   <TouchableOpacity style={{ paddingRight: 20 }} onPress={() => { screenProps.openSideMenu() }}>
          //     <Image style={{ width: 25, height: 25, marginLeft: 8, tintColor: screenProps.primaryColour }} source={Images.ic_menu} ></Image>
          //   </TouchableOpacity>
          // ),
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
            flex: .85,
            textAlign: 'center',
            alignSelf: 'center',
            fontWeight: '300',
            fontSize: ScreenRatio(2),
          },
        })
      },

      Settings: {
        screen: Routes.Settings,
        navigationOptions: ({ navigation, screenProps }) => ({
          headerStyle: {
            borderBottomWidth: 0,
            height: 44,
            backgroundColor: '#fff', elevation: 0
          },
          title: 'Settings',

          headerBackTitle: null,
          headerTitleStyle: {
            textAlign: 'center',
            alignSelf: 'center',
            fontWeight: '300',
          },
        })
      },

      personalSettingScreen: {
        screen: Routes.PersonalSetting,
        navigationOptions: ({ navigation, screenProps }) => ({
          headerStyle: {
            borderBottomWidth: 0,
            height: 44,
            backgroundColor: '#fff', elevation: 0
          },
          title: 'Personal settings',
          headerBackTitle: null,
          headerTintColor: screenProps.primaryColour,
          headerTitleStyle: {
            flex: .85,
            textAlign: 'center',
            alignSelf: 'center',
            fontWeight: '300',
            color: 'black',
            fontSize: 16,
          },
          // headerRight: (
          //   <TouchableOpacity style={{ paddingRight: 20 }} onPress={() => { screenProps.openSideMenu() }}>
          //     <Image style={{ width: 25, height: 25, marginLeft: 8, tintColor: screenProps.primaryColour }} source={Images.ic_menu} ></Image>
          //   </TouchableOpacity>
          // ),
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
          title: 'Comment',

          headerBackTitle: null,
          headerTitleStyle: {
            textAlign: 'center',
            alignSelf: 'center',
            fontWeight: '300',
            fontSize: ScreenRatio(2.5),
          },
        })
      },

      ReportMessage: {
        screen: Routes.ReportMessage,
        height: 44,
        navigationOptions: ({ navigation, screenProps }) => ({
          headerStyle: {
            borderBottomWidth: 0,
            backgroundColor: '#fff', elevation: 0
          },
          title: 'REPORT THIS MESSAGE',
          headerTintColor: screenProps.primaryColour,
          headerBackTitle: null,
          headerTitleStyle: {
            textAlign: 'center',
            alignSelf: 'center',
            fontWeight: '300',
            fontSize: ScreenRatio(2.2),
          },
        })
      },

      PropertyDetail: {
        screen: Routes.PropertyDetail,
        height: 44,
        navigationOptions: ({ navigation, screenProps }) => ({
          headerStyle: {
            borderBottomWidth: 0,
            backgroundColor: '#fff', elevation: 0
          },
          title: 'Property Details',
          headerTintColor: screenProps.primaryColour,
          headerBackTitle: null,
          headerTitleStyle: {
            flex: .85,
            textAlign: 'center',
            alignSelf: 'center',
            fontWeight: '300',
            fontSize: ScreenRatio(2.3),
          },
        })
      },


      Notification: {
        screen: Routes.Notification,
        height: 44,
        navigationOptions: ({ navigation, screenProps }) => ({
          headerStyle: {
            borderBottomWidth: 0,
            backgroundColor: '#fff', elevation: 0
          },
          title: 'Notification',

          headerBackTitle: null,
          headerTitleStyle: {
            flex: .85,
            textAlign: 'center',
            alignSelf: 'center',
            fontWeight: '300',
            fontSize: 16
          },
        })
      },



    }
  )
)
export default HomeStack


