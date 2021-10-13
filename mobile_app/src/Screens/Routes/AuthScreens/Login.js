import { WebApi, WebConstant } from "NetworkHelper";
import React from 'react';
import { Dimensions, Image, Text, TextInput, TouchableOpacity, View, Keyboard } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors, Constant, Fonts, Images, Strings, Styles } from "Res";
import * as CommonFunction from '../../../Application/Utility/CommonFunction';
import * as SessionManager from '../../../Application/Utility/CustomManagers/SessionManager';
import BaseComponent from '../../BaseComponent';
import { ScreenRatio} from '../../../Application/Utility/ScaleRatio';
let { width, height } = Dimensions.get('window');
let aspectRatio = (( height / width) );

export default class Login extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            isRemeber: false,
            isLoadingVisible: false,
            fcmToken: '',
            agentLogo: '',
            buttonBgColour: '',
            buttonTextColour: '',
            width:Dimensions.get('window').width,
            height:Dimensions.get('window').height
        };
    }

    componentDidMount() {
        Dimensions.addEventListener('change',()=>{
         this.setState({width:Dimensions.get('window').width,height:Dimensions.get('window').height})
        })
        SessionManager.getPreferenceData(Constant.sessionKey_IsRemeber).then((loginInfo) => {
            if (loginInfo) {
                var loginInformation = JSON.parse(loginInfo);
                if (loginInformation.isRemeber) {
                    this.setState({ email: loginInformation.email, password: loginInformation.password, isRemeber: true });
                }
            }
        });

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
            <View style={{ height:this.state.height,width:this.state.width,flex:1}}>
                <View style={{ flex: 1, alignItems: 'center' }}>
                    {this.viewSpinner()}
                    <KeyboardAwareScrollView style={{ flex: 1, }}
                        contentContainerStyle={{ flexGrow: 1, }}
                        viewIsInsideTabBar={false}
                        enableOnAndroid={true} bounces={false}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}>

                        <Image source={this.state.agentLogo != '' ? Image_Http_URL : Images.ic_logo} style={{ alignSelf: 'center', width: ScreenRatio(30), height: ScreenRatio(20), resizeMode: 'contain', marginTop: 30, marginBottom: 30 }} />

                        <View style={{ width: this.state.width - 60, }}>
                            <View style={{ flex: 1, marginBottom: 5 }}>
                                <Text style={Styles.textStyle}>{Strings.emailID}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', flex: 1, height: 50 , borderRadius: 25, borderWidth: 1.5, borderColor: Colors.inptxt_grey, overflow: 'hidden' }}>
                                <View style={{ flex:  .15, backgroundColor: '#7B7B7B', alignItems: 'center', justifyContent: 'center', borderRadius: 25, overflow: 'hidden' }}>
                                    <Image source={Images.ic_mail} style={{ width: 25, height: 25, resizeMode: 'contain', }} />
                                </View>
                                <View style={{ flex: .8, justifyContent: 'center', fontFamily: Fonts.SFProDisplayRegular, }}>
                                    <TextInput style={{ flex: 1, padding: 5, fontSize: ScreenRatio(1.8), color: Colors.black }}
                                        ref='email'
                                        placeholder="Email"
                                        onSubmitEditing={(event) => { this.refs.password.focus() }}
                                        value={this.state.email}
                                        keyboardType="email-address"
                                        returnKeyType={"next"}
                                        autoCapitalize='none'
                                        underlineColorAndroid='transparent'
                                        placeholderTextColor='gray'
                                        onChangeText={(email) => this.setState({ email })} />
                                </View>

                            </View>
                        </View>

                        <View style={{ width: this.state.width - 60, marginTop: 30 }}>
                            <View style={{ flex: 1, marginBottom: 5 }}>
                                <Text style={Styles.textStyle}>{Strings.password}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', flex: 1, height: 50, borderRadius: 25, borderWidth: 1.5, borderColor: Colors.inptxt_grey, overflow: 'hidden' }}>
                                <View style={{ flex: .15, backgroundColor: '#7B7B7B', alignItems: 'center', justifyContent: 'center', borderRadius: 25, overflow: 'hidden' }}>
                                    <Image source={Images.ic_lock} style={{ width: 25, height: 25, resizeMode: 'contain', }} />
                                </View>
                                <View style={{ flex: .8, justifyContent: 'center', fontFamily: Fonts.SFProDisplayRegular }}>
                                    <TextInput style={{ flex: 1, padding: 5, fontSize: ScreenRatio(1.8), color: Colors.black }}
                                        ref='password'
                                        secureTextEntry
                                        value={this.state.password}
                                        placeholder="Password"
                                        returnKeyType={"done"}
                                        keyboardType="default"
                                        underlineColorAndroid='transparent'
                                        placeholderTextColor='gray'
                                        onChangeText={(password) => this.setState({ password })} />
                                </View>

                            </View>
                        </View>


                        <View style={{ width: this.state.width - 60, flexDirection: 'row', marginTop: 15 }}>
                            <View style={{ flex: .5, flexDirection: 'row', alignItems: 'center' }}>
                                <TouchableOpacity activeOpacity={.8} onPress={this.onCheckChange}>
                                    {this.state.isRemeber ? <MaterialCommunityIcons name="check-box-outline" size={30} color={this.state.buttonBgColour || '#fcfa17'} />
                                        : <MaterialCommunityIcons name="checkbox-blank-outline" size={30} color={this.state.buttonBgColour || '#fcfa17'} />}
                                    {/* <Image source={this.state.isRemeber ? Images.ic_check : Images.ic_uncheck} style={{ width: (aspectRatio > 1.6) ? 25 : 35, height: (aspectRatio > 1.6) ? 25 : 35, resizeMode: 'contain', }} /> */}
                                </TouchableOpacity>
                                <Text style={{ fontSize: 16, marginLeft: 10, color: Colors.black }}>{Strings.rememberMe}</Text>
                            </View>
                            <TouchableOpacity onPress={this.onForgotPasswordClicked} style={{ flex: .5, alignItems: 'flex-end', justifyContent: 'center' }}>
                                <Text style={{ fontSize:  12 , textDecorationLine: 'underline', color: this.state.buttonBgColour || '#fcfa17' }}>{Strings.forgotPassword}</Text>
                            </TouchableOpacity>
                        </View>


                        <TouchableOpacity onPress={this.onLoginClicked} style={[Styles.TouchableOpacityStyle, { backgroundColor: this.state.buttonBgColour || '#fcfa17' }]}>
                            <Text style={[Styles.btnTextStyle, { color: this.state.buttonTextColour }]}>{Strings.login}</Text>
                        </TouchableOpacity>


                        <TouchableOpacity activeOpacity={.8} onPress={this.onRegisterClicked} style={{marginBottom:ScreenRatio(8)}}>
                            <View style={{ width: this.state.width - 60, paddingTop: ScreenRatio(3), alignItems: 'center' }}>
                                <Text style={{ fontSize: 16 , color: Colors.black }}>
                                    {Strings.haveUniqueAccessCode}
                                    <Text style={{ textDecorationLine: 'underline', color: this.state.buttonBgColour || '#fcfa17' }}
                                    >{Strings.Register}</Text>
                                </Text>
                            </View>
                        </TouchableOpacity>
    

                    </KeyboardAwareScrollView>
                </View>
            </View>
        );
        this.hideSpinner();
    }

    onLoginClicked = () => {

        Keyboard.dismiss()
        const { email, password, agentLogo } = this.state;

        if (((email.length <= 0) && (password.indexOf(' ') >= 0 || password.trim().length <= 0))) {
            CommonFunction.singleAlertDilog(Strings.emailPassword, Strings.ok)
        } else
            if ((email.length <= 0)) {
                CommonFunction.singleAlertDilog(Strings.emailValidation1, Strings.ok)
            } else
                if (!CommonFunction.validateEmail(email)) {
                    CommonFunction.singleAlertDilog(Strings.emailAlert, 'OK')
                } else if ((password.length <= 0)) {
                    CommonFunction.singleAlertDilog(Strings.passwordAlert, 'Ok')
                } else {
                    this.showSpinner()
                    var body = {
                        txtUID: email,
                        txtPWD: password,
                        mode: "app"
                    };
                    console.log("login API Request " + JSON.stringify(body));

                    new Promise(function (resolve, reject) {
                        resolve(WebApi.initAxios(email, password))
                    }).then(() => {
                        return new Promise(function (resolve, reject) {
                            resolve(WebApi.multiPartRequest(WebConstant.action_Login, body))
                        })
                    }).then((jsonRes1) => {
                        this.hideSpinner();
                        if (jsonRes1 != undefined) {
                            this.setState({ isLoadingVisible: false }, () => {

                                this.hideSpinner();
                                setTimeout(() => {
                                    // console.log("API Response " + JSON.stringify(jsonRes1));

                                    var jsonRes = JSON.parse(jsonRes1)
                                    if (jsonRes.status == 'success') {
                                        // console.log(" ********************** " + JSON.stringify(jsonRes.nextScreen))
                                        var userLoginDetails = {
                                            email: this.state.email,
                                            password: this.state.password,
                                            isRemeber: this.state.isRemeber,
                                        }

                                        SessionManager.setRecordIntoPreference(userLoginDetails, Constant.sessionKey_IsRemeber);
                                        this.redirectionCase(jsonRes.nextScreen, jsonRes)

                                    } else {
                                        if (jsonRes.message) {
                                            CommonFunction.singleAlertDilogWithAction(jsonRes.message, "Ok", () => {

                                            });
                                        }
                                    }
                                    console.log("API Response " + JSON.stringify(jsonRes1));


                                }, 400);

                            })
                        }


                    }).catch((error) => {
                        this.hideSpinner();
                        console.log("error is " + error)
                        CommonFunction.singleAlertDilogWithAction("Wrong email or/and password. Please try again.", "Ok", () => {

                        });
                    });

                }
    }

    redirectionCase = (param, jsonRes) => {

        switch (param) {
            case "Dashboard":
                {
                    var userInfo = {
                        agentID: jsonRes.agentID,
                        blockID: jsonRes.blockID,
                        branchID: jsonRes.branchID,
                        unitID: jsonRes.Unit_ID,
                        email: this.state.email,
                        userInternalID: jsonRes.userInternalID,
                        loginStatus: 'LOGIN',
                        ...jsonRes
                    };

                    this.getBranding(jsonRes.agentID, jsonRes.branchID, (value) => {
                        // SessionManager.setLoginUserData(userInfo);
                        // this.props.navigation.navigate("TabStackContainer");
                    })

                    setTimeout(() => {
                        SessionManager.setLoginUserData(userInfo);
                        this.props.navigation.navigate("TabStackContainer");
                    }, 1000);

                    break;
                }

            case "agreeTermsofServiceAjax":
                {
                    var userInfo = {
                        agentID: jsonRes.agentID,
                        blockID: jsonRes.blockID,
                        branchID: jsonRes.branchID,
                        unitID: jsonRes.Unit_ID,
                        email: this.state.email,
                        userInternalID: jsonRes.userInternalID,
                        loginStatus: 'NOT_LOGIN',
                        ...jsonRes

                    };

                    this.getBranding((value) => {
                    })


                    setTimeout(() => {
                        SessionManager.setLoginUserData(userInfo);
                        this.props.navigation.navigate('TermsAndCondition', {
                            URL: jsonRes.redirectLink
                        });
                    }, 1000);

                    break;

                }
            case "MyPreferences":
                {
                    var userInfo = {
                        agentID: jsonRes.agentID,
                        blockID: jsonRes.blockID,
                        branchID: jsonRes.branchID,
                        unitID: jsonRes.Unit_ID,
                        email: this.state.email,
                        userInternalID: jsonRes.userInternalID,
                        loginStatus: 'LOGIN',
                        ...jsonRes
                    };

                    this.getBranding((value) => {
                    })

                    setTimeout(() => {
                        SessionManager.setLoginUserData(userInfo);
                        this.props.navigation.navigate("TabStackContainer");
                    }, 1000);

                    break;

                    // var userInfo = {
                    //     agentID: jsonRes.agentID,
                    //     blockID: jsonRes.blockID,
                    //     branchID: jsonRes.branchID,
                    //     unitID: jsonRes.Unit_ID,
                    //     email: this.state.email,
                    //     userInternalID: jsonRes.userInternalID,
                    //     loginStatus: 'LOGIN'

                    // };

                    // this.getBranding((value) => {
                    //     console.log("AAGYA" + value)
                    //     SessionManager.setLoginUserData(userInfo);
                    //     this.props.navigation.navigate("Settings");
                    // })

                    // break;
                }


            case "RegisteredAgents":
                {
                    var userInfo = {
                        email: this.state.email,
                        loginStatus: 'NOT_LOGIN'

                    };
                    SessionManager.setLoginUserData(userInfo);
                    this.props.navigation.navigate("AgentScreens");
                    break;
                }



            case "registeredBlocks":
                {

                    // var userInfo = {
                    //     agentID: jsonRes.agentID,
                    //     email: this.state.email,
                    //     userInternalID: jsonRes.userInternalID,
                    //     loginStatus: 'NOT_LOGIN'

                    // };
                    // SessionManager.setLoginUserData(userInfo);
                    // this.props.navigation.navigate("BlockScreen");
                    // this.props.navigation.navigate("AgentScreens");
                    var userInfo = {
                        email: this.state.email,
                        loginStatus: 'NOT_LOGIN'

                    };
                    SessionManager.setLoginUserData(userInfo);
                    this.props.navigation.navigate("AgentScreens");
                    break;

                }

            default:


        }

    }



    onRegisterClicked = () => {
        this.props.navigation.navigate("Register");

    }

    onCheckChange = () => {
        this.setState({ isRemeber: !this.state.isRemeber });
    }


    onForgotPasswordClicked = () => {
        this.props.navigation.navigate("ForgotPassword");
    }


    // fcmnotification action defination
    onTappedNotification = (notif) => {
        console.log("notif is " + JSON.stringify(notif))
    }
}


