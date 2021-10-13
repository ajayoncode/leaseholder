import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking, Dimensions } from 'react-native';
import { Colors, Fonts } from "Res";
import { WebApi, WebConstant } from "NetworkHelper";
import * as SessionManager from '../../../Application/Utility/CustomManagers/SessionManager';
const { width, height } = Dimensions.get('window');
const aspectRatio = height / width;
export default class PropertyDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            blockName: '',
            agentID: '',
            blockID: '',
            unitID: '',
            branchID: '',
            Unit_Address_1: '',
            Unit_Address_2: '',
            Unit_Address_3: '',
            Unit_Address_town: '',
            Unit_Address_post_code: '',
            agent_name: '',
            agent_add_1: '',
            agent_add_2: '',
            agent_add_3: '',
            agent_town: '',
            contactLabel1: '',
            contactValue1: '',
            contactLabel2: '',
            contactValue2: '',
            contactLabel3: '',
            contactValue3: '',
            viewPmEmail: '',
            pmEmail: '',
            labelForPM: '',
            viewSponsorEmail: '',
            labelForSponsor: '',
            sponsorName: '',
            sponsorEmail: '',
        };
    }

    componentDidMount = () => {
        this.didFocusSubs = this.props.navigation.addListener("didFocus", this.didFocusScreen)
    };

    didFocusScreen = () => {
        SessionManager.getLoginUserData().then((loginInfo) => {
            if (loginInfo) {
                var loginInformation = JSON.parse(loginInfo);
                this.setState({
                    agentID: loginInformation.agentID, blockID: loginInformation.blockID,
                    unitID: loginInformation.unitID, branchID: loginInformation.branchID
                });
                this.getPropertyDetail()
            }
        });
    }


    render() {
        return (
            <ScrollView>
                <View style={{ flex: 1, backgroundColor: 'white', padding: 20 }}>
                    <Text style={[styles.blodtext, { color: this.props.screenProps.textColour }]}>{this.state.blockName}</Text>
                    <Text style={[styles.yelloText, { color: this.props.screenProps.primaryColour, }]}>Your Property</Text>
                    <Text style={[styles.blodtext, { color: this.props.screenProps.textColour }]}>{this.state.Unit_Address_1}</Text>
                    <Text style={[styles.simpleText, { color: this.props.screenProps.textColour }]}>{this.state.Unit_Address_2 + ' ' + this.state.Unit_Address_3}</Text>
                    <Text style={[styles.simpleText, { color: this.props.screenProps.textColour }]}>{this.state.Unit_Address_town}</Text>
                    <Text style={[styles.simpleText, { color: this.props.screenProps.textColour }]}>{this.state.Unit_Address_post_code}</Text>
                    <Text style={[styles.yelloText, { color: this.props.screenProps.primaryColour, }]}>Your Managing Agent</Text>
                    <Text style={[styles.blodtext, { color: this.props.screenProps.textColour }]}>{this.state.agent_name}</Text>
                    <Text style={[styles.simpleText, { color: this.props.screenProps.textColour }]}>{this.state.agent_add_1}</Text>
                    {
                        this.state.agent_add_2 != "" &&
                        <Text style={[styles.simpleText, { color: this.props.screenProps.textColour }]}>{this.state.agent_add_2}</Text>
                    }
                    {
                        this.state.agent_add_3 != "" &&
                        <Text style={[styles.simpleText, { color: this.props.screenProps.textColour }]}>{this.state.agent_add_3}</Text>
                    }
                    {
                        this.state.agent_town != "" &&
                        <Text style={[styles.simpleText, { color: this.props.screenProps.textColour }]}>{this.state.agent_town}</Text>
                    }
                    {
                        this.state.agent_post_code != "" &&
                        <Text style={[styles.simpleText, { color: this.props.screenProps.textColour }]}>{this.state.agent_post_code}</Text>
                    }

                    {
                        this.state.contactLabel1 != "" && this.state.contactValue1 != "" &&
                        <View>
                            <Text style={[styles.yelloText, { color: this.props.screenProps.primaryColour, }]}>{this.state.contactLabel1}</Text>
                            <Text style={[styles.simpleText, { color: this.props.screenProps.textColour }]}>{this.state.contactValue1}</Text>
                        </View>
                    }

                    {
                        this.state.contactLabel2 != "" && this.state.contactValue2 != "" &&
                        <View>
                            <Text style={[styles.yelloText, { color: this.props.screenProps.primaryColour, }]}>{this.state.contactLabel2}</Text>
                            <Text style={[styles.simpleText, { color: this.props.screenProps.textColour }]}>{this.state.contactValue2}</Text>
                        </View>
                    }

                    {
                        this.state.contactLabel3 != "" && this.state.contactValue3 != "" &&
                        <View>
                            <Text style={[styles.yelloText, { color: this.props.screenProps.primaryColour, }]}>{this.state.contactLabel3}</Text>
                            <Text style={[styles.simpleText, { color: this.props.screenProps.textColour }]}>{this.state.contactValue3}</Text>
                        </View>
                    }

                    {
                        this.state.viewPmEmail == 1 && this.state.pmName != "" &&
                        <View>
                            <Text style={[styles.yelloText, { color: this.props.screenProps.primaryColour, }]}>{this.state.labelForPM}</Text>
                            <Text style={[styles.simpleText, { color: this.props.screenProps.textColour }]}>{this.state.pmName}</Text>
                            <TouchableOpacity onPress={() => Linking.openURL(`mailto:${this.state.pmEmail}`)}>
                                <Text style={{ color: this.props.screenProps.textColour, fontSize: aspectRatio > 1.6 ? 18 : 36, marginTop: aspectRatio > 1.6 ? 5 : 8, }}>{this.state.pmEmail}</Text>
                            </TouchableOpacity>
                        </View>
                    }

                    {
                        this.state.viewSponsorEmail == 1 && this.state.sponsorName != "" &&
                        <View>
                            <Text style={[styles.yelloText, { color: this.props.screenProps.primaryColour, }]}>{this.state.labelForSponsor}</Text>
                            <Text style={[styles.simpleText, { color: this.props.screenProps.textColour }]}>{this.state.sponsorName}</Text>
                            <TouchableOpacity onPress={() => Linking.openURL(`mailto:${this.state.sponsorEmail}`)}>
                                <Text style={{ color: Colors.txt_gray, fontSize: aspectRatio > 1.6 ? 18 : 36, marginTop: aspectRatio > 1.6 ? 5 : 8, }}>{this.state.sponsorEmail}</Text>
                            </TouchableOpacity>
                        </View>
                    }

                </View>
            </ScrollView>
        );
    }

    callMail = (text) => {
        var arr_split = text.split("or");
        Linking.openURL(`tel:${arr_split[0]}`)
    }

    callNumber = (text) => {
        var arr_split = text.split("t: ");
        Linking.openURL(`tel:${arr_split[1]}`)
    }



    getPropertyDetail = () => {
        this.props.screenProps.showSpinner();
        var Url = WebConstant.propertyDetail
        new Promise(function (resolve, reject) {
            resolve(WebApi.getMultipPartRequest(Url))
        }).then((jsonRes1) => {
            setTimeout(() => {
                this.props.screenProps.hideSpinner();
                var jsonRes = JSON.parse(jsonRes1)

                this.setState({
                    blockName: jsonRes.blockName,
                    Unit_Address_1: jsonRes.Unit_Address_1,
                    Unit_Address_2: jsonRes.Unit_Address_2,
                    Unit_Address_3: jsonRes.Unit_Address_3,
                    Unit_Address_town: jsonRes.Unit_Address_town,
                    Unit_Address_post_code: jsonRes.Unit_Address_post_code,
                    agent_name: jsonRes.agent_name,
                    agent_add_1: jsonRes.agent_add_1,
                    agent_add_2: jsonRes.agent_add_2,
                    agent_add_3: jsonRes.agent_add_3,
                    agent_post_code: jsonRes.agent_post_code,
                    agent_town: jsonRes.agent_town,
                    contactLabel1: jsonRes.contactLabel1,
                    contactValue1: jsonRes.contactValue1,
                    contactLabel2: jsonRes.contactLabel2,
                    contactValue2: jsonRes.contactValue2,
                    contactLabel3: jsonRes.contactLabel3,
                    contactValue3: jsonRes.contactValue3,
                    viewPmEmail: jsonRes.viewPmEmail,
                    pmEmail: jsonRes.pmEmail,
                    viewSponsorEmail: jsonRes.viewSponsorEmail,
                    pmName: jsonRes.pmName,
                    labelForPM: jsonRes.labelForPM,
                    labelForSponsor: jsonRes.labelForSponsor,
                    sponsorName: jsonRes.sponsorName,
                    sponsorEmail: jsonRes.sponsorEmail,
                })
            }, 400);

        }).catch((error) => {
            this.props.screenProps.hideSpinner();
            console.log("error ifdss " + error)
        });

    }
}
const styles = StyleSheet.create({
    yelloText: {
        fontFamily: Fonts.SFProDisplayBold,

        fontSize: aspectRatio > 1.6 ? 18 : 36,
        marginTop: aspectRatio > 1.6 ? 12 : 16
    },
    blodtext: {
        fontSize: aspectRatio > 1.6 ? 18 : 36,
        fontFamily: Fonts.SFProDisplayBold,
        color: '#000',
        marginTop: aspectRatio > 1.6 ? 12 : 16
    },
    simpleText: {
        fontSize: aspectRatio > 1.6 ? 18 : 36,
        fontFamily: Fonts.SFProDisplayRegular,
        color: '#AAAAAA',
        marginTop: aspectRatio > 1.6 ? 5 : 8
    },

})
