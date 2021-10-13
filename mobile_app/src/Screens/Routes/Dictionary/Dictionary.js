import React, { Component } from 'react';
import { View, Text, FlatList, Image, Dimensions } from 'react-native';
import { Colors, Styles, Strings, Constant, Images, Fonts } from "Res";
import * as SessionManager from '../../../Application/Utility/CustomManagers/SessionManager';
import { WebApi, WebConstant } from "NetworkHelper";

const { width, height } = Dimensions.get('window');
let aspectRatio = height / width;
export default class Dictionary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "dictionaryList": [],
            width:Dimensions.get('window').width,
            height:Dimensions.get('window').height
        };
    }

    componentDidMount() {
        Dimensions.addEventListener('change',()=>{
            this.setState({width:Dimensions.get('window').width,height:Dimensions.get('window').height},()=>{aspectRatio=this.state.height/this.state.width})
           })
        this.didFocusSubs = this.props.navigation.addListener("didFocus", this.didFocusScreen)
    }

    didFocusScreen = () => {
        SessionManager.getLoginUserData().then((loginInfo) => {
            if (loginInfo) {
                var loginInformation = JSON.parse(loginInfo);
                this.setState({
                    agentID: loginInformation.agentID, blockID: loginInformation.blockID,
                    unitID: loginInformation.unitID, branchID: loginInformation.branchID
                });
                this.getDirectoryContacts()
            }
        });
    }

    render() {
        return (
            <View style={{ height:this.state.height,width:this.state.width,flex: 1, alignItems: 'center', backgroundColor: 'white' }}>

                <FlatList
                    data={this.state.dictionaryList}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item, index) => item.id}
                    renderItem={this._renderRow}
                />
            </View>
        );
    }

    _renderRow = ({ item, index }) => {
        return (

            <View>


                {(item.displayNameDirectory == 1) ? (
                    <View style={{
                        width:this.state.width-40,flex: 1, borderRadius: 5, elevation: 5, margin: 5, padding: 10,
                        shadowColor: 'rgba(0,0,0, .4)', shadowOffset: { height: 1, width: 1 }, shadowOpacity: 1,
                        backgroundColor: 'white',

                    }}>

                        {(item.displayNameDirectory == 1) ? (
                            <Text style={{ color: this.props.screenProps.textColour, fontSize: aspectRatio > 1.6 ? 16 : 32 }}>{item.Unit_name}</Text>
                        ) : null}
                        {(item.displayNameDirectory == 1) ? (
                            <Text style={{ color: this.props.screenProps.primaryColour, fontFamily: Fonts.SFProDisplayBold, fontSize: aspectRatio > 1.6 ? 20 : 40 }}>{item.User_Name}</Text>
                        ) : null}


                        {(item.displayNameDirectory == 1 && item.displayEmailDirectory == 1) ? (
                            <View style={{ flexDirection: 'row', flex: 1, marginTop: aspectRatio > 1.6 ? 10 : 15 }}>
                                <Image source={Images.ic_email} style={{ flex: .1, width: aspectRatio > 1.6 ? 25 : 40, height: aspectRatio > 1.6 ? 25 : 40, resizeMode: 'contain', }} />
                                <Text style={{ flex: .9, color: this.props.screenProps.textColour, fontSize: aspectRatio > 1.6 ? 16 : 32 }}>{item.Email_Id}</Text>
                            </View>
                        ) : null}

                        {(item.displayNameDirectory == 1 && item.displayTelephoneDirectory == 1 && item.Telephone_number != null) ? (
                            <View style={{ flexDirection: 'row', flex: 1, marginTop: aspectRatio > 1.6 ? 10 : 15 }}>
                                <Image source={Images.ic_contact} style={{ flex: .1, width: aspectRatio > 1.6 ? 25 : 40, height: aspectRatio > 1.6 ? 25 : 40, resizeMode: 'contain', }} />
                                <Text style={{ flex: .9, color: this.props.screenProps.textColour, fontSize: aspectRatio > 1.6 ? 16 : 32 }}>{item.Telephone_number}</Text>
                            </View>
                        ) : null}

                        {(item.displayNameDirectory == 1 && item.displayMobileDirectory == 1 && item.Mobile_Number != null) ? (
                            <View style={{ flexDirection: 'row', flex: 1, marginTop: aspectRatio > 1.6 ? 10 : 15 }}>
                                <Image source={Images.ic_contact} style={{ flex: .1, width: aspectRatio > 1.6 ? 25 : 40, height: aspectRatio > 1.6 ? 25 : 40, resizeMode: 'contain', }} />
                                <Text style={{ flex: .9, color: this.props.screenProps.textColour, fontSize: aspectRatio > 1.6 ? 16 : 32 }}>{item.Mobile_Number}</Text>
                            </View>
                        ) : null}





                    </View>
                ) : null}



            </View>
        )
    }

    getDirectoryContacts = () => {
        this.props.screenProps.showSpinner();
        var Url = WebConstant.directory
        new Promise(function (resolve, reject) {
            resolve(WebApi.getMultipPartRequest(Url))
        }).then((jsonRes1) => {

            setTimeout(() => {

                this.props.screenProps.hideSpinner();

                var jsonRes = JSON.parse(jsonRes1)

                if (jsonRes.status == 'success') {

                    console.log("success  " + jsonRes)
                    this.setState({
                        dictionaryList: jsonRes.data,
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


