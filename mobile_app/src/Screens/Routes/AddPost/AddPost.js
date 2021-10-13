import React, { Component } from 'react';
import { Dimensions, Image, NativeModules, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { Images, Strings, Styles, Fonts, Colors } from "Res";
import * as CommonFunction from '../../../Application/Utility/CommonFunction';
import * as SessionManager from '../../../Application/Utility/CustomManagers/SessionManager';
import { WebApi, WebConstant } from "NetworkHelper";
import DatePicker from 'react-native-datepicker'
import base64 from 'react-native-base64'






const { width, height } = Dimensions.get('window');
const aspectRatio = height / width;
var _that;
export default class AddPost extends Component {
    constructor(props) {
        super(props);
        item = props.navigation.getParam('item', null)
        this.state = {
            title: item ? item.title : '',
            description: item ? item.message : '',
            expiry_date: '',
            userInternalID: '',
            agentID: '',
            blockID: '',
            unitID: '',
            date: item ? item.actionDate : '',
            item: props.navigation.getParam('item', null)
        };
        _that = this;
    }
    static navigationOptions = {

        headerRight: (
            <TouchableOpacity style={{ paddingRight: 20 }} onPress={() => { _that.openLicenseDialog() }}>
                <Image style={{ width: aspectRatio > 1.6 ? 25 : 40, height: aspectRatio > 1.6 ? 25 : 40, marginLeft: 8 }} source={Images.ic_info} ></Image>
            </TouchableOpacity>
        ),

    };

    componentDidMount() {
        SessionManager.getLoginUserData().then((loginInfo) => {
            if (loginInfo) {
                var loginInformation = JSON.parse(loginInfo);

                this.setState({
                    userInternalID: loginInformation.userInternalID,
                    agentID: loginInformation.agentID, blockID: loginInformation.blockID,
                });

            }
        });
    }

    render() {
        let isEdit = this.props.navigation.getParam('isEdit', false)
        return (
            <KeyboardAwareScrollView style={{ flex: 1, }}
                contentContainerStyle={{ flexGrow: 1, }}
                viewIsInsideTabBar={false} enableOnAndroid={true}
                bounces={false} keyboardShouldPersistTaps={"always"}
                showsVerticalScrollIndicator={false}>
                <View style={{ flex: 1, backgroundColor: 'white', padding: 20 }}>

                    <View style={{ marginTop: 10 }}>
                        <Text style={Styles.textStyle}>{Strings.title}</Text>
                    </View>
                    <View style={styles.txtInpStyle}>


                        <TextInput style={{ flex: 1, fontSize: aspectRatio > 1.6 ? 15 : 30, color: 'black', paddingLeft: 10 }}
                            ref='title'
                            returnKeyType={"next"}
                            underlineColorAndroid='transparent'
                            maxLength={50}
                            onSubmitEditing={(event) => { this.refs.description.focus() }}
                            value={this.state.title}
                            placeholderTextColor='gray'
                            onChangeText={(title) => this.setState({ title })} />


                    </View>

                    <View style={{ marginTop: 10 }}>
                        <Text style={Styles.textStyle}>{Strings.description}</Text>
                    </View>
                    <View style={[styles.txtInpStyle, { height: aspectRatio > 1.6 ? 100 : 200 }]}>

                        <TextInput style={{ flex: 1, height: aspectRatio > 1.6 ? 100 : 200, fontSize: aspectRatio > 1.6 ? 15 : 30, color: 'black', paddingLeft: 10 }}
                            ref='description'
                            returnKeyType={"done"}
                            underlineColorAndroid='transparent'
                            maxLength={150}
                            multiline={true}
                            value={this.state.description}
                            placeholderTextColor='gray'
                            onChangeText={(description) => this.setState({ description })} />
                    </View>

                    <View style={{ marginTop: 10, flexDirection: 'row', }}>
                        <Text style={Styles.textStyle}>{Strings.expiry_date}</Text>

                        <TouchableOpacity activeOpacity={.8} onPress={() => { _that.expiryDialog() }}>
                            <Image source={Images.ic_question}
                                style={{ width: aspectRatio > 1.6 ? 15 : 30, height: aspectRatio > 1.6 ? 15 : 30, resizeMode: 'contain', marginTop: 5 }} />
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.txtInpStyle, { marginTop: aspectRatio > 1.6 ? 5 : 10, flexDirection: 'row', height: aspectRatio > 1.6 ? 50 : 60, }]}>

                        <DatePicker
                            style={{ flex: 1, backgroundColor: Colors.transparents, marginTop: aspectRatio > 1.6 ? 0 : 5 }}
                            date={this.state.date}
                            mode="date"
                            placeholder="select date"
                            minDate={new Date()}
                            format="DD-MM-YYYY"
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            customStyles={{
                                dateInput: {
                                    alignItems: 'flex-start',
                                    borderColor: Colors.transparents,
                                    justifyContent: 'center',
                                    marginLeft: 5
                                },
                                dateText: {
                                    color: '#000',
                                    fontSize: aspectRatio > 1.6 ? 15 : 30,
                                    backgroundColor: Colors.transparents,

                                },
                                placeholderText: {
                                    color: Colors.inptxt_grey,
                                    fontSize: aspectRatio > 1.6 ? 15 : 30,

                                },
                                btnTextConfirm: {
                                    color: Colors.gray,

                                },
                                btnTextCancel: {
                                    color: Colors.gray,

                                }
                            }}
                            onDateChange={(date) => { this.setState({ date: date }) }}
                        />



                    </View>



                    <TouchableOpacity onPress={isEdit ? this.onEditPostClick : this.onAddPostClick} style={[Styles.TouchableOpacityStyle, { backgroundColor: this.props.screenProps.buttonBgColour }]}>
                        <Text style={[Styles.btnTextStyle, { color: this.props.screenProps.buttonTextColour }]}>{isEdit ? "Update Post" : Strings.add_post}</Text>
                    </TouchableOpacity>



                </View>
            </KeyboardAwareScrollView>
        );
    }

    expiryDialog = () => {
        CommonFunction.singleAlertDilogWithAction(Strings.expiry_text, "Ok", () => {
        });
    }


    onPressOpenDatePicker = () => {

    }

    openLicenseDialog = () => {
        CommonFunction.singleAlertDilogWithAction(Strings.info_add_post, "Ok", () => {
        });
    }

    onAddPostClick = () => {
        let { title, description, date, userInternalID, blockID, agentID } = this.state
        if (CommonFunction.isNull(title)) {
            CommonFunction.singleAlertDilog(Strings.err_title, Strings.ok)
        } else
            if (CommonFunction.isNull(description)) {
                CommonFunction.singleAlertDilog(Strings.err_desc, Strings.ok)
            } else {
                let body = {
                    'title': title,
                    'post': description,
                }

                if (!CommonFunction.isNull(date)) {
                    body.expiryDate = date;
                }

                console.log(`update data: ${JSON.stringify(body)}`)
                this.props.screenProps.showSpinner();
                new Promise(function (resolve, reject) {
                    resolve(WebApi.multiPartRequest(WebConstant.add_post, body))
                }).then((jsonRes1) => {
                    this.props.screenProps.hideSpinner();
                    setTimeout(() => {
                        this.props.screenProps.hideSpinner();
                        var jsonRes = JSON.parse(jsonRes1)
                        if (jsonRes.status == 'success') {
                            CommonFunction.singleAlertDilogWithAction('Post added successfully', "Ok", () => {
                                this.props.navigation.state.params.callAllMessageAPI && this.props.navigation.state.params.callAllMessageAPI()
                                this.props.navigation.goBack(null);
                            });
                        } else {
                            CommonFunction.singleAlertDilogWithAction(Strings.serverNotResponding, "Ok", () => {
                            });
                        }
                    }, 400);

                    console.log("API Response " + JSON.stringify(jsonRes1));

                }).catch((error) => {
                    console.log("error is catch " + JSON.stringify(error))
                    console.log(error)
                    CommonFunction.singleAlertDilogWithAction(Strings.serverNotResponding, "Ok", () => {

                    });
                });
            }
    }

    onEditPostClick = () => {

        let { title, description, date, userInternalID, blockID, agentID } = this.state
        if (CommonFunction.isNull(title)) {
            CommonFunction.singleAlertDilog(Strings.err_title, Strings.ok)
        } else
            if (CommonFunction.isNull(description)) {
                CommonFunction.singleAlertDilog(Strings.err_desc, Strings.ok)
            } else {
                let body = {
                    'title': title,
                    'description': description,
                    'referenceID': this.state.item.referenceID,
                    'type': this.state.item.type
                }


                if (!CommonFunction.isNull(date)) {
                    body.expiryDate = date;
                }

                console.log(`update data: ${JSON.stringify(body)}`)
                this.props.screenProps.showSpinner();
                let url = WebConstant.updateMessage
                new Promise(function (resolve, reject) {
                    resolve(WebApi.multiPartRequest(url, body))
                }).then((jsonRes1) => {
                    this.props.screenProps.hideSpinner();
                    setTimeout(() => {

                        var jsonRes = JSON.parse(jsonRes1)
                        if (jsonRes.status == 'success') {
                            CommonFunction.singleAlertDilogWithAction('Post updated successfully', "Ok", () => {
                                this.props.navigation.state.params.handleBackPress && this.props.navigation.state.params.handleBackPress()
                                this.props.navigation.goBack();
                                // this.props.navigation.goBack()
                            });
                        }
                    }, 400);
                    console.log("API Response " + JSON.stringify(jsonRes1));


                })
            }
    }



}
const styles = StyleSheet.create({

    txtInpStyle: {
        flexDirection: 'row',
        height: aspectRatio > 1.6 ? 50 : 60,
        borderRadius: aspectRatio > 1.6 ? 25 : 30,
        fontFamily: Fonts.SFProDisplayRegular,
        borderWidth: 1.5,
        borderColor: Colors.inptxt_grey,
        overflow: 'hidden'


    },
})