import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, Image, ScrollView, TextInput, NativeModules, Platform, FlatList, Keyboard } from 'react-native';
import Picker from '@react-native-community/picker'
import { Images, Strings, Styles, Colors, Fonts } from "Res";
import ActionSheet from 'react-native-action-sheet';
import * as ImagePicker from "react-native-image-picker"
import { WebApi, WebConstant } from "NetworkHelper";
import { selectImage } from '../../../Application/Utility/ImageSelectUtils';
import * as CommonFunction from '../../../Application/Utility/CommonFunction';
import CustomPicker from '../../../Application/CustomComponents/CustomViews/CustomPicker';
const PickerAndroid = NativeModules.PickerModule;
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import RNPickerSelect from 'react-native-picker-select';
import * as SessionManager from '../../../Application/Utility/CustomManagers/SessionManager';
import AndroidPermissionManager from '../../../Application/CustomComponents/AndroidPermissionManager'
import { ScreenRatio } from '../../../Application/Utility/ScaleRatio';
// var axios = require('axios');
// import fs from 'react-native-fs'
var RNFS = require('react-native-fs');
// var FormData = require('form-data');

const { width, height } = Dimensions.get('window');
let aspectRatio = height / width;
var _that;
var Button = [
    'Open Camera',
    'Open Gallery',
    'Cancel'
];
// var DESTRUCTIVE_INDEX = 1;
var CANCEL_INDEX = 2;
export default class ReportProblem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoadingVisible: false,
            problemSummary: '',
            detailProblem: '',
            ticketVisibility: '',
            selected: '',
            ticketVisibilityList: [],
            isVisiblePikcer: false,
            selectedValueIndex: 0,
            spinnerArray: [],
            imageArray: [],
            imageType: [],
            spinnerArrayDetails: [],
            imageURI: '',
            blockID: 0,
            loggedInUserID: 0,
            unitID: 0,
            agentID: 0,
            username: '',
            ticketVisibiltyOnoff: "",
            width:Dimensions.get('window').width,
            height:Dimensions.get('window').height
      
        };
        _that = this;
    }


    getUserDetail = () => {
        SessionManager.getLoginUserData().then((loginInfo) => {
            if (loginInfo) {
                var loginInformation = JSON.parse(loginInfo);

                this.setState({
                    agentID: loginInformation.agentID, blockID: loginInformation.blockID,
                    unitID: loginInformation.unitID, username: loginInformation.User_Name,
                    loggedInUserID: loginInformation.userInternalID
                });
            }
        });
    }

    componentDidMount() {
        Dimensions.addEventListener('change',()=>{
            this.setState({width:Dimensions.get('window').width,height:Dimensions.get('window').height},()=>{aspectRatio=this.state.height/this.state.width})
           })
        this.getUserDetail()
        this.ticketVisblityApiHandler()
    }

    ticketVisblityApiHandler = () => {
        SessionManager.getLoginUserData().then((loginInfo) => {
            if (loginInfo) {
                var Url = WebConstant.report_problem_Ticket_visiblity
                this.props.screenProps.showSpinner();
                new Promise(function (resolve, reject) {
                    resolve(WebApi.getRequest(Url))
                }).then(async (jsonRes1) => {
                    this.props.screenProps.hideSpinner();
                    var jsonRes = JSON.parse(jsonRes1)
                    console.log(" ////////////***************////////////// " + JSON.stringify(jsonRes))
                    if (jsonRes.branchID != "" || jsonRes.branchID != null || jsonRes.branchID != undefined) {
                        this.setState({ ticketVisibiltyOnoff: jsonRes.ticketVisibiltyOnoff }, () => {
                            setTimeout(() => {
                                this.getTicketValueApiCall();
                            }, 300);
                        })
                        // this.setState({ ticketVisibiltyOnoff: "2" })
                    }
                })
            }
        });
    }


    getTicketValueApiCall = () => {
        var url = WebConstant.report_problem;
        this.props.screenProps.showSpinner();
        new Promise(function (resolve, reject) {
            resolve(WebApi.getMultipPartRequest(url))
        }).then(async (jsonRes1) => {
            this.props.screenProps.hideSpinner();
            var jsonRes = JSON.parse(jsonRes1)
            if (jsonRes.status == 'success') {
                var SampleArray = [];
                const { ticketVisibiltyOnoff } = this.state;
                if (ticketVisibiltyOnoff == "0") {
                    this.setState({
                        spinnerArray: [],
                        spinnerArrayDetails: []
                    })
                } else if (ticketVisibiltyOnoff == "1") {
                    if (jsonRes.ticketVisibility.length > 0) {
                        jsonRes.ticketVisibility.map((val, index) => {
                            if (val.Type_Description === "Unit") {
                                SampleArray.push(jsonRes.ticketVisibility[index].Type_Description.toString());
                            }
                        })
                        this.setState({
                            spinnerArray: SampleArray,
                            spinnerArrayDetails: jsonRes.ticketVisibility,
                            selected: SampleArray[0],
                        })
                    }
                }
                else if (ticketVisibiltyOnoff == "2") {
                    if (jsonRes.ticketVisibility.length > 0) {
                        jsonRes.ticketVisibility.map((val, index) => {
                            if (index > 0) {
                                SampleArray.push(jsonRes.ticketVisibility[index].Type_Description.toString());
                                this.setState({
                                    spinnerArray: SampleArray,
                                    spinnerArrayDetails: jsonRes.ticketVisibility,
                                    selected: SampleArray[0],
                                })
                            }
                        })
                    }
                }
            }
        })
    }


    getImage = () => {

        ActionSheet.showActionSheetWithOptions({
            options: Button,
            cancelButtonIndex: CANCEL_INDEX,
            // destructiveButtonIndex: DESTRUCTIVE_INDEX,
            tintColor: this.props.screenProps.primaryColour
        },
            async (buttonIndex) => {
                console.log('button clicked :', buttonIndex);
                switch (buttonIndex) {
                    case 0:
                        if (Platform.OS == 'android') {
                            const isGranted = await AndroidPermissionManager.requestCameraPermission()
                            if (isGranted) {
                                ImagePicker.launchCamera({ mediaType: 'photo' }, (response) => {
                                    if (response.didCancel) {

                                    } else if (response.errorCode) {
                                        console.log('ImagePicker Error: >>>', response.errorMessage);
                                    } else {
                                        this.setState({
                                            imageArray: [...this.state.imageArray, response.uri],
                                            imageType: [...this.state.imageType, response.type]
                                        });
                                    }
                                })
                            }
                        } else {
                            ImagePicker.launchCamera({ mediaType: 'photo' }, (response) => {
                                this.setState({
                                    imageArray: [...this.state.imageArray, response.uri],
                                    imageType: [...this.state.imageType, response.type]
                                });
                            })
                        }
                        break;
                    case 1:
                        if (Platform.OS == 'android') {
                            const isGranted = await AndroidPermissionManager.requestGalleryPermission()
                            if (isGranted) {
                                ImagePicker.launchImageLibrary({ mediaType: 'photo' }, (response) => {
                                    if (response.didCancel) {

                                    } else if (response.errorCode) {
                                        console.log('ImagePicker Error: >>>', response.errorMessage);

                                    } else {
                                        this.setState({
                                            imageArray: [...this.state.imageArray, response.uri],
                                            imageType: [...this.state.imageType, response.type]
                                        });
                                    }
                                })
                            }
                        }
                        else {
                            ImagePicker.launchImageLibrary(
                                {
                                    mediaType: 'photo',
                                    includeBase64: false,
                                    maxHeight: 500,
                                    maxWidth: 500,
                                },
                                (response) => {
                                    this.setState({
                                        imageArray: [...this.state.imageArray, response.uri],
                                        imageType: [...this.state.imageType, response.type]
                                    });
                                    //   setResponse(response);
                                },
                            )
                        }
                        break;

                    default:
                        break;
                }
            });

        // selectImage().then(async response => {
        //     // console.log(" this is response of image select " + JSON.stringify(response))
        //     this.setState({
        //         imageArray: [...this.state.imageArray, response.uri],
        //         imageType: [...this.state.imageType, response.type]
        //     });
        // }).then(reject => {
        //     console.log(`error: ${reject}`)
        // })
    }


    submitReport = async () => {

        let { problemSummary, detailProblem, selected, imageURI, imageArray, spinnerArrayDetails, imageType } = this.state

        if (CommonFunction.isNull(problemSummary)) {
            CommonFunction.singleAlertDilog(Strings.err_msg_enter_summary, Strings.ok)
            Keyboard.dismiss()
        }
        else if (CommonFunction.isNull(detailProblem)) {
            CommonFunction.singleAlertDilog(Strings.err_msg_enter_details, Strings.ok)
            Keyboard.dismiss()
        }
        else if (CommonFunction.isNull(selected) && this.state.ticketVisibiltyOnoff !== "0") {
            CommonFunction.singleAlertDilog(Strings.err_msg_select_ticket_visibility, Strings.ok)
            Keyboard.dismiss()

        }

        else {
            let selectedValueInInt = 0
            spinnerArrayDetails.map((item) => {
                if (item.Type_Description === selected) {
                    selectedValueInInt = parseInt(item.Type_Id);
                }
            })

            this.props.screenProps.showSpinner();
            var bodyPar = new FormData();
            var timeStamp = Math.floor(Date.now() / 1000);
            let fileExtension = ""
            for (let i = 0; i < imageArray.length; i++) {
                fileExtension = imageArray[i].substr(imageArray[i].lastIndexOf('.') + 1);
                bodyPar.append(`fileIcon[]`, { uri: imageArray[i], type: imageType[i], name: `${timeStamp}.${fileExtension}` });
            }
            bodyPar.append('problemSummary', problemSummary);
            bodyPar.append('problemDetails', detailProblem);
            bodyPar.append('ticketVisibility', selectedValueInInt);
            bodyPar.append('blockID', this.state.blockID);
            bodyPar.append('loggedInUserID', this.state.loggedInUserID);
            bodyPar.append('unitID', this.state.unitID);
            bodyPar.append('agentID', this.state.agentID);
            bodyPar.append('username', this.state.username);

            new Promise(function (resolve, reject) {
                resolve(WebApi.onlyReportAproblumMultiPartRequest(WebConstant.create_report_problem, bodyPar))
            }).then(async (jsonRes1) => {
                this.setState({ isLoadingVisible: false }, () => {
                    this.props.screenProps.hideSpinner();
                    setTimeout(() => {
                        var jsonRes = JSON.parse(jsonRes1)
                        let msg = jsonRes.message;
                        if (jsonRes.status == 'success') {
                            CommonFunction.singleAlertDilogWithAction(msg, Strings.ok, () => {
                                this.props.navigation.goBack(null);
                            });
                        } else {
                            CommonFunction.singleAlertDilog(msg, Strings.ok)
                        }
                    }, 400);
                    console.log("API Response " + JSON.stringify(jsonRes1));
                })
            })
        }


    }

    onPressOpenPicker = () => {
        console.log("marital Clicked" + JSON.stringify(this.state.spinnerArray));
        Keyboard.dismiss()

        if (Platform.OS === 'android') {

            PickerAndroid.showDialog({ "itemArray": this.state.spinnerArray, "selectedData": "", "selectedIndex": this.state.selectedValueIndex })
                .then(function (result) {
                    _that.setState({ selected: result.selectedData, selectedValueIndex: result.selectedIndex });

                    setTimeout(() => {
                        _that.onPressSelectedAction(result.selectedData);
                    }, 500);


                })

        } else {
            this.setState({ isVisiblePikcer: true });
        }
    }
    onPressClosePicker = () => {
        Keyboard.dismiss()
        this.setState({ isVisiblePikcer: false })
    }
    onPressSelectedPicker = (value) => {
        Keyboard.dismiss()

        console.log("Selecred Valeeee " + value);
        this.setState({ selectedValueIndex: value })

    }

    onPressSelectedAction = () => {
        Keyboard.dismiss()

        var value = this.state.spinnerArray[this.state.selectedValueIndex]
        this.setState({ selected: value, isVisiblePikcer: false })
    }

    onTestClick = () => {
        CommonFunction.singleAlertDilogWithAction('Under Production', "Ok", () => {
        });
    }

    render() {
        let pickerObj = this.state.spinnerArray.map((item) => {
            return { label: item, value: item }
        })

        return (<View
            style={{ height:this.state.height,width:this.state.width,flex: 1 }}
        >
            <KeyboardAwareScrollView style={{ flex: 1, }} contentContainerStyle={{ flexGrow: 1, }} viewIsInsideTabBar={false} enableOnAndroid={true} bounces={false} keyboardShouldPersistTaps={"always"} showsVerticalScrollIndicator={false}>
                <View style={{ flex: 1, backgroundColor: 'white', padding: 20 }}>

                    <View style={{
                        alignSelf: 'center',
                        width: this.state.width - 40, backgroundColor: '#D9EDF7', borderColor: '#BCE8F1', marginTop: 25,
                        borderWidth: 1.5, borderRadius: aspectRatio > 1.6 ? 4 : 8, padding: ScreenRatio(2),paddingBottom:ScreenRatio(3),marginBottom:ScreenRatio(1.5)
                    }}>
                        <Text style={{
                            fontSize: aspectRatio > 1.6 ? 16 : 32,
                            marginTop: 10,
                            color: this.props.screenProps.textColour,
                            alignSelf: 'center',
                            fontFamily: Fonts.SFProDisplayBold,
                            justifyContent: "center",
                            alignItems: 'center'
                        }}>{Strings.report_problem_txt1}</Text>

                        <Text style={{
                            fontSize: aspectRatio > 1.6 ? 16 : 32,
                            marginTop: 20,
                            color: this.props.screenProps.textColour,
                            alignSelf: 'center',
                            justifyContent: "center",
                            alignItems: 'center'
                        }}>{Strings.report_problem_txt2}</Text>
                    </View>

                    <View style={{ flex: 1, marginBottom: 5, marginTop: 10 }}>
                        <Text style={Styles.textStyle}>{Strings.problemSummary}</Text>
                    </View>
                    <View style={Styles.txtInpStyle}>
                        <TextInput style={{ flex: 1, padding: 10, fontSize: aspectRatio > 1.6 ? 15 : 30, color: 'black' }}
                            ref='problemSummary'
                            returnKeyType={"next"}
                            underlineColorAndroid='transparent'
                            maxLength={50}
                            onSubmitEditing={(event) => { this.refs.detailProblem.focus() }}
                            value={this.state.problemSummary}
                            placeholderTextColor='gray'
                            onChangeText={(problemSummary) => this.setState({ problemSummary })} />


                    </View>

                    <View style={{ flex: 1, marginBottom: 5, marginTop: 10 }}>
                        <Text style={Styles.textStyle}>{Strings.detailProblem}</Text>
                    </View>
                    <View style={[Styles.txtInpStyle, { height: aspectRatio > 1.6 ? 100 : 200 }]}>

                        <TextInput style={{ flex: 1, padding: 10, fontSize: aspectRatio > 1.6 ? 15 : 30, color: 'black' }}
                            ref='detailProblem'
                            returnKeyType={"done"}
                            underlineColorAndroid='transparent'
                            maxLength={150}
                            textAlignVertical={"top"}
                            multiline={true}
                            value={this.state.detailProblem}
                            placeholderTextColor='gray'
                            onChangeText={(detailProblem) => this.setState({ detailProblem })} />
                    </View>
                    {this.state.ticketVisibiltyOnoff === "0" ? null :
                        <View>
                            <View style={{ marginTop: 10, flexDirection: 'row', }}>
                                <View style={{ marginBottom: 5, }}>
                                    <Text style={Styles.textStyle}>{Strings.ticketVisibility}</Text>
                                </View>

                                <TouchableOpacity activeOpacity={.8} onPress={() => { this.ticketDialog() }}>
                                    <Image source={Images.ic_question}
                                        style={{ width: aspectRatio > 1.6 ? 15 : 30, height: aspectRatio > 1.6 ? 15 : 30, resizeMode: 'contain', marginLeft: 10, marginTop: 5 }} />
                                </TouchableOpacity>
                            </View>
                            <View style={{
                                flex: 1,
                                paddingLeft: 8,
                                justifyContent: "center",
                                borderColor: Colors.inptxt_grey,
                                borderRadius: 25,
                                borderWidth: 0.5,
                                height: aspectRatio > 1.6 ? 50 : 60,
                                borderWidth: 1.5
                            }} >

                                <RNPickerSelect
                                    onValueChange={(value) => this.setState({ selected: value })}
                                    style={
                                        {
                                            inputIOS: { color: "#000" },
                                            inputAndroid: { color: "#000" },
                                            placeholderColor: "#000",
                                        }
                                    }
                                    items={pickerObj}
                                    value={this.state.selected}
                                    placeholder={{}}
                                />
                            </View>
                        </View>
                    }

                    <View style={{ flex: 1, marginBottom: 5, marginTop: 10 }}>
                        <Text style={Styles.textStyle}>{Strings.attachment}</Text>
                    </View>
                    <TouchableOpacity style={{ width: 100, height: 100, flex: .5 }} onPress={() => this.getImage()}>
                        <View style={{ margin: 10 }} >
                            <Image source={this.state.imageURI === '' ? Images.ic_add_report : { uri: this.state.imageURI }} style={{ width: 80, height: 80, resizeMode: 'contain', }} />
                        </View>
                    </TouchableOpacity>

                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 1 }}>
                            <FlatList
                                data={this.state.imageArray}
                                showsVerticalScrollIndicator={false}
                                keyExtractor={(item, index) => item.id}
                                renderItem={this._renderRow}
                                style={{ flex: 1, width: window.width }}
                                numColumns={3}
                            />
                        </View>




                    </View>




                    <TouchableOpacity style={[Styles.TouchableOpacityStyle, { backgroundColor: this.props.screenProps.buttonBgColour }]} onPress={() => this.submitReport()}>
                        <Text style={[Styles.btnTextStyle, { color: this.props.screenProps.buttonTextColour }]}>{Strings.send}</Text>
                    </TouchableOpacity>





                </View>
            </KeyboardAwareScrollView>

            <CustomPicker isVisible={this.state.isVisiblePikcer}
                cancelButtonPress={this.onPressClosePicker} selectedValue={this.state.selectedValueIndex}
                onChangeSelectedValue={this.onPressSelectedPicker} arrOfPicker={this.state.spinnerArray}
                requestButtonPress={this.onPressSelectedAction} />
        </View>
        );
    }



    _renderRow = ({ item, index }) => {
        return (
            <View style={{ margin: 10 }}>

                <Image source={{ uri: item }} style={{ width: aspectRatio > 1.6 ? 100 : 200, height: aspectRatio > 1.6 ? 100 : 200, resizeMode: 'contain', }} />
                {/* <Image source={Images.ic_add} style={{ width: 100, height: 100, resizeMode: 'contain', }} /> */}

            </View>
        )
    }

    ticketDialog = () => {
        CommonFunction.singleAlertDilogWithAction(Strings.ticket_text, "Ok", () => {
        });
    }


    pickerChange = (index) => {
        this.state.ticketVisibilityList.map(async (v, i) => {
            console.log(`item: ${index} ${i}`)
            if (index === i) {
                console.log(`Selelected item: ${JSON.stringify(v)} `)
                await this.setState({ selected: v })
            }
        })
    }

}