import React, { Component } from 'react';
import { View, Text, TouchableOpacity, FlatList, Dimensions, StyleSheet } from 'react-native';
import { Colors, Styles, Strings, Constant } from "Res";
import * as CommonFunction from '../../../Application/Utility/CommonFunction';
import * as SessionManager from '../../../Application/Utility/CustomManagers/SessionManager';
import { WebApi, WebConstant } from "NetworkHelper";
import BaseComponent from '../../BaseComponent';


const { width, height } = Dimensions.get('window');
export default class BlockScreen extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            agentList: [],
            extraData: false,
            isLoadingVisible: false,
        };
    }

    componentDidMount() {
        SessionManager.getLoginUserData().then((loginInfo) => {
            if (loginInfo) {
                var loginInformation = JSON.parse(loginInfo);
                this.getBlockList(loginInformation.userInternalID);

            }
        });

    }

    render() {
        return (
            <View style={{ flex: 1, alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
                {this.viewSpinner()}
                <Text style={{ color: Colors.black, fontSize: 20, alignSelf: 'center', marginTop: 40 ,marginLeft:20,marginRight:20}}>{Strings.agentBlockHeaderMessage}</Text>
                <FlatList style={{ alignContent: 'center', marginTop: 100 }}
                    data={this.state.agentList}
                    showsVerticalScrollIndicator={false}
                    renderItem={this._renderRow}
                />
            </View>
        );
    }

    _renderRow = ({ item, index }) => {
        return (
            <TouchableOpacity onPress={() => this.onAgentClick(item)}>
                <View style={{
                    width: width - 40, borderRadius: 2, borderWidth: 1.5,
                    borderColor: Colors.inptxt_grey,
                    marginLeft: 20,
                    marginRight: 20,
                    padding: 2,
                    marginTop: 5,
                    flexDirection: 'row',
                    overflow: 'hidden'

                }}
                    extraData={this.state.extraData}
                >


                    <View style={{ flexDirection: 'row' }}>
                        <Text style={AgentStyle.textBoldStyle}>{item.agent_name}
                            <Text style={AgentStyle.textLightStyle}></Text>{' -  ' + item.Block_name}</Text>
                        <Text style={AgentStyle.textLightStyle}>{item.Unit_name}</Text>
                    </View>

                </View>
            </TouchableOpacity>


        )
    }

    onAgentClick = (item) => {

        this.selectBlockAgent(item)

    }


    getBlockList = (value) => {

        var Url = WebConstant.select_block_list_prifix + value + WebConstant.select_block_list_suffix
        this.showSpinner()
        new Promise(function (resolve, reject) {
            resolve(WebApi.getMultipPartRequest(Url))
        }).then((jsonRes1) => {

            this.hideSpinner();
            var jsonRes = JSON.parse(jsonRes1)

            if (jsonRes.status == 'success') {

                var agentListLocal = [];
                for (var i = 0; i < jsonRes.agentList.length; i++) {
                    agentListLocal.push({
                        "Unit_ID": jsonRes.agentList[i].Unit_ID,
                        "User_Internal_ID": jsonRes.agentList[i].User_Internal_ID_encrypted,
                        "Block_name": jsonRes.agentList[i].Block_name,
                        "Unit_name": jsonRes.agentList[i].Unit_name,
                        "User_Internal_ID_encrypted": jsonRes.agentList[i].User_Internal_ID_encrypted,
                        "Unit_ID_encrypted": jsonRes.agentList[i].Unit_ID_encrypted,
                        loginStatus:'LOGIN'
                        

                    })
                }
                this.setState({
                    agentList: agentListLocal,
                    extraData: !this.state.extraData
                })

            } else {

                if (jsonRes.message) {
                    CommonFunction.singleAlertDilogWithAction(jsonRes.message, "Ok", () => {
                    });
                }
            }
        }).catch((error) => {
            this.hideSpinner();
            console.log("error ifdss " + error)
        });

    }



    selectBlockAgent = (value) => {

        var Url = WebConstant.select_agent_list_prifix + value.Unit_ID_encrypted + "/" + value.User_Internal_ID_encrypted + WebConstant.select_agent_list_suffix

        new Promise(function (resolve, reject) {
            resolve(WebApi.getMultipPartRequest(Url))
        }).then((jsonRes1) => {

            // this.props.screenProps.hideSpinner();

            var jsonRes = JSON.parse(jsonRes1)

            if (jsonRes.status == 'success') {
                var blockDetail = {
                    blockID: jsonRes.blockID,
                    nextScreen: jsonRes.nextScreen,
                    unitID: value.Unit_ID,
                    userInternalID: value.User_Internal_ID,
                    Block_name: value.Block_name,
                    branchID: jsonRes.branchID,
                    Unit_name: value.Unit_name,
                    User_Internal_ID_encrypted: value.User_Internal_ID_encrypted,
                    Unit_ID_encrypted: value.Unit_ID_encrypted,
                };


                this.directionCase(jsonRes.nextScreen, blockDetail)

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

    directionCase = (param, blockDetail) => {

        switch (param) {
            case "Dashboard":
                SessionManager.setLoginUserData(blockDetail);
                this.props.navigation.navigate("TabStackContainer");
                break;

            case "agreeTermsofServiceAjax":
                SessionManager.setLoginUserData(blockDetail);
                this.props.navigation.navigate("TabStackContainer");
                break;

            case "MyPreferences":
                SessionManager.setLoginUserData(blockDetail);
                this.props.navigation.navigate("Settings");
                break;

            case "agreetoTermsofservice":
                SessionManager.setLoginUserData(blockDetail);
                break;

            default:


        }

    }





}






const AgentStyle = StyleSheet.create({
    textBoldStyle: {
        fontSize: 10,
        color: Colors.black,
        justifyContent: "center",
        alignItems: 'center',
        marginTop: 10,
        paddingStart: 5,
        marginBottom: 10

    },
    textLightStyle: {
        fontSize: 8,
        color: Colors.txt_gray,
        justifyContent: "center",
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10
    },



})


