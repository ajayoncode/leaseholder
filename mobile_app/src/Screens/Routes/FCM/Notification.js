import React, { Component } from 'react';
import { View, Text, TouchableOpacity, FlatList, Dimensions, StyleSheet, Platform, Image } from 'react-native';
import { Colors, Styles, Strings, Constant, Images, Fonts } from "Res";
import * as CommonFunction from '../../../Application/Utility/CommonFunction';
import * as SessionManager from '../../../Application/Utility/CustomManagers/SessionManager';
import { WebApi, WebConstant } from "NetworkHelper";
import BaseComponent from '../../BaseComponent';
import base64 from 'react-native-base64'
const { width, height } = Dimensions.get('window');
import HTML from 'react-native-render-html';
import moment from 'moment';

const aspectRatio = height / width;



export default class Notification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            agentID: '',
            blockID: '',
            unitID: '',
            branchID: '',
            loggedInUserID: '',
            isAgreed: false,
            'notificationList': []

        };
    }

    componentDidMount() {
        SessionManager.getLoginUserData().then((loginInfo) => {
            if (loginInfo) {
                var loginInformation = JSON.parse(loginInfo);
                this.setState({
                    agentID: loginInformation.agentID, blockID: loginInformation.blockID,
                    unitID: loginInformation.unitID, branchID: loginInformation.branchID,
                    loggedInUserID: loginInformation.userInternalID
                });

            }

            this.getNotification()
        });

    }

    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', backgroundColor: 'white' }}>

                <FlatList
                    data={this.state.notificationList}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item, index) => item.id}
                    renderItem={this._renderRow}
                />
            </View>
        );
    }


    _renderRow = ({ item, index }) => {
        return (
            <TouchableOpacity>
                <View style={{
                    flex: 1, borderRadius: 5, elevation: 5, margin: 5, padding: 10, width: width - 20,
                    shadowColor: 'rgba(0,0,0, .4)', shadowOffset: { height: 1, width: 1 }, shadowOpacity: 1,
                    backgroundColor: item.status == '0' ? 'white' : '#D3D3D3',

                }}>

                    <Text style={{ color: this.props.screenProps.primaryColour, fontSize: aspectRatio > 1.6 ? 20 : 40 }}>{item.module_name}</Text>
                    <HTML html={item.content} baseFontStyle={{ fontSize: aspectRatio > 1.6 ? 12 : 24, flex: .7, fmarginStart: 10, color: 'black' }} />
                    <Text style={{ color: Colors.black, fontSize: aspectRatio > 1.6 ? 12 : 24, flex: 4.2, fontFamily: Fonts.SFProDisplayRegular }}>Created At:<Text style={{ color: "#B4B4B4", }}> {moment(item.createdAt).format("Do MMM YYYY | hh:mm A")}</Text></Text>
                    <Text style={{ color: Colors.black, fontSize: aspectRatio > 1.6 ? 12 : 24, flex: 4.2, fontFamily: Fonts.SFProDisplayRegular }}>Updated At:<Text style={{ color: "#B4B4B4", }}> {moment(item.updatedAt).format("Do MMM YYYY | hh:mm A")}</Text></Text>

                </View>
            </TouchableOpacity>
        )
    }

    onNoticationRead = (item) => {
        this.props.screenProps.showSpinner();
        var url = WebConstant.mark_read;
        var body = { "notification_id": item.notificationID };
        new Promise(function (resolve, reject) {
            resolve(WebApi.putRequest(url, body))
        }).then((jsonRes1) => {

            this.props.screenProps.hideSpinner();

            var jsonRes = JSON.parse(jsonRes1)

            if (jsonRes.status == 'success') {

                this.getNotification()

            } else {

                if (jsonRes.message) {
                    CommonFunction.singleAlertDilogWithAction(jsonRes.message, "Ok", () => {
                    });
                }
            }
        }).catch((error) => {
            this.props.screenProps.hideSpinner();
            console.log("error  " + error)
        });

    }

    getNotification = () => {
        this.props.screenProps.showSpinner();
        var Url = WebConstant.get_Notification
        new Promise(function (resolve, reject) {
            resolve(WebApi.getMultipPartRequest(Url))
        }).then((jsonRes1) => {
            setTimeout(() => {
                this.props.screenProps.hideSpinner();

                var jsonRes = JSON.parse(jsonRes1)

                if (jsonRes.status == 'success') {

                    console.log("success  " + jsonRes)
                    this.setState({
                        notificationList: jsonRes.notifications,
                    })

                } else {

                    if (jsonRes.message) {
                        CommonFunction.singleAlertDilogWithAction(jsonRes.message, "Ok", () => {
                        });
                    }
                }
            }, 400);
        }).catch((error) => {
            this.props.screenProps.hideSpinner();
            console.log("error  " + error)
        });
    }







}
const styles = StyleSheet.create(
    {

        WebViewStyle:
        {
            justifyContent: 'center',
            alignItems: 'center',
            flex: .5,
            marginTop: (Platform.OS) === 'ios' ? 20 : 0
        }
    });
