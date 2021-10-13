import React, { Component } from 'react';
import { View, Text, FlatList, Switch, Image, Dimensions, TextInput, StyleSheet, TouchableOpacity, Animated, Alert } from 'react-native';
import { Colors, Styles, Strings, Constant, Images } from "Res";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { Fonts } from 'Res';
import { WebApi, WebConstant } from "NetworkHelper";
import * as SessionManager from '../../../Application/Utility/CustomManagers/SessionManager';
import * as CommonFunction from '../../../Application/Utility/CommonFunction';
import base64 from 'react-native-base64'

const { width, height } = Dimensions.get('window');
const aspectRatio = height / width;
export default class ManageProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoadingVisible: false,
            addNameToDirectory: false,
            addTelephoneToDirectory: false,
            addMobileToDirectory: false,
            name: '',
            telephoneNumber: '',
            mobileNumber: '',
            userInternalID: '',
            unitAddress: '',
            correspondenseAddress: '',
            emailAddress: '',
            addEmailToDirectory: false,
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
            userCurrentPassword: ""
        };
    }


    componentDidMount() {
        SessionManager.getLoginUserData().then((loginInfo) => {
            if (loginInfo) {
                SessionManager.getPreferenceData(Constant.sessionKey_IsRemeber).then((userInfo) => {
                    const userInformation = JSON.parse(userInfo);
                    this.setState({ userCurrentPassword: userInformation.password })
                })
                var loginInformation = JSON.parse(loginInfo);
                this.setState({
                    userInternalID: loginInformation.userInternalID
                });
                this.getProfile()
            }
        });
    }

    getProfile = () => {
        this.props.screenProps.showSpinner();
        const Url = WebConstant.get_profile
        new Promise(function (resolve, reject) {
            resolve(WebApi.getMultipPartRequest(Url))
        }).then((jsonRes1) => {
            this.props.screenProps.hideSpinner();
            var jsonRes = JSON.parse(jsonRes1)
            if (jsonRes.status == 'success') {
                this.setState({
                    name: jsonRes.personCompanyDetails.user_name,
                    unitAddress: jsonRes.unitDetails.Unit_Address_1 + ', ' + jsonRes.unitDetails.Unit_Address_2
                        + ', ' + jsonRes.unitDetails.Unit_Address_town + ', ' + jsonRes.unitDetails.Unit_Address_post_code,
                    correspondenseAddress:
                        jsonRes.unitDetails.Person_Company_name + ', ' +
                        jsonRes.unitDetails.Correspondence_Address_1 + `${jsonRes.unitDetails.Correspondence_Address_1 === "" ? "" : ', '}` +
                        jsonRes.unitDetails.Correspondence_Address_2 + `${jsonRes.unitDetails.Correspondence_Address_2 === "" ? "" : ', '}` +
                        jsonRes.unitDetails.Correspondence_Address_3 + `${jsonRes.unitDetails.Correspondence_Address_3 === "" ? "" : ', '}` +
                        jsonRes.unitDetails.Correspondence_town + `${jsonRes.unitDetails.Correspondence_town === "" ? "" : ', '}` +
                        jsonRes.unitDetails.Correspondence_post_code + `${jsonRes.unitDetails.Correspondence_post_code === "" ? "" : ', '}` +
                        jsonRes.unitDetails.Correspondence_country,
                    telephoneNumber: jsonRes.personCompanyDetails.telephone_number,
                    mobileNumber: jsonRes.personCompanyDetails.mobile_number,
                    emailAddress: jsonRes.personCompanyDetails.Email_ID,
                    addNameToDirectory: jsonRes.userPreferences && (jsonRes.userPreferences.displayNameDirectory !== undefined && jsonRes.userPreferences.displayNameDirectory == '1') ? true : false,
                    addTelephoneToDirectory: jsonRes.userPreferences && (jsonRes.userPreferences.displayTelephoneDirectory !== undefined && jsonRes.userPreferences.displayTelephoneDirectory == '1') ? true : false,
                    addMobileToDirectory: jsonRes.userPreferences && (jsonRes.userPreferences.displayMobileDirectory !== undefined && jsonRes.userPreferences.displayMobileDirectory == '1') ? true : false,
                    addEmailToDirectory: jsonRes.userPreferences && (jsonRes.userPreferences.displayEmailDirectory !== undefined && jsonRes.userPreferences.displayEmailDirectory == '1') ? true : false,
                })
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

    switchHandler = (which) => {
        console.log(`switchHandler: ${which}`)
        if (which === 1)
            this.setState({ addNameToDirectory: !this.state.addNameToDirectory });
        else if (which === 2)
            this.setState({ addTelephoneToDirectory: !this.state.addTelephoneToDirectory });
        else if (which === 3)
            this.setState({ addMobileToDirectory: !this.state.addMobileToDirectory });
        else if (which === 4)
            this.setState({ addEmailToDirectory: !this.state.addEmailToDirectory });
    }
    onProfileUpdateClick = () => {
        let { name, addNameToDirectory, addTelephoneToDirectory, addMobileToDirectory, addEmailToDirectory, telephoneNumber, mobileNumber, userInternalID } = this.state
        if(name.length>0)
        {
        if (!CommonFunction.isNull(telephoneNumber) && telephoneNumber.length < 7) {
            CommonFunction.singleAlertDilog(Strings.err_telephone_wrong, Strings.ok)
        } else
            if (!CommonFunction.isNull(mobileNumber) && mobileNumber.length < 7) {
                CommonFunction.singleAlertDilog(Strings.err_mobile_wrong, Strings.ok)
            }
            else {
                this.props.screenProps.showSpinner();
                let body = {
                    'userName': name,
                    'Telephone_number': telephoneNumber,
                    'Mobile_Number': mobileNumber,
                    'displayNameDirectory': addNameToDirectory ? '1' : '0',
                    'displayTelephoneDirectory': addTelephoneToDirectory ? '1' : '0',
                    'displayMobileDirectory': addMobileToDirectory ? '1' : '0',
                    'displayEmailDirectory': addEmailToDirectory ? '1' : '0'
                }
                console.log(`update data: ${JSON.stringify(body)}`)
                new Promise(function (resolve, reject) {
                    resolve(WebApi.multiPartRequest(WebConstant.update_profile, body))
                }).then((jsonRes1) => {
                    this.props.screenProps.hideSpinner();
                    setTimeout(() => {
                        var jsonRes = JSON.parse(jsonRes1)
                        if (jsonRes.status == 'success') {
                            CommonFunction.singleAlertDilogWithAction(jsonRes.message, "Ok", () => {
                            });
                        }
                    }, 400);
                    console.log("API Response " + JSON.stringify(jsonRes1));
                })
            }
        }
        else
        Alert.alert("Alert",
        "Name can not be blank.",
        [          
          { text: "OK", onPress: () => console.log("OK Pressed") }
        ])
    }

    onPasswordUpdate = () => {
        let { userCurrentPassword, currentPassword, newPassword, confirmPassword } = this.state;
        console.log(" userCurrentPassword " + JSON.stringify(userCurrentPassword))
        console.log(" currentPassword " + JSON.stringify(currentPassword))
        if (CommonFunction.isNull(currentPassword)) {
            CommonFunction.singleAlertDilog(Strings.err_current_password, Strings.ok)
        }
        else if (currentPassword != userCurrentPassword) {
            CommonFunction.singleAlertDilog(Strings.err_current_password_not_match, Strings.ok)
        }
        else if (CommonFunction.isNull(newPassword)) {
            CommonFunction.singleAlertDilog(Strings.err_new_password, Strings.ok)
        }
        else if (newPassword === userCurrentPassword) {
            CommonFunction.singleAlertDilog(Strings.new_password_should_not_be_same_as_current_password, Strings.ok)
        }
        else if (newPassword.length < 8) {
            CommonFunction.singleAlertDilog("Password must be 8 character long", Strings.ok)
        }
        else if (CommonFunction.isNull(confirmPassword)) {
            CommonFunction.singleAlertDilog(Strings.err_confirm_password, Strings.ok)
        }
        else if (!(newPassword === confirmPassword)) {
            CommonFunction.singleAlertDilog(Strings.err_not_match_password, Strings.ok)
        }
        else {
            this.props.screenProps.showSpinner();
            let body = {
                'password': this.state.confirmPassword,
            }
            console.log("API Request " + JSON.stringify(body));
            var Url = WebConstant.update_password

            new Promise(function (resolve, reject) {
                resolve(WebApi.multiPartRequest(Url, body))
            }).then((jsonRes1) => {
                this.props.screenProps.hideSpinner();
                setTimeout(() => {
                    var jsonRes = JSON.parse(jsonRes1)
                    if (jsonRes.status == 'success') {
                        SessionManager.getPreferenceData(Constant.sessionKey_IsRemeber).then((userInfo) => {
                            const userInformation = JSON.parse(userInfo);
                            var userLoginDetails = {
                                email: userInformation.email,
                                password: this.state.newPassword,
                                isRemeber: true,
                            }
                            this.setState({ firstTimeComponentUpdate: true })
                            SessionManager.setRecordIntoPreference(userLoginDetails, Constant.sessionKey_IsRemeber);
                            SessionManager.getPreferenceData(Constant.sessionKey_IsRemeber).then((userInfo) => {
                                if (userInfo) {
                                    const userInformation = JSON.parse(userInfo);
                                    this.setState({ userCurrentPassword: userInformation.password, firstTimeComponentUpdate: false })
                                }
                            })
                        })
                        CommonFunction.singleAlertDilogWithAction('Password updated successfully', "Ok", () => {
                            this.setState({
                                currentPassword: '',
                                newPassword: '',
                                confirmPassword: ''
                            });
                        });
                    } else {
                        if (jsonRes.message) {
                            CommonFunction.singleAlertDilogWithAction(jsonRes.message, "Ok", () => {
                            });
                        }
                    }
                }, 400);
            }).catch((error) => {
                this.props.screenProps.hideSpinner();
                console.log("error ifdss " + error)
            });
        }
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <KeyboardAwareScrollView style={{ flex: 1 }} viewIsInsideTabBar={true} enableOnAndroid={true} bounces={false} keyboardShouldPersistTaps={"always"} showsVerticalScrollIndicator={false}>
                    <View style={{ flex: 1, marginBottom: 5, marginLeft: 10, marginRight: 10, marginTop: 10 }}>
                        <Text style={{ color: this.props.screenProps.primaryColour, fontSize: aspectRatio > 1.6 ? 22 : 32, fontFamily: Fonts.SFProDisplayBold }}>{Strings.profileAndInfo}</Text>

                        <View style={{ flexDirection: 'row', marginTop: aspectRatio > 1.6 ? 10 : 20, alignItems: 'center' }} >
                            <Text style={styles.HeadingBlackText}>{Strings.names}</Text>
                            <Text style={[styles.DisplayInDirectoryTextStyle, { color: this.props.screenProps.primaryColour }]}>{Strings.displayInDirectory}</Text>
                            <TouchableOpacity activeOpacity={.8} onPress={() => { this.showDialog(Strings.name_profile_dialog_text) }}>
                                <Image source={Images.ic_question}
                                    style={{ width: aspectRatio > 1.6 ? 15 : 30, height: aspectRatio > 1.6 ? 15 : 30, resizeMode: 'contain' }} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.switchHandler(1)}>
                                {/* <Image source={this.state.addNameToDirectory ? Images.ic_on : Images.ic_off} style={Styles.switchImageStyle} /> */}
                                <Switch
                                    trackColor={{ true: this.props.screenProps.primaryColour }}
                                    thumbColor={'white'}
                                    onValueChange={value => this.switchHandler(1)}
                                    value={this.state.addNameToDirectory ? true : false}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={[Styles.txtInpStyle, { marginTop: 10 }]}>
                            <TextInput style={styles.TextInputStyle}
                                ref='name'
                                returnKeyType={"done"}
                                underlineColorAndroid='transparent'
                                keyboardType="default"
                                placeholder={'Enter ' + Strings.names}
                                maxLength={50}
                                value={this.state.name}
                                placeholderTextColor={this.props.screenProps.textColour}
                                onChangeText={(name) => this.setState({ name })} />
                        </View>



                        <View style={{ flex: 1, flexDirection: 'column', marginTop: aspectRatio > 1.6 ? 10 : 20 }} >
                            <Text style={styles.HeadingBlackText}>{Strings.unitAddress}</Text>
                            <Text style={[styles.GrayTextStyle, { color: this.props.screenProps.textColour }]}>{this.state.unitAddress}</Text>
                        </View>

                        <View style={{ flex: 1, flexDirection: 'column', marginTop: aspectRatio > 1.6 ? 10 : 20 }} >
                            <View style={{ flexDirection: 'row' }} >
                                <Text style={[styles.HeadingBlackText, { flex: .5 }]}>{Strings.correspondenseAddress}</Text>
                                <TouchableOpacity activeOpacity={.8} onPress={() => { this.showDialog(Strings.address_profile_dialog_text) }}>
                                    <Image source={Images.ic_question}
                                        style={{ width: aspectRatio > 1.6 ? 15 : 30, height: aspectRatio > 1.6 ? 15 : 30, resizeMode: 'contain' }} />
                                </TouchableOpacity>
                            </View>
                            <Text style={[styles.GrayTextStyle, { color: this.props.screenProps.textColour }]}>{this.state.correspondenseAddress}</Text>
                        </View>



                        <View style={{ flex: 1, flexDirection: 'row', marginTop: aspectRatio > 1.6 ? 10 : 20, alignItems: 'center' }} >
                            <Text style={styles.HeadingBlackText}>{Strings.telephoneNumber}</Text>
                            <Text style={[styles.DisplayInDirectoryTextStyle, { color: this.props.screenProps.primaryColour }]}>{Strings.displayInDirectory}</Text>
                            <TouchableOpacity onPress={() => this.switchHandler(2)}>
                                {/* <Image source={this.state.addTelephoneToDirectory ? Images.ic_on : Images.ic_off} style={Styles.switchImageStyle} /> */}
                                <Switch
                                    trackColor={{ true: this.props.screenProps.primaryColour }}
                                    thumbColor={'white'}
                                    onValueChange={value => this.switchHandler(2)}
                                    value={this.state.addTelephoneToDirectory ? true : false}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={[Styles.txtInpStyle, { marginTop: 10 }]}>
                            <TextInput style={styles.TextInputStyle}
                                ref='telephone'
                                returnKeyType={"done"}
                                underlineColorAndroid='transparent'
                                keyboardType="numeric"
                                placeholder={Strings.telephoneNumber}
                                maxLength={15}
                                value={this.state.telephoneNumber == 'null' ? "" : this.state.telephoneNumber}
                                placeholderTextColor={this.props.screenProps.textColour}
                                onChangeText={(telephoneNumber) => this.setState({ telephoneNumber })} />
                        </View>


                        <View style={{ flex: 1, flexDirection: 'row', marginTop: aspectRatio > 1.6 ? 10 : 20, alignItems: 'center' }} >
                            <Text style={styles.HeadingBlackText}>{Strings.mobileNumber}</Text>
                            <Text style={[styles.DisplayInDirectoryTextStyle, { color: this.props.screenProps.primaryColour }]}>{Strings.displayInDirectory}</Text>
                            <TouchableOpacity onPress={() => this.switchHandler(3)}>
                                {/* <Image source={this.state.addMobileToDirectory ? Images.ic_on : Images.ic_off} style={Styles.switchImageStyle} /> */}
                                <Switch
                                    trackColor={{ true: this.props.screenProps.primaryColour }}
                                    thumbColor={'white'}
                                    onValueChange={value => this.switchHandler(3)}
                                    value={this.state.addMobileToDirectory ? true : false}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={[Styles.txtInpStyle, { marginTop: 10 }]}>
                            <TextInput style={styles.TextInputStyle}
                                ref='mobile'
                                returnKeyType={"done"}
                                underlineColorAndroid='transparent'
                                keyboardType="numeric"
                                placeholder={Strings.mobileNumber}
                                maxLength={15}
                                value={this.state.mobileNumber == 'null' ? "" : this.state.mobileNumber}
                                placeholderTextColor={this.props.screenProps.textColour}
                                onChangeText={(mobileNumber) => this.setState({ mobileNumber })} />
                        </View>





                        <View style={{ flex: 1, flexDirection: 'row', marginTop: aspectRatio > 1.6 ? 10 : 20, alignItems: 'center' }} >
                            <Text style={styles.HeadingBlackText}>{Strings.emailAddress}</Text>
                            <Text style={[styles.DisplayInDirectoryTextStyle, { color: this.props.screenProps.primaryColour }]}>{Strings.displayInDirectory}</Text>
                            <TouchableOpacity activeOpacity={.8} onPress={() => { this.showDialog(Strings.email_profile_dialog_text) }}>
                                <Image source={Images.ic_question}
                                    style={{ width: aspectRatio > 1.6 ? 15 : 30, height: aspectRatio > 1.6 ? 15 : 30, resizeMode: 'contain' }} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.switchHandler(4)}>
                                {/* <Image source={this.state.addEmailToDirectory ? Images.ic_on : Images.ic_off} style={Styles.switchImageStyle} /> */}
                                <Switch
                                    trackColor={{ true: this.props.screenProps.primaryColour }}
                                    thumbColor={'white'}
                                    onValueChange={value => this.switchHandler(4)}
                                    value={this.state.addEmailToDirectory ? true : false}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'column', marginTop: aspectRatio > 1.6 ? 10 : 20 }} >
                            <Text style={[styles.GrayTextStyle, { color: this.props.screenProps.textColour }]}>{this.state.emailAddress}</Text>
                        </View>

                        <TouchableOpacity onPress={this.onProfileUpdateClick} style={[Styles.TouchableOpacityStyle, { marginLeft: 5, marginRight: 5, marginBottom: 25, backgroundColor: this.props.screenProps.buttonBgColour }]}>
                            <Text style={[Styles.btnTextStyle, { color: this.props.screenProps.buttonTextColour }]}>{Strings.update}</Text>
                        </TouchableOpacity>

                        <View style={{ height: 1, width: width - 20, backgroundColor: Colors.light_gray, marginBottom: 10, marginTop: aspectRatio > 1.6 ? 5 : 10 }} />

                        <Text style={{ color: this.props.screenProps.primaryColour, fontSize: aspectRatio > 1.6 ? 22 : 32, fontFamily: Fonts.SFProDisplayBold }}>{Strings.changePassword}</Text>

                        <Text style={[styles.HeadingBlackText, { marginTop: aspectRatio > 1.6 ? 10 : 20 }]}>{Strings.currentPassword} </Text>
                        <View style={Styles.txtInpStyle}>
                            <TextInput style={styles.TextInputStyle}
                                ref='currentPassword'
                                returnKeyType={"next"}
                                underlineColorAndroid='transparent'
                                secureTextEntry
                                keyboardType="default"
                                value={this.state.currentPassword}
                                onSubmitEditing={(event) => { this.refs.newPassword.focus() }}
                                placeholderTextColor={this.props.screenProps.textColour}
                                onChangeText={(currentPassword) => this.setState({ currentPassword })} />
                        </View>


                        <Text style={[styles.HeadingBlackText, { marginTop: aspectRatio > 1.6 ? 10 : 20 }]}>{Strings.newPassword} </Text>
                        <View style={Styles.txtInpStyle}>
                            <TextInput style={styles.TextInputStyle}
                                ref='newPassword'
                                secureTextEntry
                                returnKeyType={"next"}
                                underlineColorAndroid='transparent'
                                keyboardType="default"
                                onSubmitEditing={(event) => { this.refs.confirmPassword.focus() }}
                                value={this.state.newPassword}
                                placeholderTextColor={this.props.screenProps.textColour}
                                onChangeText={(newPassword) => this.setState({ newPassword })} />
                        </View>


                        <Text style={[styles.HeadingBlackText, { marginTop: aspectRatio > 1.6 ? 10 : 20 }]}>{Strings.confirmPassword} </Text>
                        <View style={Styles.txtInpStyle}>
                            <TextInput style={styles.TextInputStyle}
                                ref='confirmPassword'
                                returnKeyType={"done"}
                                underlineColorAndroid='transparent'
                                secureTextEntry
                                keyboardType="default"
                                value={this.state.confirmPassword}
                                placeholderTextColor={this.props.screenProps.textColour}
                                onChangeText={(confirmPassword) => this.setState({ confirmPassword })} />
                        </View>


                        <TouchableOpacity onPress={this.onPasswordUpdate} style={[Styles.TouchableOpacityStyle, { marginLeft: 5, marginRight: 5, marginBottom: 15, backgroundColor: this.props.screenProps.buttonBgColour }]}>
                            <Text style={[Styles.btnTextStyle, { color: this.props.screenProps.buttonTextColour }]}>{Strings.update}</Text>
                        </TouchableOpacity>


                    </View>

                </KeyboardAwareScrollView>
            </View>
        );
    }

    showDialog = (dialogText) => {
        CommonFunction.singleAlertDilogWithAction(dialogText, "Ok", () => {
        });
    }






}


const styles = StyleSheet.create({
    HeadingBlackText: {
        fontSize: aspectRatio > 1.6 ? 16 : 32,
        fontFamily: Fonts.SFProDisplayBold,
        color: 'black',
        flex: 1
    },
    GrayTextStyle: {
        fontSize: aspectRatio > 1.6 ? 16 : 32,
        fontFamily: Fonts.SFProDisplayRegular,
        color: '#B4B4B4',
        marginBottom: aspectRatio > 1.6 ? 5 : 10,
    },
    TextInputStyle: {
        flex: 1, padding: 10, fontSize: aspectRatio > 1.6 ? 15 : 30, color: 'black'
    },
    DisplayInDirectoryTextStyle: {
        fontSize: aspectRatio > 1.6 ? 14 : 28, fontFamily: Fonts.SFProDisplayBold, marginStart: 10, marginEnd: 5,
    }
})