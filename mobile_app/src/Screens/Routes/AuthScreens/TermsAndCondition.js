import React, { Component } from 'react';
import { View, Text, TouchableOpacity, FlatList, Dimensions, StyleSheet, Platform, Image } from 'react-native';
import WebView from 'react-native-webview'
import { Colors, Styles, Strings, Constant, Images } from "Res";
import * as CommonFunction from '../../../Application/Utility/CommonFunction';
import * as SessionManager from '../../../Application/Utility/CustomManagers/SessionManager';
import { WebApi, WebConstant } from "NetworkHelper";
import BaseComponent from '../../BaseComponent';

export default class TermsAndCondition extends Component {
    constructor(props) {
        super(props);
        this.state = {
            agentID: '',
            blockID: '',
            unitID: '',
            branchID: '',
            email: '',
            loggedInUserID: '',
            isAgreed: false,
            isLoadingVisible: false,
        };
    }

    componentDidMount() {

        SessionManager.getLoginUserData().then((loginInfo) => {
            if (loginInfo) {
                var loginInformation = JSON.parse(loginInfo);
                this.setState({
                    agentID: loginInformation.agentID, blockID: loginInformation.blockID,
                    unitID: loginInformation.unitID, branchID: loginInformation.branchID,
                    loggedInUserID: loginInformation.userInternalID,
                    email: loginInformation.email
                });

            }
        });

    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>


                <WebView
                    style={styles.WebViewStyle}
                    source={{ uri: this.props.navigation.getParam('URL', 'NO-Item') }}

                />
                <View style={{ flex: .19, padding: 20, paddingBottom: 30 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity activeOpacity={.8} onPress={this.onCheckChange}>
                            <Image source={this.state.isAgreed ? Images.ic_check : Images.ic_uncheck} style={{ width: 25, height: 25, resizeMode: 'contain', }} />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 16, marginLeft: 10, color: Colors.black, color: '#DD7D3D' }}>{Strings.i_have_agree}</Text>
                    </View>

                    <TouchableOpacity onPress={this.onContinueClick} style={Styles.TouchableOpacityStyle}>
                        <Text style={[Styles.btnTextStyle]}>{Strings.continue}</Text>
                    </TouchableOpacity>

                </View>



            </View>
        );
    }

    onCheckChange = () => {
        this.setState({ isAgreed: !this.state.isAgreed });
    }





    onContinueClick = () => {
        let { isAgreed } = this.state
        if (!isAgreed) {
            CommonFunction.singleAlertDilog(Strings.err_need_to_agree, Strings.ok)
        } else {
            var Url = WebConstant.agree_to_terms

            new Promise(function (resolve, reject) {
                resolve(WebApi.putRequest(Url, ""))
            }).then((jsonRes1) => {
                var jsonRes = JSON.parse(jsonRes1)

                if (jsonRes.status == 'success') {

                    var logginDetail = {
                        agentID: this.state.agentID,
                        blockID: this.state.blockID,
                        branchID: this.state.branchID,
                        unitID: this.state.unitID,
                        email: this.state.email,
                        userInternalID: this.state.loggedInUserID,
                        loginStatus: 'LOGIN'

                    };

                    SessionManager.setLoginUserData(logginDetail);
                    this.props.navigation.navigate("TabStackContainer");

                } else {

                    if (jsonRes.message) {
                        CommonFunction.singleAlertDilogWithAction(jsonRes.message, "Ok", () => {
                        });
                    }
                }
            }).catch((error) => {
                console.log("error ifdss " + error)
            });

        }
    }
}
const styles = StyleSheet.create(
    {

        WebViewStyle:
        {
            justifyContent: 'center',
            alignItems: 'center',
            flex: .98,
            marginTop: (Platform.OS) === 'ios' ? 20 : 0
        }
    });
