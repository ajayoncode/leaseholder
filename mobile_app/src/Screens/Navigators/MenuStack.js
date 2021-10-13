import React from "react";
import { Image, TouchableOpacity } from "react-native";
import { createAppContainer, createStackNavigator } from "react-navigation";
import { Images } from "Res";
//screens
import Routes from '../Routes';



const MenuStack = createAppContainer(
    createStackNavigator(
        {
            Menu: {
                screen: Routes.Menu,
                navigationOptions: ({ navigation, screenProps }) => ({
                    headerStyle: {
                        borderBottomWidth: 0,
                        backgroundColor: '#fff', elevation: 0

                    },
                    title: 'Settings',
                    headerBackTitle: null,
                    headerTitleStyle: {
                        flex: 1,
                        textAlign: 'center',
                        alignSelf: 'center',
                        fontWeight: '300',
                    },
                    headerRight: (
                        <TouchableOpacity style={{ paddingRight: 20 }} onPress={() => { screenProps.openSideMenu() }}>
                          <Image style={{ width: 25, height: 25, marginLeft: 8 ,tintColor:screenProps.colorTheme()}} source={Images.ic_menu} ></Image>
                        </TouchableOpacity>
                      ),
                })
            },

           
            
            ContactUs: {
                screen: Routes.ContactUs,
                navigationOptions: ({ navigation, screenProps }) => ({
                    headerStyle: {
                        borderBottomWidth: 0,
                        backgroundColor: '#fff', elevation: 0
                    },
                    title: 'Contact Us',

                    headerBackTitle: null,
                    headerTitleStyle: {
                        flex: .85,
                        textAlign: 'center',
                        alignSelf: 'center',
                        fontWeight: '300',
                    },
                })
            },
           



        }
    )
)
export default MenuStack


