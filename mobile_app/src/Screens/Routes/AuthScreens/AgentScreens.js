import React, { Component } from 'react';
import { View, Text, TouchableOpacity, FlatList, Dimensions, StyleSheet, BackHandler } from 'react-native';
import { Colors, Styles, Strings, Constant } from "Res";
import * as CommonFunction from '../../../Application/Utility/CommonFunction';
import * as SessionManager from '../../../Application/Utility/CustomManagers/SessionManager';
import { WebApi, WebConstant } from "NetworkHelper";
import BaseComponent from '../../BaseComponent';
import { ScreenRatio } from '../../../Application/Utility/ScaleRatio';


const { width, height } = Dimensions.get('window');
export default class AgentScreens extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            agentList: [],
            extraData: false,
            isLoadingVisible: false,
            width:Dimensions.get('window').width,
            height:Dimensions.get('window').height
        };
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    handleBackPress = () => {
        CommonFunction.doubleAlertDilog("Would you like to close the application?", "Ok", "Cancel", () => BackHandler.exitApp(), () => { }, () => {
        });
    };

    componentDidMount() {
        Dimensions.addEventListener('change',()=>{
            aspectRatio = (( Dimensions.get('window').height / Dimensions.get('window').width) )
             this.setState({width:Dimensions.get('window').width,height:Dimensions.get('window').height})
            })
        BackHandler.addEventListener('hardwareBackPress', () => {
            this.handleBackPress()
            return true;
        });
        SessionManager.getLoginUserData().then((loginInfo) => {
            if (loginInfo) {
                this.getAgentList();
            }
        });
    }

    render() {
        return (
            <View style={{ height:this.state.height,width:this.state.width,flex:1, alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
                {this.viewSpinner()}
                <Text style={{ color: Colors.black, fontSize: 20, alignSelf: 'center', marginTop: 40, marginLeft: 20, marginRight: 20 }}>{Strings.agentBlockHeaderMessage}</Text>
                <FlatList style={{ alignContent: 'center', marginTop: ScreenRatio(10) }}
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
                    width: this.state.width - 40, borderRadius: 2, borderWidth: 1.5,
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



                    <Text style={AgentStyle.textBoldStyle}>{item.agent_name} <Text style={AgentStyle.textLightStyle}></Text>{' -  ' + item.Block_name}
                        <Text style={AgentStyle.textBoldStyle}> {': ' + item.Unit_name}</Text></Text>


                </View>
            </TouchableOpacity>


        )
    }

    onAgentClick = (item) => {
        this.selectBlockAgent(item)
    }

    getAgentList = () => {
        // this.props.screenProps.showSpinner();
        var Url = WebConstant.agentblock_list_prefix
        this.showSpinner()
        new Promise(function (resolve, reject) {
            resolve(WebApi.getMultipPartRequest(Url))
        }).then((jsonRes1) => {

            // this.props.screenProps.hideSpinner();
            this.hideSpinner()
            var jsonRes = JSON.parse(jsonRes1)
            console.log("Response" + JSON.stringify(jsonRes1))
            if (jsonRes.status == 'success') {

                var agentListLocal = [];
                for (var i = 0; i < jsonRes.agentList.length; i++) {
                    agentListLocal.push({
                        "agent_ID": jsonRes.agentList[i].agent_ID,
                        "Unit_ID": jsonRes.agentList[i].Unit_ID,
                        "User_Internal_ID": jsonRes.agentList[i].User_Internal_ID,
                        "Block_name": jsonRes.agentList[i].Block_name,
                        "branchID": jsonRes.agentList[i].branchID,
                        "Unit_name": jsonRes.agentList[i].Unit_name,
                        "agent_name": jsonRes.agentList[i].agent_name,
                        "User_Internal_ID_encrypted": jsonRes.agentList[i].User_Internal_ID_encrypted,
                        "Unit_ID_encrypted": jsonRes.agentList[i].Unit_ID_encrypted,
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
            this.hideSpinner()
            console.log("error ifdss " + error)
        });

    }

    selectBlockAgent = (value) => {
        var Url = WebConstant.select_agent_list_prefix

        this.showSpinner()

        new Promise(function (resolve, reject) {
            resolve(WebApi.multiPartRequest(Url, {
                "user_id": value.User_Internal_ID,
                "unit_id": value.Unit_ID
            }))
        }).then((jsonRes1) => {
            var jsonRes = JSON.parse(jsonRes1)

            console.log("Response" + JSON.stringify(jsonRes1))

            if (jsonRes.status == 'success') {
                var blockDetail = {
                    blockID: jsonRes.blockID,
                    nextScreen: jsonRes.nextScreen,
                    agentID: value.agent_ID,
                    unitID: value.Unit_ID,
                    userInternalID: value.User_Internal_ID_encrypted,
                    Block_name: value.Block_name,
                    branchID: value.branchID,
                    Unit_name: value.Unit_name,
                    agent_name: value.agent_name,
                    User_Internal_ID_encrypted: value.User_Internal_ID_encrypted,
                    Unit_ID_encrypted: value.Unit_ID_encrypted,
                    loginStatus: 'LOGIN'
                };


                this.directionCase(jsonRes.nextScreen, blockDetail)

            } else {

                if (jsonRes.message) {
                    CommonFunction.singleAlertDilogWithAction(jsonRes.message, "Ok", () => {
                    });
                }
            }
        }).catch((error) => {
            this.hideSpinner()
            console.log("error ifdss " + error)
        });
    }

    directionCase = (param, blockDetail) => {
        switch (param) {
            case "Dashboard":
                this.getBranding((value) => {
                    console.log("AAGYA" + value)
                    SessionManager.setLoginUserData(blockDetail);
                    this.props.navigation.navigate("TabStackContainer");
                })
                break;

            case "agreeTermsofServiceAjax":
                this.getBranding((value) => {
                    console.log("AAGYA" + value)
                    SessionManager.setLoginUserData(blockDetail);
                    this.props.navigation.navigate("TabStackContainer");
                })
                break;

            case "MyPreferences":
                // this.getBranding( (value) => {
                //     console.log("AAGYA" + value)
                //     SessionManager.setLoginUserData(blockDetail);
                //     this.props.navigation.navigate("Settings");
                // })

                // break;

                this.getBranding((value) => {
                    console.log("AAGYA" + value)
                    SessionManager.setLoginUserData(blockDetail);
                    this.props.navigation.navigate("TabStackContainer");
                })
                break;

            case "agreetoTermsofservice":
                this.getBranding((value) => {
                    console.log("AAGYA" + value)
                    SessionManager.setLoginUserData(blockDetail);
                    this.props.navigation.navigate("TabStackContainer");
                })
                break;

            default:
        }

    }

}


const AgentStyle = StyleSheet.create({
    textBoldStyle: {
        fontSize: 14,
        color: Colors.black,
        justifyContent: "center",
        alignItems: 'center',
        marginTop: 10,
        paddingStart: 5,
        marginBottom: 10

    },
    textLightStyle: {
        fontSize: 12,
        color: Colors.txt_gray,
        justifyContent: "center",
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10
    },

})
