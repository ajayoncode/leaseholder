import React, { Component } from 'react';
import { Dimensions, Image, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import * as SessionManager from '../../../Application/Utility/CustomManagers/SessionManager';
import { Colors, Strings, Styles, Images } from "Res";
import * as CommonFunction from '../../../Application/Utility/CommonFunction';
import { WebConstant, WebApi } from "NetworkHelper";
import BaseComponent from '../../BaseComponent';
import { ScreenRatio } from '../../../Application/Utility/ScaleRatio';
const { width, height } = Dimensions.get('window');
const aspectRatio = height / width;

export default class ForgotPassword extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            isLoadingVisible: false,
            agentLogo: '',
            height:Dimensions.get('window').height,
            width:Dimensions.get('window').width
        };
    }

    componentDidMount() {
        Dimensions.addEventListener('change',()=>{
             this.setState({width:Dimensions.get('window').width,height:Dimensions.get('window').height})
            })

        SessionManager.getBranding().then((branding) => {
            if (branding) {
                var appBranding = JSON.parse(branding);
                this.setState({
                    agentLogo: WebConstant.SERVER_CORE + '/rel3/application/agent_logos/' + appBranding.agentLogo,
                    primaryColor: appBranding.primaryColour,
                    buttonBgColour: appBranding.buttonBgColour,
                    buttonTextColour: appBranding.buttonTextColour,
                    textColour: appBranding.textColour,
                    footerBgColour: appBranding.footerBgColour,
                    footerTextColour: appBranding.footerTextColour,
                });
            }
        });

    }

    render() {
        let Image_Http_URL = { uri: this.state.agentLogo };

        return (

            <View style={{ height:this.state.height,width:this.state.width,flex:1 }}>
                <View style={{ flex: 1, alignItems: 'center', backgroundColor: 'white' }}>
                    {this.viewSpinner()}
                    <KeyboardAwareScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1,justifyContent:'center' }} viewIsInsideTabBar={false} enableOnAndroid={true} bounces={false} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                    
                    <Image source={this.state.agentLogo != '' ? Image_Http_URL : Images.ic_logo} style={{ alignSelf: 'center', width: ScreenRatio(30), height: ScreenRatio(20), resizeMode: 'contain', marginTop: 10, marginBottom: 30 }} />

                        <View style={{ width: this.state.width - 60, }}>
                            <View style={{ flex: 1, marginBottom: 5 }}>
                                <Text style={Styles.textStyle}>Email ID</Text>
                            </View>
                            <View style={{ flexDirection: 'row', flex: 1, height: 55, borderRadius: 25, borderWidth: 1, borderColor: Colors.inptxt_grey, overflow: 'hidden' }}>
                                <View style={{ flex: .15, backgroundColor: 'gray', alignItems: 'center', justifyContent: 'center', borderRadius: 25, overflow: 'hidden' }}>
                                    <Image source={Images.ic_mail} style={{ width: 25, height: 25, resizeMode: 'contain', }} />
                                </View>
                                <View style={{ flex: .8, justifyContent: 'center' }}>


                                    <TextInput style={{ flex: 1, padding: 5, fontSize: ScreenRatio(1.8), color: Colors.black }}
                                        ref='email'
                                        value={this.state.email}
                                        placeholder="Email"
                                        // placeholderTextColor={Colors.black}
                                        keyboardType="email-address"
                                        returnKeyType={"next"}
                                        underlineColorAndroid='transparent'
                                        onChangeText={(email) => this.setState({ email })} />
                                </View>

                            </View>

                        </View>

                        <TouchableOpacity onPress={this.onForgotPasswordPress} style={[Styles.TouchableOpacityStyle, { marginBottom:ScreenRatio(30),marginTop:ScreenRatio(5),backgroundColor: this.state.buttonBgColour || '#fcfa17' }]}>
                            <View >
                                <Text style={[Styles.btnTextStyle, { color: this.state.buttonTextColour || '#060000' }]}>Forgot Password</Text>
                            </View>
                        </TouchableOpacity>



                    </KeyboardAwareScrollView>
                </View>
            </View>
        );
    }

    onBackButtonClick = () => {
        this.props.navigation.goBack(true);

    }
    handleBackPress = () => {
        this.props.navigation.navigate('Messages');
        return false;
    };

    onForgotPasswordPress = () => {
        const { email } = this.state;
        if (!CommonFunction.validateEmail(email)) {
            CommonFunction.singleAlertDilog(Strings.emailAlert, 'OK')
        } else {
            var body = {
                txtUID: email,
            };
            console.log("API Request " + JSON.stringify(body));
            this.showSpinner();
            new Promise(function (resolve, reject) {
                resolve(WebApi.multiPartRequest(WebConstant.forgot_password, body))
            }).then((jsonRes1) => {
                this.hideSpinner();
                this.setState({ isLoadingVisible: false }, () => {
                    setTimeout(() => {
                        console.log("API Response " + JSON.stringify(jsonRes1));
                        this.hideSpinner();
                        var jsonRes = JSON.parse(jsonRes1)
                        if (jsonRes.status == 'success') {
                            CommonFunction.singleAlertDilogWithAction(jsonRes.message, "Ok", () => {
                                this.props.navigation.navigate("Login");
                            });
                        } else {
                            if (jsonRes.message) {
                                CommonFunction.singleAlertDilogWithAction(jsonRes.message, "Ok", () => {

                                });
                            }
                        }
                    }, 400);
                    console.log("API Response " + JSON.stringify(jsonRes1));



                })


            }).catch((error) => {
                this.hideSpinner();
                console.log("error ifdss " + error)
            });

        }

    }

}


