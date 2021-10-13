import React, { Component } from "react";
import { View, Image, TouchableOpacity, Linking, Text, Dimensions, Platform } from "react-native";
import { createAppContainer, createBottomTabNavigator } from "react-navigation";
import { Colors, Images, Strings } from "Res";
//screens
import Routes from '../Routes';
import HomeStack from './HomeStack';
import MyAccountStack from './MyAccountStack';
import MessagesStack from './MessagesStack';
import DocumentsStack from './DocumentsStack';
import ContactusStack from './ContactusStack';
import MenuStack from './MenuStack';
import ReportProblemStack from './ReportProblemStack';
import { Spinner } from 'CustomComponent';

import * as SessionManager from '../../Application/Utility/CustomManagers/SessionManager';
const { width, height } = Dimensions.get('window');
const aspectRatio = height / width;

import SideMenu from '../Routes/SideMenu/SideMenu'
import CustomeDialog from '../Routes/CustomeDialog/CustomeDialog'
import { WebApi, WebConstant } from "NetworkHelper";


// create tabar icon
// const homeTabIcon = ({ tintColor }) => getBottomView(tintColor, Images.home_unselected, Images.home_selected);
// const myAccountTabIcon = ({ tintColor }) => getBottomView(tintColor, Images.my_account_unselected, Images.my_account_selected);
// const messageTabIcon = ({ tintColor }) => getBottomView(tintColor, Images.message_unselected, Images.message_selected);
// const documentTabIcon = ({ tintColor }) => getBottomView(tintColor, Images.documents_unselected, Images.documents_selected);
// const contactTabIcon = ({ tintColor }) => getBottomView(tintColor, Images.contact_unselected, Images.contact_selected);

class BottomView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tintColor: props.tintColor,
      unSelectedImage: props.unSelectedImage,
      selectedImage: props.selectedImage,
      tabName: props.tabName,
      primaryColor: Colors.btn_color_orange,
    }
  }
  componentDidMount() {
    SessionManager.getBranding().then((branding) => {
      if (branding) {
        var appBranding = JSON.parse(branding);


        this.setState({
          primaryColor: appBranding.primaryColour,
          buttonBgColour: appBranding.buttonBgColour,
          buttonTextColour: appBranding.buttonTextColour,
          textColour: appBranding.textColour,
          footerBgColour: appBranding.footerBgColour,
          footerTextColour: appBranding.footerTextColour,
          agentLogo: appBranding.agentLogo,
        });
      }
    });




  }
  render() {

    return (
      <View style={{ flex: 1, width: 105, marginTop:  0 }} >
        <Image style={{
          width: 30, height: 30, alignSelf: 'center',
          tintColor: (this.props.tintColor === Colors.white) ? this.state.primaryColor : this.state.textColour
        }}
          source={(this.props.tintColor != Colors.white) ? this.props.unSelectedImage : this.props.selectedImage} />
        <Text style={{ textAlign: 'center', fontSize:10, color: (this.props.tintColor != Colors.white) ? this.state.textColour : this.state.primaryColor, }}>{this.props.tabName}</Text>
      </View>
    );
  }
}
const menuTabIcon = ({ tintColor }) => getBottomView(tintColor, Images.settings_unselected, Images.settings_selected);

const homeTabIcon = ({ tintColor }) => (<View style={{ flex: 1, }}><BottomView tintColor={tintColor}
  selectedImage={Images.home_selected} unSelectedImage={Images.home_unselected}
  tabName={Strings.tabBarHome} /></View>);


const myAccountTabIcon = ({ tintColor }) => (<View style={{ flex: 1, }}><BottomView tintColor={tintColor}
  selectedImage={Images.my_account_selected} unSelectedImage={Images.my_account_unselected}
  tabName={Strings.tabBarMyAccount} /></View>);



const messageTabIcon = ({ tintColor }) => (<View style={{ flex: 1, }}><BottomView tintColor={tintColor}
  selectedImage={Images.message_selected} unSelectedImage={Images.message_unselected}
  tabName={Strings.tabBarMessages} /></View>);


const documentTabIcon = ({ tintColor }) => (<View style={{ flex: 1, }}><BottomView tintColor={tintColor}
  selectedImage={Images.documents_selected} unSelectedImage={Images.documents_unselected}
  tabName={Strings.tabBarDocuments} /></View>);


const contactTabIcon = ({ tintColor }) => (<View style={{ flex: 1, }}><BottomView tintColor={tintColor}
  selectedImage={Images.contact_selected} unSelectedImage={Images.contact_unselected}
  tabName={Strings.tabBarContact} /></View>);


const getBottomView = (tintColor, unSelectedImage, selectedImage,) => (
  <View style={{ marginTop: 0 }} hitSlop={{ top: 10, bottom: 10, right: 10, left: 10 }}>
    <Image style={{
      width: 30, height: 30, alignSelf: 'center',
      tintColor: (tintColor == Colors.tabBarDeselect) ? Colors.tabBarDeselect : ""
    }}
      source={(tintColor == Colors.black) ? unSelectedImage : selectedImage}
    />
  </View>
);





const TabStack = createAppContainer(
  createBottomTabNavigator(
    {

      HomeStack: {
        screen: HomeStack,
        navigationOptions: {
          header: null,
          tabBarIcon: homeTabIcon,


        }
      },

      MyAccountStack: {
        screen: MyAccountStack,
        navigationOptions: ({ navigation, screenProps }) => ({
          header: null,
          tabBarIcon: myAccountTabIcon,

        })
      },
      MessagesStack: {
        screen: MessagesStack,
        navigationOptions: {
          header: null,
          tabBarIcon: messageTabIcon,
        }
      },
      DocumentsStack: {
        screen: DocumentsStack,
        navigationOptions: {
          header: null,
          tabBarIcon: documentTabIcon,
        }
      },

      ContactusStack: {
        screen: ContactusStack,
        navigationOptions: {
          header: null,
          tabBarIcon: contactTabIcon,
        }
      },



    },
    {
      tabBarPosition: 'bottom',

      animationEnabled: true,
      navigationOptions: (props) => {
        customProps = props
        console.log("value for navigation is " + JSON.stringify(props))
      },
      tabBarOptions: {
        activeTintColor: Colors.white,
        inactiveTintColor: 'red',
        activeBackgroundColor: Colors.white,

        inactiveBackgroundColor: Colors.white,
        showLabel: false,
        showIcon: true,
        animationEnabled: true,
        style: {
          backgroundColor: 'rgba(235,235,235,0.3)',
          height: 55,
          shadowOpacity: 0.5, // IOS
          elevation: 10,
          shadowColor: Colors.gray,
          borderTopWidth: 0,
          left: 0,
          right: 0,
          bottom: 0,
        },
        tabStyle: {
          width: 25,

        },
      },
    },
  )
)

var userPermissions1 = ""

class TabStackContainer extends Component {

  static router = TabStack.router;
  constructor(props) {
    super(props);
    this.state = {
      userInfo: '',
      isLoadingVisible: false,
      isMenuVisible: false,
      isDialogVisible: false,
      primaryColour: Colors.btn_color_orange,
      buttonBgColour: Colors.black,
      buttonTextColour: "",
      textColour: "",
      footerBgColour: "",
      footerTextColour: "",
      agentLogo: "",
      brandingJSON: '',
      userPermissions: ''
    };

  }


  componentDidMount() {
    SessionManager.getBranding().then((branding) => {
      // console.log("branding ss" + JSON.stringify(branding))

      if (branding) {
        var appBranding = JSON.parse(branding);
        // console.log("branding " + JSON.stringify(branding) + "   " + appBranding.primaryColour)

        this.setState({
          primaryColour: appBranding.primaryColour,
          buttonBgColour: appBranding.buttonBgColour,
          buttonTextColour: appBranding.buttonTextColour,
          textColour: appBranding.textColour,
          footerBgColour: appBranding.footerBgColour,
          footerTextColour: appBranding.footerTextColour,
          agentLogo: appBranding.agentLogo,
        });
      }
    });
    this.getUserPermissions()
  }

  getUserPermissions = () => {
    SessionManager.getLoginUserData().then((loginInfo) => {
      if (loginInfo) {
        let url = WebConstant.userPermissions
        new Promise(function (resolve, reject) {
          resolve(WebApi.getMultipPartRequest(url))
        }).then((jsonRes1) => {
          var jsonRes = JSON.parse(jsonRes1)

          userPermissions1 = jsonRes
          this.setState({
            userPermissions: jsonRes
          })
        })

      }
    });


  }


  render() {
    // console.log("render call " + JSON.stringify(this.state.primaryColour))
    const nav = this.props.navigation;
    return (
      <View style={{ flex: 1 }}>
        <TabStack navigation={nav}
          screenProps={{
            setLoginUserInfo: this.setLoginUserInfo,
            userInfo: this.state.userInfo,
            showSpinner: this.showSpinner,
            hideSpinner: this.hideSpinner,
            logoutUser: this.logoutUser,
            openSideMenu: this.openSideMenu,
            reporProblem: this.reporProblem,
            primaryColour: this.state.primaryColour,
            buttonBgColour: this.state.buttonBgColour,
            buttonTextColour: this.state.buttonTextColour,
            textColour: this.state.textColour,
            footerBgColour: this.state.footerBgColour,
            footerTextColour: this.state.footerTextColour,
            agentLogo: this.state.agentLogo,
            colorTheme: this.colorTheme,
            openReportDialog: this.openReportDialog,
            userPermissions: userPermissions1

          }} />
        <Spinner visible={this.state.isLoadingVisible} primaryColour={'#1D04BF'} />

        <SideMenu isMenuVisible={this.state.isMenuVisible}
          hideSideMenu={this.hideSideMenu}
          hideNavigation={this.hideNavigation}
          openSideMenu={this.openSideMenu}
          logoutUser={this.logoutUser}
          onOpenUrl={this.onOpenUrl}
          colorTheme={this.colorTheme}
        />

        <CustomeDialog isDialogVisible={this.state.isDialogVisible}
          hideDialog={this.hideDialog}
          hideDialogOnOutsideClick={this.hideDialogOnOutsideClick}
          openDialog={this.openDialog}
        />




      </View>
    );
  }


  onOpenUrl = (url) => {
    this.setState({ isMenuVisible: false });
    var pdfUrl = url
    Linking.openURL(pdfUrl)
  }


  setLoginUserInfo(userInfo) {
    this.setState({ userInfo: userInfo });
  }

  logoutUser = () => {
    this.setState({ userInfo: '' });
    SessionManager.logoutUserData();
  }

  showSpinner = () => {
    this.setState({ isLoadingVisible: true });
  }
  hideSpinner = () => {
    this.setState({ isLoadingVisible: false });

  }

  hideSideMenu = (tabName) => {
    this.setState({ isMenuVisible: false }, () => {
      setTimeout(() => {
        this.props.navigation.navigate(tabName)
      }, 400);
    });
  }

  colorTheme = () => {
    const { primaryColour } = this.state;
    if (primaryColour) {
      return this.state.primaryColour;
    } else {
      return Colors.btn_color_orange;
    }
  }

  hideNavigation = () => {
    this.setState({ isMenuVisible: false });
  }



  openSideMenu = () => {
    this.setState({ isMenuVisible: true });
  }
  reporProblem = () => {
    this.props.navigation.navigate("ReportProblem");
  }

  hideDialog = (tabName) => {
    this.props.navigation.navigate(tabName);
    this.setState({ isDialogVisible: false });
  }
  hideDialogOnOutsideClick = () => {
    this.setState({ isDialogVisible: false });
  }

  openDialog = () => {
    this.setState({ isDialogVisible: true });
  }


}
export default TabStackContainer;

