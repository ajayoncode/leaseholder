import React, { Component } from 'react';
import { View, Text, Modal, TouchableOpacity, Dimensions, ScrollView,TouchableWithoutFeedback, Image, StyleSheet, Linking } from 'react-native';
import { Colors, Fonts, Images, Strings, Styles, Constant } from "Res";
import * as CommonFunction from '../../../Application/Utility/CommonFunction';


import { WebApi } from "NetworkHelper";
import * as SessionManager from '../../../Application/Utility/CustomManagers/SessionManager';
import base64 from 'react-native-base64'
import WebConstant from "../../../Application/NetworkController/WebConstant";
import { ScreenRatio } from '../../../Application/Utility/ScaleRatio';
import { SafeAreaView } from 'react-navigation';

const { width, height } = Dimensions.get('window');
let aspectRatio = height / width;


export default class SideMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSettingsOpen: false,
            loggedInUserID: '',
            width:Dimensions.get('window').width,
            height:Dimensions.get('window').height
        };
    }

    componentDidMount = () => {
        Dimensions.addEventListener('change',()=>{
            this.setState({width:Dimensions.get('window').width,height:Dimensions.get('window').height},()=>{aspectRatio=this.state.height/this.state.width})
           })
        SessionManager.getLoginUserData().then((loginInfo) => {
            if (loginInfo) {

                var loginInformation = JSON.parse(loginInfo);

                this.setState({

                    loggedInUserID: loginInformation.userInternalID
                });
                // this.setNotificationToken(this.state.fcm)       

            }
        });
    };



    render() {
        return (
            <SafeAreaView>
            <Modal
                animationType="fade"
                transparent={true}
                visible={this.props.isMenuVisible}
                style={{ width: 400, height: 800 }}
                supportedOrientations={['portrait', 'landscape']}
                onRequestClose={() => {
                    //   Alert.alert('Modal has been closed.');
                }}>

                
                <View style={{ width: this.state.width, height: this.state.height, backgroundColor: 'rgba(0, 0, 0, 0.8)', flex: 1, flexDirection: 'row', }}>
                    <View style={{ flex: .3, height: this.state.height, }}>
                        <TouchableWithoutFeedback onPress={() => this.props.hideNavigation()} style={{ flex: 1, height: height }}>
                            <Text style={{ height: height }}></Text>
                        </TouchableWithoutFeedback>

                    </View>

                    <View style={{ width: aspectRatio > 1.6 ? 300 : 400, height: this.state.height, flex: .7 }}>
                        <Image source={Images.ic_bg} style={{ width: this.state.width, height: this.state.height, borderTopLeftRadius:ScreenRatio(2),tintColor: this.props.colorTheme() }} />
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{flexGrow:1}} style={{  height: this.state.height, position: 'absolute', marginTop: ScreenRatio(3),}}>
                            <TouchableOpacity style={{ paddingLeft: 20 }} onPress={() => this.props.hideSideMenu("HomeStack")}>
                                <View style={{ flexDirection: 'row',  }} >
                                    <Image source={Images.ic_home_white} style={MenuStype.imgStyle} />
                                    <Text style={MenuStype.textStyle}>{Strings.tabBarHome}</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity style={{ paddingLeft: 20 }} onPress={() => this.props.hideSideMenu("PropertyDetail")} >
                                <View style={{ flexDirection: 'row', marginTop: ScreenRatio(2), }} >
                                    <Image source={Images.ic_property_details_white} style={MenuStype.imgStyle} />
                                    <Text style={MenuStype.textStyle}>{Strings.property_detail}</Text>
                                </View>
                            </TouchableOpacity>



                            <TouchableOpacity style={{ paddingLeft: 20 }} onPress={() => this.props.hideSideMenu("MyAccountStack")}>
                                <View style={{ flexDirection: 'row', marginTop: ScreenRatio(2), }} >
                                    <Image source={Images.ic_manage_account_white} style={MenuStype.imgStyle} />
                                    <Text style={MenuStype.textStyle}>{Strings.manage_account}</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity style={{ paddingLeft: 20 }} onPress={() => this.props.hideSideMenu("MessagesStack")}>
                                <View style={{ flexDirection: 'row', marginTop: ScreenRatio(2), }} >
                                    <Image source={Images.ic_message_white} style={MenuStype.imgStyle} />
                                    <Text style={MenuStype.textStyle}>{Strings.tabBarMessages}</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity style={{ paddingLeft: 20, marginBottom: 6 }} onPress={() => this.props.hideSideMenu("DocumentsStack")}>
                                <View style={{ flexDirection: 'row', marginTop: ScreenRatio(2), }} >
                                    <Image source={Images.ic_documents_white} style={MenuStype.imgStyle} />
                                    <Text style={MenuStype.textStyle}>{Strings.tabBarDocuments}</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity style={{ paddingLeft: 20, marginBottom: 6 }} onPress={() => this.props.hideSideMenu("Dictionary")}>
                                <View style={{ flexDirection: 'row', marginTop: ScreenRatio(2), }} >
                                    <Image source={Images.ic_directory_white} style={MenuStype.imgStyle} />
                                    <Text style={MenuStype.textStyle}>{Strings.directory}</Text>
                                </View>
                            </TouchableOpacity>

                            {/*  <TouchableOpacity style={{ paddingLeft: 20, marginBottom: 6 }} onPress={() => this.props.hideSideMenu("Notification")}>
                                <View style={{ flexDirection: 'row', marginTop: (aspectRatio>1.6)?10:20, }} >
                                    <Image source={Images.ic_directory_white} style={MenuStype.imgStyle} />
                                    <Text style={MenuStype.textStyle}>{Strings.notification}</Text>
                                </View>
                            </TouchableOpacity> */}


                            <TouchableOpacity style={{ paddingLeft: 20, }} onPress={() => this.settingsOpen()}>
                                <View style={{ flexDirection: 'row', marginTop: ScreenRatio(2) }} >
                                    <Image source={Images.ic_settings_white} style={MenuStype.imgStyle} />
                                    <Text style={[MenuStype.textStyle, {marginRight:ScreenRatio(2),} ]}>{Strings.tabBarSettings}</Text>
                                    <Image source={this.state.isSettingsOpen ? Images.ic_arrow_up_white : Images.ic_arrow_down_white} style={MenuStype.imgStyle} />
                                </View>
                            </TouchableOpacity>


                            {
                                (this.state.isSettingsOpen) ?
                                    <View style={{ flexDirection: 'row', }}>
                                        <View style={{ flex: .1, }}></View>
                                        <View style={{ flex: .9, }}>


                                            <TouchableOpacity onPress={() => this.props.hideSideMenu("ManageProfile")}>
                                                <View style={{ flexDirection: 'row', marginTop: ScreenRatio(2), }} >
                                                    <Image source={Images.ic_manage_profile_white} style={MenuStype.imgStyle} />
                                                    <Text style={[MenuStype.textStyleSimple, { flex: 1 }]}>{Strings.manage_profile}</Text>
                                                </View>
                                            </TouchableOpacity>

                                            {/* personal setting screen */}
                                            <TouchableOpacity onPress={() => this.props.hideSideMenu("personalSettingScreen")}>
                                                <View style={{ flexDirection: 'row', marginTop: ScreenRatio(2), }} >
                                                    <Image source={Images.ic_settings_white} style={MenuStype.imgStyle} />
                                                    <Text style={[MenuStype.textStyleSimple, {  }]}>{Strings.personalSetting}</Text>
                                                </View>
                                            </TouchableOpacity>

                                            <TouchableOpacity onPress={() => this.props.onOpenUrl("https://www.blocksonline.co.uk/privacy-policy/")}>
                                                <View style={{ flexDirection: 'row', marginTop: ScreenRatio(2), }} >
                                                    <Image source={Images.ic_privacy_policy_white} style={MenuStype.imgStyle} />
                                                    <Text style={[MenuStype.textStyleSimple, { }]}>{Strings.privacy_policy}</Text>
                                                </View>
                                            </TouchableOpacity>

                                            <TouchableOpacity onPress={() => this.props.onOpenUrl(WebConstant.termsOfService)}>
                                                <View style={{ flexDirection: 'row', marginTop: ScreenRatio(2), }} >
                                                    <Image source={Images.ic_terms_service_white} style={MenuStype.imgStyle} />
                                                    <Text style={[MenuStype.textStyleSimple, { }]}>{Strings.terms}</Text>
                                                </View>
                                            </TouchableOpacity>

                                            {/*  <TouchableOpacity onPress={() => this.props.hideSideMenu("Settings")}>
                                                <View style={{ flexDirection: 'row', marginTop: 10 }} >
                                                    <Image source={Images.ic_your_setting_white} style={{ width: 25, height: 25, resizeMode: 'contain', }} />
                                                    <Text style={[MenuStype.textStyleSimple, { flex: 1 }]}>{Strings.my_settings}</Text>
                                                </View>
                                            </TouchableOpacity>
 */}
                                        </View>

                                    </View>

                                    :
                                    null
                            }


                            {/*  <View style={{
                                width: width, height: 1, backgroundColor: Colors.gradient_line, marginTop: 6
                            }}></View> */}

                            <TouchableOpacity style={{ paddingLeft: 20,paddingBottom:ScreenRatio(10) }} onPress={() => this.btnLogout()}>
                                <View style={{ flexDirection: 'row', marginTop: ScreenRatio(2), }} >
                                    <Image source={Images.ic_logout_white} style={MenuStype.imgStyle} />
                                    <Text style={MenuStype.textStyle}>{Strings.logout}</Text>
                                </View>
                            </TouchableOpacity>

                        </ScrollView>
                    </View>
                </View>


            </Modal>
            </SafeAreaView>


        );
    }

    RemoveNotificationToken = () => {
        var Url = WebConstant.remove_fcm

        new Promise(function (resolve, reject) {
            resolve(WebApi.deleteRequest(Url))
        }).then((jsonRes1) => {
            setTimeout(() => {

                var jsonRes = JSON.parse(jsonRes1)

                console.log("API Responsewww sidemenu : " + JSON.stringify(jsonRes));
                if (jsonRes.status == 'success') {
                    this.props.logoutUser();
                    this.props.hideSideMenu("Login");

                } else {
                    if (jsonRes.message) {
                        CommonFunction.singleAlertDilogWithAction(jsonRes.message, "Ok", () => {
                        });
                    }
                }
            }, 400);
        }).catch((error) => {
            console.log("error  " + error)
        });
    }

    settingsOpen = () => {
        this.setState({ isSettingsOpen: !this.state.isSettingsOpen });

    }

    btnLogout = () => {

        CommonFunction.doubleAlertDilog(Strings.logoutText, Strings.ok, Strings.cancel, () => {
            this.RemoveNotificationToken()



        }, () => {
            console.log("Negative Button press");

        });
    }

}
const MenuStype = StyleSheet.create({
    textStyle: {
        fontSize: ScreenRatio(2.5),
        color: "#fff",
        marginLeft: (aspectRatio > 1.6) ? 10 : 20,
        fontFamily: Fonts.SFProDisplayBold,
        justifyContent: "center",
        alignItems: 'center'
    },
    textStyleSimple: {
        fontSize: ScreenRatio(2.5),
        color: "#fff",
        marginLeft: (aspectRatio > 1.6) ? 10 : 20,
        justifyContent: "center",
        alignItems: 'center'
    },
    imgStyle: {
        width: (aspectRatio > 1.6) ? ScreenRatio(2) : ScreenRatio(3), height: (aspectRatio > 1.6) ? ScreenRatio(2) : ScreenRatio(3), resizeMode: 'contain',
    },

})
