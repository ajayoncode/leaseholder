import React from "react";
import { Image, TouchableOpacity ,Dimensions} from "react-native";
import { createAppContainer, createStackNavigator } from "react-navigation";
import { Images } from "Res";
import { ScreenRatio } from "../../Application/Utility/ScaleRatio";
//screens
import Routes from '../Routes';
const { width, height } = Dimensions.get('window');
const aspectRatio = 2;

const ContactusStack = createAppContainer(
  createStackNavigator(
    {
      Documents: {
        screen: Routes.ContactUs,
        navigationOptions: ({ navigation, screenProps }) => ({
          headerStyle: {
            borderBottomWidth: 0,
            height:aspectRatio>1.6?44:80,
            backgroundColor: '#fff', elevation: 0
          },
          title: 'Contact us',
          headerBackTitle: null,
          headerTitleStyle: {
            flex: 1,
            textAlign: 'center',
            alignSelf: 'center',
            fontWeight: aspectRatio>1.6?'300':'400',
            fontSize:ScreenRatio(2.3),
            color: 'black',
          },
          headerRight: (
            <TouchableOpacity style={{ paddingRight: 20 }} onPress={() => { screenProps.openSideMenu() }}>
              <Image style={{ width: aspectRatio>1.6?25:40, height: aspectRatio>1.6?25:40, marginLeft: 8,tintColor:screenProps.colorTheme() }} source={Images.ic_menu} ></Image>
            </TouchableOpacity>
          ),
        })
      },
    }
  )
)
export default ContactusStack


