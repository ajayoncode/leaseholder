import React, { Component } from 'react'
import { Text, View, Image, Dimensions, TextInput, TouchableOpacity } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { Colors, Images, Strings, Styles } from "Res";
import * as CommonFunction from '../../../Application/Utility/CommonFunction';
import { WebConstant, WebApi } from "NetworkHelper";
import BaseComponent from '../../BaseComponent';
import Spinner from '../../../Application/CustomComponents/CustomViews/Spinner';
import * as SessionManager from '../../../Application/Utility/CustomManagers/SessionManager';
import { ScreenRatio } from '../../../Application/Utility/ScaleRatio';
const { width, height } = Dimensions.get('window');

const aspectRatio = height / width;
export default class Register extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            uniqueAccessCode: '',
            name: '',
            email: '',
            confirmEmail: '',
            isLoadingVisible: false,
            agentLogo: '',
            width:Dimensions.get('window').width,
            height:Dimensions.get('window').height
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
            <View style={{ height:this.state.height,width:this.state.width,flex:1}}>
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <KeyboardAwareScrollView style={{ flex: 1, }} contentContainerStyle={{ flexGrow: 1, }} viewIsInsideTabBar={false} enableOnAndroid={true} bounces={false} keyboardShouldPersistTaps={"handled"} showsVerticalScrollIndicator={false}>

                    <Image source={this.state.agentLogo != '' ? Image_Http_URL : Images.ic_logo} style={{ alignSelf: 'center',width: ScreenRatio(30), height: ScreenRatio(20), resizeMode: 'contain', marginTop: 10, marginBottom: 10 }} />

                        <View style={{ width: this.state.width - 60, marginTop: 10 }}>
                            <View style={{ flex: 1, marginBottom: 5 }}>
                                <Text style={Styles.textStyle}>{Strings.uniqueAccessCode}</Text>
                            </View>
                            <View style={Styles.txtInpStyle}>
                                <TextInput style={{ flex: 1, padding: 10, fontSize: ScreenRatio(1.8), color: 'black' }}
                                    ref='uniqueAccessCode'
                                    returnKeyType={"next"}
                                    maxLength={50}
                                    placeholder={'Enter ' + Strings.uniqueAccessCode}
                                    keyboardType="default"
                                    underlineColorAndroid='transparent'
                                    onSubmitEditing={(event) => { this.refs.name.focus() }}
                                    value={this.state.uniqueAccessCode}
                                    placeholderTextColor='gray'
                                    onChangeText={(uniqueAccessCode) => this.setState({ uniqueAccessCode })} />
                            </View>
                        </View>

                        <View style={{ width: this.state.width - 60, marginTop: 10 }}>
                            <View style={{ flex: 1, marginBottom: 5 }}>
                                <Text style={Styles.textStyle}>{Strings.names}</Text>
                            </View>
                            <View style={Styles.txtInpStyle}>


                                <TextInput style={{ flex: 1, padding: 10, fontSize: ScreenRatio(1.8), color: 'black' }}
                                    ref='name'
                                    returnKeyType={"next"}
                                    underlineColorAndroid='transparent'
                                    keyboardType="default"
                                    placeholder={'Enter ' + Strings.names}
                                    maxLength={50}
                                    onSubmitEditing={(event) => { this.refs.email.focus() }}
                                    value={this.state.name}
                                    placeholderTextColor='gray'
                                    onChangeText={(name) => this.setState({ name })} />


                            </View>
                        </View>



                        <View style={{ width: this.state.width - 60, marginTop: 10 }}>
                            <View style={{ flex: 1, marginBottom: 5 }}>
                                <Text style={Styles.textStyle}>{Strings.email}</Text>
                            </View>
                            <View style={Styles.txtInpStyle}>
                                <TextInput style={{ flex: 1, padding: 10, fontSize: ScreenRatio(1.8), color: 'black' }}
                                    ref='email'
                                    returnKeyType={"next"}
                                    keyboardType="email-address"
                                    underlineColorAndroid='transparent'
                                    maxLength={50}
                                    placeholder={'Enter ' + Strings.email}
                                    onSubmitEditing={(event) => { this.refs.confirmEmail.focus() }}
                                    value={this.state.email}
                                    autoCapitalize='none'
                                    placeholderTextColor='gray'
                                    onChangeText={(email) => this.setState({ email })} />


                            </View>
                        </View>


                        <View style={{ width: this.state.width - 60, marginTop: 10 }}>
                            <View style={{ flex: 1, marginBottom: 5 }}>
                                <Text style={Styles.textStyle}>{Strings.confirmEmail}</Text>
                            </View>
                            <View style={Styles.txtInpStyle}>

                                <TextInput style={{ flex: 1, padding: 10, fontSize: ScreenRatio(1.8), color: 'black' }}
                                    ref='confirmEmail'
                                    returnKeyType={"done"}
                                    keyboardType="email-address"
                                    underlineColorAndroid='transparent'
                                    maxLength={50}
                                    placeholder={'Enter ' + Strings.confirmEmail}
                                    value={this.state.confirmEmail}
                                    placeholderTextColor='gray'
                                    autoCapitalize='none'
                                    onChangeText={(confirmEmail) => this.setState({ confirmEmail })} />


                            </View>
                        </View>


                        <TouchableOpacity style={[Styles.TouchableOpacityStyle, { marginBottom:this.state.height > this.state.width ? ScreenRatio(14) : ScreenRatio(25),backgroundColor: this.state.buttonBgColour || '#fcfa17' }]} onPress={this.onCallAccessCodeApi}>
                            <Text style={[Styles.btnTextStyle, { color: this.state.buttonTextColour || '#060000' }]}>REGISTER</Text>
                        </TouchableOpacity>


                    </KeyboardAwareScrollView>
                    <Spinner visible={this.state.isLoadingVisible} />
                </View>
            </View>

        );
        this.setState({ isLoadingVisible: false })
    }

    onBackButtonClick = () => {
        this.props.navigation.goBack(null);

    }

    onCallAccessCodeApi = () => {
        const { uniqueAccessCode,
            name,
            email,
            confirmEmail, } = this.state;

        if (this.validateData(uniqueAccessCode, name, email, confirmEmail)) {
            var Url = WebConstant.access_Code + "/" + uniqueAccessCode + "/" + email;
            // this.showSpinner()
            this.setState({ isLoadingVisible: true })
            new Promise(function (resolve, reject) {
                resolve(WebApi.getRequest(Url))
            }).then((jsonRes1) => {
                //this.hideSpinner();
                this.setState({ isLoadingVisible: false }, () => {
                    setTimeout(() => {
                        var jsonRes = JSON.parse(jsonRes1)
                        if (jsonRes.status == 'success') {
                            this.setState({ isLoadingVisible: false })
                            var accessCodeInfo = {
                                Access_Code: jsonRes.Access_Code,
                            };
                            this.onCallRegisterApi(accessCodeInfo);

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
                console.log("error ifdss " + error)
            });


        }
    }

    onCallRegisterApi = (accessCodeInfo) => {
        const { name, email, uniqueAccessCode } = this.state;
        this.showSpinner()

        var body = {
            txtName: name,
            txtEmail: email,
            accessCode: uniqueAccessCode,
        };
        console.log("API Request " + JSON.stringify(body));
        new Promise(function (resolve, reject) {
            resolve(WebApi.multiPartRequest(WebConstant.complete_registration, body))
        }).then((jsonRes1) => {
            this.hideSpinner();
            this.setState({ isLoadingVisible: false }, () => {
                setTimeout(() => {

                    console.log("API Response " + JSON.stringify(jsonRes1));

                    this.setState({ isLoadingVisible: false })
                    var jsonRes = JSON.parse(jsonRes1)
                    if (jsonRes.status == 'success') {

                        if (jsonRes.message) {
                            this.setState({ isLoadingVisible: false })
                            CommonFunction.singleAlertDilogWithAction(jsonRes.message, "Ok", () => {
                                this.props.navigation.navigate("Login");
                            });
                        }


                    } else {
                        this.setState({ isLoadingVisible: false })
                        if (jsonRes.message) {
                            CommonFunction.singleAlertDilogWithAction(jsonRes.message, "Ok", () => {

                            });
                        }
                    }

                }, 400);
                console.log("API Response " + JSON.stringify(jsonRes1));



            })
        }).catch((error) => {
            this.setState({ isLoadingVisible: false })
            console.log("error ifdss " + error)
        });


    }


    validateData = (uniqueAccessCode,
        name,
        email,
        confirmEmail) => {
        var valid = false

        if ((uniqueAccessCode.length <= 0)) {
            CommonFunction.singleAlertDilog(Strings.uniqueAccessCodeValidation, Strings.ok)
        } else
            if (uniqueAccessCode.indexOf(' ') >= 0) {
                CommonFunction.singleAlertDilog(Strings.uniqueAccessCodeValidation1, Strings.ok)
            }
            else if ((name.length <= 0)) {
                CommonFunction.singleAlertDilog(Strings.nameValidation, Strings.ok)
            }
            else if (!CommonFunction.validateName(name)) {
                CommonFunction.singleAlertDilog(Strings.nameValidation1, Strings.ok)
            }
            else if ((email.indexOf(' ') >= 0 || email.length <= 0)) {
                CommonFunction.singleAlertDilog(Strings.emailValidation1, Strings.ok)
            }
            else if (!CommonFunction.validateEmail(email)) {
                CommonFunction.singleAlertDilog(Strings.emailValidation2, Strings.ok)
            }
            else if ((confirmEmail.length <= 0)) {
                CommonFunction.singleAlertDilog(Strings.confirmEmailValidation1, Strings.ok)
            }
            else if (!(email === confirmEmail)) {
                CommonFunction.singleAlertDilog(Strings.confirmEmailValidation, Strings.ok)
            } else {
                valid = true
            }
        return valid

    }

}