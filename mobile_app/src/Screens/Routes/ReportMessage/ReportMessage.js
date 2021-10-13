import React, { Component } from 'react';
import { View, Text, Modal, TouchableOpacity, Dimensions, TouchableWithoutFeedback, Image, StyleSheet, Linking, TextInput } from 'react-native';
import { Colors, Fonts, Images, Strings, Styles, Constant } from "Res";
import * as CommonFunction from '../../../Application/Utility/CommonFunction';
const { width, height } = Dimensions.get('window');
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import base64 from 'react-native-base64'
import { WebApi, WebConstant } from "NetworkHelper";
import * as SessionManager from '../../../Application/Utility/CustomManagers/SessionManager';



let aspectRatio = height / width;



export default class ReportMessage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSettingsOpen: false,
            Complain: '',
            userInternalID: '',
            width:Dimensions.get('window').width,
            height:Dimensions.get('window').height
        };
    }

    componentDidMount() {
        Dimensions.addEventListener('change',()=>{
            this.setState({width:Dimensions.get('window').width,height:Dimensions.get('window').height},()=>{aspectRatio=this.state.height/this.state.width})
           })
        SessionManager.getLoginUserData().then((loginInfo) => {
            if (loginInfo) {
                var loginInformation = JSON.parse(loginInfo);
                this.setState({
                    userInternalID: loginInformation.userInternalID,
                });

            }
        });
    }

    render() {
        return (

            <KeyboardAwareScrollView style={{height:this.state.height,width:this.state.width,flex: 1, }} contentContainerStyle={{ flexGrow: 1, }} viewIsInsideTabBar={false} enableOnAndroid={true} bounces={false} keyboardShouldPersistTaps={"always"} showsVerticalScrollIndicator={false}>


                <View style={{
                    alignSelf: 'center',
                    width: this.state.width*0.95, height: aspectRatio > 1.6 ? 100 : 200, backgroundColor: '#D9EDF7', borderColor: '#BCE8F1', marginTop: 25,
                    borderWidth: 1.5, borderRadius: 4, padding: 5
                }}>
                    <Text style={MenuStype.textStyle}>{Strings.report_msg_1}</Text>
                </View>

                <Text style={[MenuStype.textStyle, { color: this.props.screenProps.primaryColour, width: this.state.width*0.95 }]}>{Strings.report_msg_2}</Text>

                <View style={{
                    width: this.state.width*0.95, height: 150, backgroundColor: Colors.white, borderColor: Colors.inptxt_grey,
                    borderWidth: 1.5, borderRadius: 20, alignSelf: 'center', marginTop: 20
                }}>
                    <TextInput style={{ flex: 1, padding: 10, fontSize: aspectRatio > 1.6 ? 15 : 30, color: 'black' }}
                        ref='Complain'
                        returnKeyType={"done"}
                        underlineColorAndroid='transparent'
                        maxLength={350}
                        textAlignVertical={"top"}
                        multiline={true}
                        value={this.state.Complain}
                        placeholderTextColor='gray'
                        onChangeText={(Complain) => this.setState({ Complain })} />



                </View>

                <TouchableOpacity onPress={() => this.onReportClick()} style={[Styles.TouchableOpacityStyle, { width: this.state.width*0.95, alignSelf: 'center', backgroundColor: this.props.screenProps.buttonBgColour }]}>
                    <Text style={[Styles.btnTextStyle, { color: this.props.screenProps.buttonTextColour }]}>{Strings.report}</Text>
                </TouchableOpacity>
            </KeyboardAwareScrollView>

        );
    }


    onReportClick = () => {
        let { Complain } = this.state
        const messagePacket = this.props.navigation.getParam('messagePacket', 'NO-Item');
        if (CommonFunction.isNull(Complain)) {
            CommonFunction.singleAlertDilog(Strings.err_complaint, Strings.ok)
        } else {
            this.props.screenProps.showSpinner();

            var url = WebConstant.report_message;

            var body = {
                "messageID": messagePacket.referenceID,
                "type": messagePacket.type,
                "explanation": this.state.Complain
            };

            new Promise(function (resolve, reject) {
                resolve(WebApi.putRequest(url, body))
            }).then((jsonRes1) => {
                this.props.screenProps.hideSpinner();
                setTimeout(() => {

                    var jsonRes = JSON.parse(jsonRes1)

                    if (jsonRes.status == 'success') {
                        CommonFunction.singleAlertDilogWithAction(jsonRes.message, "Ok", () => {
                            this.props.navigation.goBack(null);
                        });

                    } else {

                        if (jsonRes.message) {
                            CommonFunction.singleAlertDilogWithAction(jsonRes.message, "Ok", () => {
                            });
                        }
                    }
                }, 400);
                console.log("API Response " + JSON.stringify(jsonRes1));
            }).catch((error) => {
                console.log("error ifdss " + error)
            });
        }

    }


    settingsOpen = () => {
        this.setState({ isSettingsOpen: !this.state.isSettingsOpen });

    }

}
const MenuStype = StyleSheet.create({
    textStyle: {
        fontSize: aspectRatio > 1.6 ? 16 : 32,
        marginTop: 10,
        color: "#000",
        alignSelf: 'center',
        fontFamily: Fonts.SFProDisplayBold,
        justifyContent: "center",
        alignItems: 'center'
    },
    textStyleSimple: {
        fontSize: aspectRatio > 1.6 ? 14 : 28,
        color: "#000",
        alignSelf: 'center',
        marginLeft: 10,
        justifyContent: "center",
        alignItems: 'center'
    },

})
